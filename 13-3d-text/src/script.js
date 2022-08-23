import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

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
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')


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
            height: 0.3,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5 
        })

        textGeomtery.computeBoundingBox() // & bounding sphere
        textGeomtery.translate( // Geometry Method
        )
    
        // Text Material


        // Text Mesh

    }
)


/**
 * Objects
 */ 
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial()
// const cube = new THREE.Mesh(geometry, material)
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)
scene.add(cube)


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
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix() // Must be called after change of parameters.

    // Update Renderer
    renderer.setSize(size.width, size.height)
})


/**
 * Camera
 */
// Base Camera
const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100)
scene.add(camera)

// Control (OrbitControl)
const control = new OrbitControls(camera, canvas)
control.enableDamping = true // 컨트롤에 관성을 부여 -> 반드시 .update() 호출


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
}) // render in tick()
renderer.setSize(size.width, size.height)
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update Controls
    control.update()

    // Render
    renderer.render(scene, camera)

    // 다음 프레임에서도 tick 반복하기 위해 호출
    window.requestAnimationFrame(tick)
}

tick()