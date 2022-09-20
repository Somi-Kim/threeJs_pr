import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test cube
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)
scene.add(cube)
 */


/**
 * Galaxy
 */
// const count = 1000
// const radius = 10

const parameters = {}
parameters.count = 5000
parameters.radius = 10
parameters.size = 0.001
parameters.spread = 1
parameters.narrow = 1
parameters.further = 1
parameters.star = 1
parameters.startColor = new THREE.Color('#ff0000')
parameters.endColor = new THREE.Color('#0000ff')
console.log(parameters.count)

let geometry = null
let material = null
let points = null
let objects = []
// console.log(geometry, material)

const generateGalaxy = () => {

    if(points !== null) {
        geometry.dispose()
        material.dispose()
        // objects.map(scene.remove(objects))
        objects.forEach(object => scene.remove(object))
        objects = []
    }
    
    const colorStepR = Math.abs(parameters.startColor.r - parameters.endColor.r) / parameters.count
    const colorStepG = Math.abs(parameters.startColor.g - parameters.endColor.g) / parameters.count
    const colorStepB = Math.abs(parameters.startColor.b - parameters.endColor.b) / parameters.count
    console.log(colorStepR, colorStepB, colorStepG)

    parameters.positions = new Float32Array(parameters.count * 3)
    parameters.colors = new Float32Array(parameters.count * 3)
    parameters.part = 3
    
    geometry = new THREE.BufferGeometry()
    material = new THREE.PointsMaterial({ 
        // color: parameters.startColor,
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    for(let i = 0; i < parameters.count; i++) {
        
        const i3 = i * 3
        const radius = Math.random() * parameters.radius

        parameters.positions[i3] = radius * Math.sin(radius) * parameters.narrow + Math.pow(Math.random() - 0.5, 3) * parameters.spread
        parameters.positions[i3 + 1] = Math.pow(Math.random() - 0.5, 3)
        parameters.positions[i3 + 2] = - radius * Math.cos(radius) * parameters.further + Math.pow(Math.random() - 0.5, 3) * parameters.spread

        if(parameters.startColor <= parameters.endColor) {
            parameters.colors[i3] = parameters.startColor.r + colorStepR * i
            parameters.colors[i3 + 1] = parameters.startColor.g + colorStepG * i
            parameters.colors[i3 + 2] = parameters.startColor.b + colorStepB * i
            // console.log(parameters.colors[i3])
        } else {
            parameters.colors[i3] = parameters.startColor.r - colorStepR * i
            parameters.colors[i3 + 1] = parameters.startColor.g - colorStepG * i
            parameters.colors[i3 + 2] = parameters.startColor.b - colorStepB * i
        }
        // parameters.colors[i3 + 1] = parameters.positions[i3 + 1] / radius
        // parameters.colors[i3 + 2] = parameters.positions[i3 + 2] / radius
        /**
         * 
        let i3 = i * 3
        let step = i * 0.001

        // parameters.positions[i3] = (Math.random() - 0.5) * parameters.radius
        // parameters.positions[i3 + 1] = (Math.random() - 0.5) * parameters.radius
        // parameters.positions[i3 + 2] = (Math.random() - 0.5) * parameters.radius

        parameters.positions[i3] = Math.cos(step) * step + (Math.random() * - 0.5) * 5
        parameters.positions[i3 + 1] = 0
        parameters.positions[i3 + 2] = - Math.sin(step) * step + (Math.random() * - 0.5) * 5

        if(i > 0) {
            parameters.colors[i3] += parameters.colors[i3 - 3]
            parameters.colors[i3 + 1] += parameters.colors[i3 - 2]
            parameters.colors[i3 + 2] += parameters.colors[i3 - 1]
        }
         */
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(parameters.positions, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(parameters.colors, 3))
    console.log(geometry)
    // material.color = new THREE.Float32BufferAttribute(parameters.color, 3)

    // points = new THREE.Points(geometry, material)

    // scene.add(points)   
    
    for(let k = 0; k < parameters.star; k++) {
        points = new THREE.Points(geometry, material)
        points.rotateY(Math.PI * 2 / parameters.star * k)
        objects.push(points)
        // scene.add(objects)
    }
    objects.forEach(object => scene.add(object))
}

generateGalaxy()

gui.add(parameters, 'count').min(100).max(10000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0.001).max(1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'spread').min(1).max(10).step(0.5).onFinishChange(generateGalaxy)
gui.add(parameters, 'narrow').min(0.1).max(2).step(0.1).onFinishChange(generateGalaxy)
gui.add(parameters, 'further').min(0.1).max(2).step(0.1).onFinishChange(generateGalaxy)
gui.add(parameters, 'star').min(1).max(6).step(1).onFinishChange(generateGalaxy)
// gui.add(parameters, 'startColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'startColor').onChange(generateGalaxy)
gui.addColor(parameters, 'endColor').onChange(generateGalaxy)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()