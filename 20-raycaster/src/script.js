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
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.name = 'object1'
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object2.name = 'object2'

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.name = 'object3'
object3.position.x = 2

scene.add(object1, object2, object3)

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()
    
    // /** origin & direction :: set() */
    // const rayOrigin = new THREE.Vector3(- 3, 0, 0)
    // /** direction — The direction vector that gives direction to the ray. Should be normalized.(docs) */
    // const rayDirection = new THREE.Vector3(10, 0, 0)
    // console.log(rayDirection, rayDirection.length()) // Vector3 {x: 10, y: 0, z: 0}
    // rayDirection.normalize()
    // console.log(rayDirection, rayDirection.length()) // Vector3 {x: 1, y: 0, z: 0}
    // raycaster.set(rayOrigin, rayDirection) // only caster, no ray(light) yet

    // /**
    //  *  1. intersectObject(. . .) : test 1 object
    //  *  2. intersectObjects(. . .) : test an array of objectx
    //  */
    // const intersect = raycaster.intersectObject(object2)
    // console.log(intersect) // this result is " array "
    //                         // because: ray can go 1 same object " multiple times " (ex. donut)

    // const intersects = raycaster.intersectObjects([object1, object2, object3])
    // console.log(intersects)



/**
 * if raycaster move higher(f.e. (- 3, 10, 0)), intersect(s) has no result
 */




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
 * Mouse
 */
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (e) => 
{
    // const x = (e.clientX / window.innerWidth * 2) - 1
    // const y = - ((e.clientY / window.innerHeight * 2) - 1)
    // mouse.set(x, y)
    
    mouse.x = e.clientX / sizes.width * 2 - 1
    mouse.y = - (e.clientY / sizes.height * 2) + 1
    // console.log(mouse)
})

// let isClicked = null
window.addEventListener('click', (e) => 
{
    if(currentIntersect) { // sth is hovered
        // switch(currentIntersect.object) {
        //     case object1 :
        //         console.log('click on object 1')
        //         break;
        //     case object2 :
        //         console.log('click on object 2')
        //         break;
        //     case object3 :
        //         console.log('click on object 3')
        //         break;
        // }
        console.log(currentIntersect.object.name + ' is clicked!')
    }
    // isClicked = true
    // if(intersects) {
    //     console.log(intersects[0].object.name + 'is clicked!')
    // }
})


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
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

let currentIntersect = null

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // // Animate Objects
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

            // // Cast a ray
            // const rayOrigin = new THREE.Vector3(- 3, 0, 0)
            // const rayDirection = new THREE.Vector3(1, 0, 0)
            // rayDirection.normalize()

            // raycaster.set(rayOrigin, rayDirection)

            // const objectsToTest = [object1, object2, object3]
            // const intersects = raycaster.intersectObjects(objectsToTest)

            // // console.log(intersects, intersects.length)

            // for(const object of objectsToTest) {
            //     object.material.color.set('#ff0000')
            // }
            // for(const intersect of intersects) {
            //     intersect.object.material.color.set('#0000ff')
            // }

    // Cast a ray
    raycaster.setFromCamera(mouse, camera)

    const objectsToTest = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objectsToTest)
    // console.log(intersects.length)
    for(const object of objectsToTest) {
        object.material.color.set('#ff0000')
    }
    for( const intersect of intersects ) {
        intersect.object.material.color.set('#0000ff')
    }
    for( const object of objectsToTest ) {
        if(intersects.length > 0 && !(intersects[0].object === object)) {
            object.material.color.set('#ff0000')
        }
    }

    if(intersects.length) {
        if(currentIntersect === null) {
            console.log('something being hovered')
        }
        currentIntersect = intersects[0]
    } else {
        if(currentIntersect) {
            console.log('nogthing being hovered')
        }
        currentIntersect = null
    }
    
    // if(isClicked) {
    //     console.log(intersects[0].object.name + 'is clicked!')
    //     isClicked = null
    // }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()