import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Mesh, MeshToonMaterial, TextureLoader } from 'three'
import * as dat from 'dat.gui'

/**
 * Debug
 */ 
const gui = new dat.GUI()


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */ 
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)
const cubeTextureLoader = new THREE.CubeTextureLoader()

loadingManager.onProgress = (texture) => {
    // console.log(texture, 'is on progress')
}

loadingManager.onError = (texture) => {
    // console.log(texture, 'is error')
}

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/5.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/1/nx.jpg',
    '/textures/environmentMaps/1/px.jpg',
    '/textures/environmentMaps/1/py.jpg',
    '/textures/environmentMaps/1/nx.jpg',
    '/textures/environmentMaps/1/pz.jpg',
    '/textures/environmentMaps/1/nz.jpg'
])

/**
 * Objects
 */
// const material = new THREE.MeshBasicMaterial({
//     // map: doorColorTexture
// })
// material.map = doorColorTexture
// material.color = new THREE.Color('#00aacc')
// material.wireframe = true
// material.opacity = 0.5 // how to use alpha? (opacity) => transparent = true!
// material.transparent = true
// material.alphaMap = doorAlphaTexture 
// alphamap change opacity/alpha too.  So "transparent = true"
// material.side = THREE.FrontSide

// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true

// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

// const material = new THREE.MeshDepthMaterial()

// const material = new THREE.MeshLambertMaterial()

// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// material.specular = new THREE.Color(0xff0000)

// const material = new THREE.MeshToonMaterial()
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false
// material.gradientMap = gradientTexture

// const material = new THREE.MeshStandardMaterial()
// material.metalness = 0
// material.roughness = 1
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.displacementMap = doorHeightTexture
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.alphaMap = doorAlphaTexture
// material.transparent = true
// material.displacementScale = 0.1
// // material.normalScale.set(0.5, 0.5)
// const normalScaleParameters = {
//     x: 0.5,
//     y: 0.5
// }
// gui.add(normalScaleParameters,'x').min(0).max(1).step(0.0001)
// gui.add(normalScaleParameters,'y').min(0).max(1).step(0.0001)
// // material.normalScale.set(0, 0)
// material.needsUpdate = true

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
material.envMap = environmentMapTexture


const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material 
)
sphere.position.x = -1.5
// gui.add(sphere.position, 'x')
sphere.geometry.setAttribute(
    'uv2', 
    new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
    )
    // sphere.geometry.setAttribute(
        //     'uv3', 
        //     new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
        // )
        
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
)
plane.geometry.setAttribute(
    'uv2', 
    new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
)

console.log(plane)
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material    
)
torus.geometry.setAttribute(
    'uv2', 
    new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
)
torus.position.x = 1.5
    
scene.add(sphere, plane, torus)
        // scene.add(plane)
        // scene.add(torus)
        
/**
 * Lights
 */ 
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)
/**
 * Tweaks
 */ 
gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
// gui.add(material, '')
// gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001)
// gui.add(material, 'displacementScale').min(0).max(1).step(0.0001)
// gui.add(material, 'displacementBias').min(0).max(1).step(0.0001)
// gui.add(material, 'normalScale').min(0).max(1).step(0.0001)

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

    // Rotate objects
    sphere.rotation.y = elapsedTime * 0.1;
    plane.rotation.y = elapsedTime * 0.1;
    torus.rotation.y = elapsedTime * 0.1;
    
    sphere.rotation.x = elapsedTime * 0.1;
    plane.rotation.x = elapsedTime * 0.1;
    torus.rotation.x = elapsedTime * 0.1;
    
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)


    // material.normalScale.set(normalScaleParameters.x, normalScaleParameters.y)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()