import './style.css'
import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

// Group
const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 0x00ff00})
)
group.add(cube1);

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 0x00ff00})
)
cube2.position.x = -1.5;
    group.add(cube2);
    
const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 0x00ff00})
    )
cube3.position.x = 1.5;
group.add(cube3);

group.rotation.z = Math.PI * 0.3;

const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)

// Position
// between center of scene <=> object
// alert(mesh.position.length()); 

// distance between objects
// alert(mesh.position.distanceTo(new THREE.Vector3(0, 1, 2)));

// normalize :: reduce vector length to 1
// mesh.position.normalize()
// alert(mesh.position.length()); // 이게 1이 되도록

// mesh.position.x = 0.7;
// mesh.position.y = - 0.6;
// mesh.position.z = 1;
mesh.position.set(0.7, -0.6, 1);

// show axes helper
const axesHelper = new THREE.AxesHelper(); // this is an object! you should add to scene
// ~.AxesHelper(n) : 좌표축의 길이를 n만큼

scene.add(axesHelper);

    // Scale
// mesh.scale.x = 1.5;
// mesh.scale.set(1.5, 2, 1.3);

    // Rotation
// mesh.rotation.y = 0.3; // these values is expressed in "radians"  >>>   Math.PI(pure js)
mesh.rotation.y = Math.PI;
mesh.rotation.y = Math.PI * 0.25;
// rotation을 하여도 정상적인 결과가 아닌 strange result (ex.axis not working anymore)를 얻는 경우
    // 해결책 //
    // 1. 순서 교정 (reorder(...))
        // object.ratation.reorder('yxz');
        // ex. 1인칭 게임에서 카메라 시점 회전 순서 : 좌우 -> 위아래 
            // (위아래->좌우 경우 : 고개를 숙인 상태에서 옆을 흘기게 됨)
        // reorder before change rotation
    
// Quaternion     :: updates when change the rotation



scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
// camera.position.x = 1
// camera.position.y = 1
camera.position.z = 3
scene.add(camera)

// Look At
// camera.lookAt(mesh.position); // object의 position(object's center)를 주시
// camera.lookAt(new THREE.Vector3(3, 0, 0));

// distance between : mesh <=> camera
// alert(mesh.position.distanceTo(camera.position));


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)