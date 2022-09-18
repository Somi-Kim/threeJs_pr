import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { DoubleSide, Material, RGBA_ASTC_10x5_Format, TextureLoader } from 'three'

/**
 * Base
 */

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/2.png')

// const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture, side: DoubleSide})
// const material = new THREE.MeshStandardMaterial()
const material = new THREE.MeshStandardMaterial()
material.side = DoubleSide
// material.metalness = 0.45
// material.roughness = 0.65
material.map = textureLoader.load('/textures/matcaps/3.png')
// gui.add(material, 'metalness').max(1).min(0).step(0.01)
// gui.add(material, 'roughness').max(1).min(0).step(0.01)


/**
 * Fonts
 */
const fontLoader = new FontLoader()

fontLoader.load(
    // '/fonts/CelestialModern.json',
    '/fonts/CelestialModern_Regular.json',
    (font) => {
        const textGeomtery = new TextGeometry(
            'CELESTIAL MODERN', {
            font: font,
            size: 1,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.5,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5 
        })

        textGeomtery.computeBoundingBox() // & bounding sphere
        textGeomtery.translate( // Geometry Method
            - textGeomtery.boundingBox.max.x * 0.5,
            - textGeomtery.boundingBox.max.y * 0.5,
            - textGeomtery.boundingBox.max.z * 0.5
        )
        const text = new THREE.Mesh(textGeomtery, material)
        
        scene.add(text)

    }
)

// const axexHelper = new THREE.AxesHelper(3);
// scene.add(axexHelper)


/**
 * Stars
 */
const verticlesOfStar = new Float32Array([
    0, 1, 0,      0, 0, 0.2,        -0.15, 0.15, 0,
    0, 1, 0,      0, 0, 0.2,        0.15, 0.15, 0,
    0, -1, 0,     0, 0, 0.2,        -0.15, -0.15, 0,
    0, -1, 0,     0, 0, 0.2,        0.15, -0.15, 0,
    1, 0, 0,      0.15, 0.15, 0,    0, 0, 0.2,
    1, 0, 0,      0.15, -0.15, 0,   0, 0, 0.2,
    -1, 0, 0,     -0.15, 0.15, 0,   0, 0, 0.2,
    -1, 0, 0,     -0.15, -0.15, 0,  0, 0, 0.2,
    0, 1, 0,      0, 0, -0.2,        -0.15, 0.15, 0,
    0, 1, 0,      0, 0, -0.2,        0.15, 0.15, 0,
    0, -1, 0,     0, 0, -0.2,        -0.15, -0.15, 0,
    0, -1, 0,     0, 0, -0.2,        0.15, -0.15, 0,
    1, 0, 0,      0.15, 0.15, 0,    0, 0, -0.2,
    1, 0, 0,      0.15, -0.15, 0,   0, 0, -0.2,
    -1, 0, 0,     -0.15, 0.15, 0,   0, 0, -0.2,
    -1, 0, 0,     -0.15, -0.15, 0,  0, 0, -0.2
])
const positionAttribute = new THREE.BufferAttribute(verticlesOfStar, 3)
const starGeometry = new THREE.BufferGeometry()
starGeometry.setAttribute('position', positionAttribute)

// const star = new THREE.Mesh(starGeometry, material)
// scene.add(star)

for(let i = 0; i < 200; i++) {
    const star = new THREE.Mesh(starGeometry, material)

    star.position.x = (Math.random() - 0.5) * 20
    star.position.y = (Math.random() - 0.5) * 20
    star.position.z = (Math.random() - 0.5) * 20

    star.rotation.x = Math.random() * Math.PI * 0.5
    star.rotation.x = Math.random() * Math.PI * 0.5

    const scale = Math.random()
    star.scale.set(scale, scale, scale)

    scene.add(star)
}


/**
 * Objects
 */ 
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const cube = new THREE.Mesh(geometry, material)
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)
// scene.add(cube)


/**
 * Size
 */
const size = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    size.width = window.innerWidth
    size.height = window.innerHeight

    // Update Camera
    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix() // Must be called after change of parameters.

    // Update Renderer
    renderer.setSize(size.width, size.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * Camera
 */
// Base Camera
const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100)

camera.position.x = 1
camera.position.y = 1
camera.position.z = 2

scene.add(camera)

// Control (OrbitControl)
const control = new OrbitControls(camera, canvas)
control.enableDamping = true // 컨트롤에 관성을 부여 -> 반드시 .update() 호출


/**
 * Light
 */
// let intensity = 10
const light = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
console.log(light)
gui.add(light, 'intensity').max(5).min(-5).step(0.1)
scene.add(light)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
}) // render in tick()
renderer.setSize(size.width, size.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update Controls
    control.update()

    // Update Light
    // light.intensity = intensity

    // Render
    renderer.render(scene, camera)

    // 다음 프레임에서도 tick 반복하기 위해 호출
    window.requestAnimationFrame(tick)
}

tick()