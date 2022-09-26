import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => 
    {
        material.color.set(parameters.materialColor)
        particleMaterial.color.set(parameters.materialColor)
    })


/**
 * Events
 */
window.addEventListener('scroll', (e) => {
    // console.log(window.scrollY)
    
})


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


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
 * Test cube
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial({ color: '#ff0000' })
// )
// scene.add(cube)

/**
 * Objects
 */
// Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/5.jpg')
gradientTexture.magFilter = THREE.NearestFilter

// Material
const material = new THREE.MeshToonMaterial({ 
    color: parameters.materialColor, 
    gradientMap: gradientTexture 
})

// Meshes
const objectsDistance = 7 // distance between objects
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2

mesh1.position.x = 2
mesh2.position.x = - 2
mesh3.position.x = 2

// mesh1.position.x = objectsDistance * 0
// mesh2.position.x = objectsDistance * 1
// mesh3.position.x = objectsDistance * 2

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [ mesh1, mesh2, mesh3 ]


/**
 * Particles
 */
// Geometry
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)

for(let i = 0; i < particlesCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = (objectsDistance * 0.5) - (Math.random() * objectsDistance * 3)
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particleGeometry = new THREE.BufferGeometry()
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
const particleMaterial = new THREE.PointsMaterial({
    sizeAttenuation: true,
    color: parameters.materialColor,
    size: 0.03
})

const particles = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particles)


/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

/**
 * Group
 */
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
// scene.add(camera)
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
// renderer.setClearAlpha(1)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () => 
{
    scrollY = window.scrollY

    const newSection = Math.round(scrollY / sizes.height)
    // console.log(newSection)

    if(newSection != currentSection) {
        currentSection = newSection

        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration: 1.2,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=3',
                z: '+=1.5'
            }
        )
    }
})


/**
 * Mouse
 */
let mouse = new THREE.Vector2()

window.addEventListener('mousemove', (e) => 
{
    const x = e.clientX / sizes.width - 0.5
    const y = - (e.clientY / sizes.height - 0.5)
    mouse.set(x * 0.5, y * 0.5)
    // console.log(mouse)
})


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

    // Animate camera - vertical
    camera.position.y = - scrollY / sizes.height * objectsDistance
    // camera.position.x = mouse.x * 0.5

    cameraGroup.position.x += (mouse.x - cameraGroup.position.x) * deltaTime * 5
    cameraGroup.position.y += (mouse.y - cameraGroup.position.y) * deltaTime * 5

    // const parallaxX = cursor.x
    // const parallaxY = cursor.y
    // camera.position.x = parallaxX
    // camera.position.y = parallaxY


    // 4 distance = 4 units between objects
    // 4 unit = 1 viewport height in this example
    // if 4 unit scroll -> scrollY / sizes.height = 1
    // so multiply objectsDistance on it

    // Animate camera - horizontal
    // camera.position.x = scrollY / sizes.height * objectsDistance

    // Update Positions
    // mesh1.position.y = - objectsDistance * 0 + window.scrollY / sizes.height
    // mesh2.position.y = - objectsDistance * 1 + window.scrollY / sizes.height
    // mesh3.position.y = - objectsDistance * 2 + window.scrollY / sizes.height
    // console.log(mesh1.position.y, mesh3.position.y, mesh2.position.y)

    // Animate meshes
    for(const mesh of sectionMeshes) 
    {
        mesh.rotation.x += deltaTime * 0.2
        mesh.rotation.y += deltaTime * 0.1
        // mesh.rotation.y = elapsedTime * 0.1
        // mesh.rotation.x = elapsedTime * 0.2
    }


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()