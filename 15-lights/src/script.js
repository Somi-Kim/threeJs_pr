import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
import { RectAreaLight } from 'three'
console.log(RectAreaLightHelper)


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
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// Oxffff : color
// 0.5 : intensity
// const ambientLight = new THREE.AmbientLight() <- 이렇게 생성하고 아래처럼 지정해도 OK
ambientLight.color = new THREE.Color(0xffffff)
ambientLight.intensity = 0.5  
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xff0000, 0.5)
directionalLight.position.set(1, 0.25, 0)
scene.add(directionalLight)
/** (color(skycolor), groundColor, intensity) */
const hemisphereLight = new THREE.HemisphereLight(0x00ff00, 0x0000ff, 0.3)
scene.add(hemisphereLight)

const pointLight = new THREE.PointLight(0xff9000, 0.5, 1, 2)
pointLight.position.set(1, -0.5, 1)
gui.add(pointLight, 'distance').min(0).max(10).step(0.01).name("pointLight distance")
gui.add(pointLight, 'decay').min(0).max(5).step(0.01).name("pointLight decay")
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
scene.add(pointLight)

/** 사진관 조명 스탠드(사각) 같은 및
 *  color, intensity, width, height 
 * & only with "MeshStandardMaterial" and "MeshPhysicalMaterial"
*/
const rectAreaLight = new THREE.RectAreaLight(0x4c00ff, 2, 1, 1)
rectAreaLight.position.set(- 1.5, 0, 1.5)
console.log(rectAreaLight)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)
gui.add(rectAreaLight.position, 'x').min(-5).max(5).step(0.01)
gui.add(rectAreaLight.position, 'y').min(-5).max(5).step(0.01)
gui.add(rectAreaLight.position, 'z').min(-5).max(5).step(0.01)

/** color, intensity, distance, angle, penumbra, decay */
const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
scene.add(spotLight)

/** spotLight's target should be "added in scene" */
spotLight.target.position.x = - 1
scene.add(spotLight.target)


/** Helpers */
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)
window.requestAnimationFrame(() => {
    spotLightHelper.update()
})

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime


    rectAreaLight.lookAt(new THREE.Vector3())

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()