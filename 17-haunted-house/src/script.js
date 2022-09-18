import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { BoxGeometry, SphereGeometry } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Fog
const fog = new THREE.Fog('#262837', 1, 15)
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// wall textures
const brickColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const brickAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const brickNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const brickRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

// door textures
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// grass textures
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)
// wrapS & wrapT to activate repeat

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping


/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
scene.add(ghost1)

const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
scene.add(ghost2)

const ghost3 = new THREE.PointLight('#ffff00', 2, 3)
scene.add(ghost3)

/**
 * House
 */
/**
 * // Temporary sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial({ roughness: 0.7 })
)
sphere.position.y = 1
// scene.add(sphere)
 */
const house = new THREE.Group()
scene.add(house)

const wall = new THREE.Mesh(
    new THREE.BoxGeometry(4, 3, 4),
    new THREE.MeshStandardMaterial({ color: '#ac8e82',
        map: brickColorTexture,
        aoMap: brickAmbientOcclusionTexture,
        normalMap: brickNormalTexture,
        roughnessMap: brickRoughnessTexture
    })
)
wall.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(wall.geometry.attributes.uv.array, 2)
)
wall.position.set(0, 1.5, 0)
house.add(wall)

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.7, 2, 4),
    new THREE.MeshStandardMaterial({ color: '#b35f45',
        map: brickColorTexture,
        aoMap: brickAmbientOcclusionTexture,
        normalMap: brickNormalTexture,
        roughnessMap: brickRoughnessTexture
    })
)
roof.position.set(0, 4, 0)
roof.rotateY(Math.PI * 0.25)
house.add(roof)

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshStandardMaterial({ color: '#aa7b7b',
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        metalnessMap: doorMetalnessTexture,
        normalMap: doorNormalTexture,
        roughnessMap: doorRoughnessTexture
    })
)
// for "aoMap"
door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)

door.position.set(0, 1, 2 + 0.01)
house.add(door)

/** 
 * Bushes
 */
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMesh = new THREE.MeshStandardMaterial({ color: '#89c854' })

const bush1 = new THREE.Mesh(bushGeometry, bushMesh)
bush1.scale.set(0.7, 0.7, 0.7)
bush1.position.set(1.3, 0.2, 2)

const bush2 = new THREE.Mesh(bushGeometry, bushMesh)
bush2.scale.set(0.5, 0.5, 0.5)
bush2.position.set(0.6, 0.17, 2.3)

const bush3 = new THREE.Mesh(bushGeometry, bushMesh)
bush3.scale.set(0.3, 0.3, 0.3)
bush3.position.set(- 1, 0.15, 2)

const bush4 = new THREE.Mesh(bushGeometry, bushMesh)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(- 1.3, 0.1, 2.1)

scene.add(bush1, bush2, bush3, bush4)

/**
 * Graves
 */
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.5, 1, 0.2)
const graveMesh = new THREE.MeshStandardMaterial({ color: '#999999' })

for(let i = 0; i < 50; i++) {
    
    const angle = Math.PI * 2 * Math.random()
    const radius = 4 + Math.random() * 4
    
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius
    
    // Create the mesh
    const grave = new THREE.Mesh(graveGeometry, graveMesh)

    // Position
    grave.position.set(x, 0.3, z)

    // Rotation
    grave.rotateY(Math.random() - 0.5) * 0.3
    grave.rotateZ(Math.random() - 0.5) * 0.3

    grave.castShadow = true

    // Add to the graves container
    graves.add(grave)
}


// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
    })
)
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
// scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.5)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)


// Door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)


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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
renderer.setClearColor('#262837')


/**
 * Shadows
 */
renderer.shadowMap.enabled = true

moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

wall.castShadow = true
// wall.receiveShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

floor.receiveShadow = true

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Ghosts
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(elapsedTime * 3)

    const ghost2Angle = - elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    const ghost3Angle = - elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.sin(elapsedTime * 5) + Math.sin(elapsedTime * 2)


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()