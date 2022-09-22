import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { _colorStringFilter } from 'gsap/gsap-core'

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
parameters.count = 10000
parameters.radius = 10
parameters.size = 0.001
parameters.branches = 3
parameters.spin = 1
parameters.randomness = 1
parameters.randomnessPower = 3

parameters.startColor = new THREE.Color('#ff0000')
parameters.endColor = new THREE.Color('#0000ff')

// parameters.spread = 10
// parameters.stretchX = 0.1
// parameters.stretchY = 1
// parameters.stretchZ = 0.1
// parameters.star = 6

let geometry = null
let material = null
let points = null
let colorStepR = 0
let colorStepG = 0
let colorStepB = 0
let objects = []

const generateGalaxy = () => {

    // Destroy old galaxy
    if(points !== null)
    {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    const colorStart = new THREE.Color(parameters.startColor)
    const colorEnd = new THREE.Color(parameters.endColor)
    
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })
    
    points = new THREE.Points(geometry, material)

    for(let i = 0; i < parameters.count; i++)
    {
        const i3 = i * 3

        /** Position */
        const radius = Math.random() * parameters.radius
        const spinAngle = radius * parameters.spin
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness
        

        const mixedColor = colorStart.clone()
        mixedColor.lerp(colorEnd, radius / parameters.radius)
        positions[i3    ] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ
    
        /** Color */
        colors[i3 + 0] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    points = new THREE.Points(geometry, material)
    scene.add(points)

/**
    if(points !== null) {
        geometry.dispose()
        material.dispose()
        objects.forEach(object => scene.remove(object))
        objects = []
    }
    
    console.log(parameters.startColor.r, parameters.startColor.g, parameters.startColor.b)
    console.log(parameters.endColor.r, parameters.endColor.g, parameters.endColor.b)
    colorStepR = parameters.startColor.r - parameters.endColor.r
    colorStepG = parameters.startColor.g - parameters.endColor.g
    colorStepB = parameters.startColor.b - parameters.endColor.b
    console.log(colorStepR, colorStepG, colorStepB)

    parameters.positions = new Float32Array(parameters.count * 3)
    parameters.colors = new Float32Array(parameters.count * 3)
    
    geometry = new THREE.BufferGeometry()
    material = new THREE.PointsMaterial({ 
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    for(let i = 0; i < parameters.count; i++) {
        const i3 = i * 3
        const radius = Math.random() * parameters.radius

        parameters.positions[i3] = radius * Math.sin(radius * parameters.stretchX) + Math.pow(Math.random() - 0.5, 3) * parameters.spread
        parameters.positions[i3 + 1] = Math.pow(Math.random() - 0.5, 3) * parameters.stretchY
        parameters.positions[i3 + 2] = - radius * Math.cos(radius * parameters.stretchZ) + Math.pow(Math.random() - 0.5, 3) * parameters.spread

        parameters.colors[i3] = parameters.startColor.r - (colorStepR * (radius / parameters.radius))
        parameters.colors[i3 + 1] = parameters.startColor.g - (colorStepG * (radius / parameters.radius))
        parameters.colors[i3 + 2] = parameters.startColor.b - (colorStepB * (radius / parameters.radius))
    }
    console.log(parameters.colors)
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(parameters.positions, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(parameters.colors, 3))
    console.log(geometry)
    
    for(let k = 0; k < parameters.star; k++) {
        points = new THREE.Points(geometry, material)
        points.rotateY(Math.PI * 2 / parameters.star * k)
        console.log(points)
        objects.push(points)
    }
    objects.forEach(object => scene.add(object))
*/
}

generateGalaxy()

gui.add(parameters, 'count').min(100).max(100000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0.001).max(1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.1).max(50).step(0.1).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(1).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(- 5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)


gui.addColor(parameters, 'startColor').onChange(generateGalaxy)
gui.addColor(parameters, 'endColor').onChange(generateGalaxy)

// gui.add(parameters, 'spread').min(1).max(30).step(0.5).onFinishChange(generateGalaxy)
// gui.add(parameters, 'stretchX').min(0.01).max(1).step(0.01).onFinishChange(generateGalaxy)
// gui.add(parameters, 'stretchY').min(0.1).max(20).step(0.1).onFinishChange(generateGalaxy)
// gui.add(parameters, 'stretchZ').min(0.01).max(1).step(0.01).onFinishChange(generateGalaxy)
// gui.add(parameters, 'star').min(1).max(20).step(1).onFinishChange(generateGalaxy)

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