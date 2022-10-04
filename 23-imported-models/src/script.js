import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
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
 * Models
 */
const gltfLoader = new GLTFLoader()

// gltfLoader.load(
//     // '/models/Duck/glTF/Duck.gltf',
//     '/models/FlightHelmet/glTF/FlightHelmet.gltf',
//     (gltf) => {
//         // console.log('success')
//         console.log(gltf)
//         // gltf.scene.children[0].children.shift
//         // scene.add(gltf.scene.children[0])
//         // scene.add(gltf.scene.children[1])
//         // scene.add(gltf.scene.children[2])
//         // const length = gltf.scene.children.length
//         // for(let i = 0; i < length; i++) {
//         //     scene.add(gltf.scene.children[0])
        
//         // }
//         // while(gltf.scene.children.length) {
//         //     scene.add(gltf.scene.children[0])
//         // }
//         // load된 gltf에서 scene에 add하면 children의 요소들은 remove됨
//         const children = [...gltf.scene.children] // 배열을 따로 복사해두고(just simple temporary array)
//         for(const child of children) { // 복사한 것으로부터 add
//             console.log(children)
//             scene.add(child)
//         }
//         // = "scene.add(gltf.scene)"
//     },
//     (progress) => {
//         // console.log('progress')
//         // console.log(gltf)
//     },
//     (error) => {
//         // console.log('error')
//         // console.log(gltf)
//     }
// )


// DRACOLoader -> set Path -> gltf loader : set draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

gltfLoader.setDRACOLoader(dracoLoader)
// default gltf is also can be loaded now
// sltfloader's dracoLoader/Decoder only run when needed
// not win-win solution for small geometries
// gltfLoader.load(
//     // '/models/Duck/glTF/Duck.gltf',
//     '/models/Duck/glTF-Draco/Duck.gltf', 
//     (gltf) => {
//         // console.log('success')
//         console.log(gltf)
//         gltf.scene.children[0].children.shift
//         scene.add(gltf.scene.children[0])
//     },
//     (progress) => {
//         // console.log('progress')
//         // console.log(gltf)
//     },
//     (error) => {
//         // console.log('error')
//         // console.log(gltf)
//     }
// )
let mixer = null
gltfLoader.load(
    // '/models/Duck/glTF/Duck.gltf',
    '/models/Fox/glTF/Fox.gltf', 
    (gltf) => {
        // console.log('success')
        console.log(gltf)

        mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[2])
        action.play()

        gltf.scene.scale.set(0.025, 0.025, 0.025)
        scene.add(gltf.scene)
        // gltf.scene.children[0].children.shift
        // scene.add(gltf.scene.children[0])
    },
    (progress) => {
        // console.log('progress')
        // console.log(gltf)
    },
    (error) => {
        // console.log('error')
        // console.log(gltf)
    }
)

// console.log(gltf)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update Mixer
    if(mixer !== null) {
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()