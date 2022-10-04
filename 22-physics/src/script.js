import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// examples : https://schteppe.github.io/cannon.js/
// import CANNON, { Vec3 } from 'cannon'

import * as CANNON from 'cannon-es'

/**
 * Demo
 */
 const demo = new Demo()


/**
 * Debug
 */
const gui = new dat.GUI()
const debugObject = {}

debugObject.createSphere = () => {
    // createSphere(1, 0.5, {x: 0 , y: 3, z: 0})
    createSphere(
        Math.random() * 0.5,
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        }    
    )
        // console.log(objectsToUpdate)
}
debugObject.createBox = () => {
    const length = Math.random() * 0.5
    console.log(length)
    createBox(
        length, 
        length, 
        length,
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        }
    )
}
debugObject.reset = () => {
    for(const object of objectsToUpdate) {
        object.body.removeEventListener('collide', playHitSound)
        scene.remove(object.mesh)
        world.removeBody(object.body)
    }
}
gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'createBox')
gui.add(debugObject, 'reset')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sounds
 */
const hitSound = new Audio('/sounds/hit.mp3')

let canPlay = true

const playHitSound = (collision) => { 
    // hitSound.pause()
    // console.log(collision)
    // console.log(collision.contact.getImpactVelocityAlongNormal())

    const impactStrength = collision.contact.getImpactVelocityAlongNormal()

    if(impactStrength > 1.5) {

        hitSound.volume = impactStrength * 0.1 < 1 ? impactStrength * 0.1 : 1
        
        if(canPlay) {
            hitSound.currentTime = 0
            hitSound.play()
            canPlay = false
            setTimeout(() => {canPlay = true}, 100)
        }
    }
 }

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])


/**
 * Physics
 */
// World
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, - 9.82, 0)

// Materials
const concreteMaterial = new CANNON.Material('concrete')
const plasticMaterial = new CANNON.Material('plastic')
const defaultMaterial = new CANNON.Material('default')

// ContactMaterial : what happen if "meet" (bounce, friction . . .)
/** m1, m2, properties */
const concretePlasticContactMaterial = new CANNON.ContactMaterial(
    concreteMaterial,
    plasticMaterial,
    {
        friction: 0.1,
        restitution: 0.5
    }
)
world.addContactMaterial(concretePlasticContactMaterial)
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.5
    }
)
world.addContactMaterial(defaultContactMaterial)
const plasticContactMaterial = new CANNON.ContactMaterial(
    plasticMaterial,
    plasticMaterial,
    {
        friction: 0,
        restitution: 0
    }
)
world.addContactMaterial(plasticContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

// Sphere
// const sphereShape = new CANNON.Sphere(0.5)
// const sphereBody = new CANNON.Body({
//     mass: 1,
//     position: new CANNON.Vec3(0, 3, 0),
//     shape: sphereShape,
//     // material: defaultMaterial
// })
// sphereBody.applyLocalForce(new CANNON.Vec3(100, 0, 0), new CANNON.Vec3(0, 0, 0))
// world.addBody(sphereBody)

const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0 // WONT MOVE
floorBody.addShape(floorShape)
floorBody.material = defaultMaterial
// floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5)
world.addBody(floorBody)

/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 32, 32),
//     new THREE.MeshStandardMaterial({
//         metalness: 0.3,
//         roughness: 0.4,
//         envMap: environmentMapTexture,
//         envMapIntensity: 0.5
//     })
// )
// sphere.castShadow = true
// sphere.position.y = 3
// scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
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
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Utils
 */
const objectsToUpdate = []

// Box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
})
const createBox = (width, height, depth, position) => {
    // Three.js Mesh
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)
    boxMesh.castShadow = true
    boxMesh.scale.set(width, height, depth)
    boxMesh.position.copy(position)
    scene.add(boxMesh)

    const boxShape = new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2))
    const boxBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: boxShape,
        material: defaultMaterial
    })
    boxBody.position.copy(position)

    boxBody.addEventListener('collide', playHitSound)

    world.addBody(boxBody)

    objectsToUpdate.push({ mesh: boxMesh, body: boxBody })
}

let geometry = new THREE.SphereGeometry(1, 20, 20)
const material = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
})

// const listBodies = []
const createSphere = (radius, position) => {
    // Three.js mesh
    // geometry.radius = radius
    // console.log(geometry.radius)
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.scale.set(radius, radius, radius)
    mesh.position.copy(position)
    // mesh.name = `object ${i}`
    scene.add(mesh)

    // Cannon.js body
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)
    
    // objectsToUpdate.push(mesh)
    objectsToUpdate.push({
        mesh,
        body
    })
    // listBodies.push(body)

}

// createSphere(0.5, { x: 0, y: 3, z: 0 }) // position doesn't have to be a Vector3/Vec3
// createSphere(0.3, { x: 0, y: 3, z: 0 })

// const count = 5
// for(let i = 0; i < count; i++) {
//     createSphere(i + 1, Math.random(), { x: Math.random() * 2, y: Math.random() * 5, z: Math.random() * 2 })
// }


/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    // Update physics world
    // sphereBody.applyForce(new CANNON.Vec3(- 0.5, 0, 0), sphereBody.position) // wind? infinite force

    world.step(1 / 60, deltaTime, 3) // 60 frame rate
    // console.log(sphereBody.position)
    // sphere.position.set(sphereBody.position.x, sphereBody.position.y, sphereBody.position.z)
    // sphere.position.x = sphereBody.position.x
    // sphere.position.y = sphereBody.position.y
    // sphere.position.z = sphereBody.position.z
    // sphere.position.copy(sphereBody.position)

    // for(let i = 0; i < count; i++) {
    //     objectsToUpdate[i].position.copy(listBodies[i].position)
    //     console.log(objectsToUpdate)
    // }

    objectsToUpdate.forEach(object => {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)

        // object.mesh.rotation.set(object.body.quaternion.x, object.body.quaternion.y, object.body.quaternion.z)
        // console.log()
    })


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()