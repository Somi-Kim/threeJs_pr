import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js' // THREE.OrbitControls >> OrbitControls
/*
Cursor
*/
const cursor = {
    x: 0,
    y: 0
};
window.addEventListener('mousemove', (e) => {
    // console.log(e.clientX);
    // cursor.x = e.clientX;
    // cursor.y = e.clientY;
    if(e.clientX > sizes.width) {
        cursor.x = 0.5;
    } else {
        cursor.x = e.clientX / sizes.width - 0.5;
    }
    if(e.clientY > sizes.height) {
        cursor.y = 0.5;
    } else {
        cursor.y = (e.clientY / sizes.height - 0.5) * -1;
    }
    // console.log(cursor.x, cursor.y);
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

// Camera
// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(
    //     -1 * aspectRatio, 
    //     1 * aspectRatio, 
    //     1, 
    //     -1, 
    //     0.1, 
    //     100
    //     ); // -1, 1, 1, -1일 때 : 800*800 size로 바꾸면 정육면체로 잘 보임
    
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
// console.log(camera.position.length());
camera.lookAt(mesh.position)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas);
// controls.target.y = 2; // change 
// controls.update(); //update
controls.enableDamping = true; // 마우스 움직임 멈추면 끊김 => 매 프레임 업데이트 필요(controls.update());

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()
const ratioOfCamera = 3;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    
    // Update objects
    // mesh.rotation.y = elapsedTime;
    
    // Update Camera
    // console.log(Math.sin(Math.PI * (cursor.x * 2)));
    // camera.position.x = Math.sin(Math.PI * cursor.x * 2) * ratioOfCamera;
    // camera.position.z = Math.cos(Math.PI * cursor.x * 2) * ratioOfCamera;
    // camera.position.y = Math.sin(Math.PI * cursor.y) * ratioOfCamera;
    // camera.position.x = Math.sin(cursor.x * 4) * ratioOfCamera;
    // camera.position.z = Math.cos(cursor.x * 4) * ratioOfCamera;
    // camera.position.z = cursor.x * ratioOfCamera;
    // camera.lookAt(new THREE.Vector3(mesh.position.x, mesh.position.y, mesh.position.z));
    
    // Update controls
    controls.update();
    
    // Render
    renderer.render(scene, camera)
    
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()