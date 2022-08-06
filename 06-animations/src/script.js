import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Time
// let time = Date.now();

// Clock
const clock = new THREE.Clock();

// GSAP :: has own tick = don't have to request refresh   :   but should tick "render"
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });
gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 });

// Animations
// let flag = 1; // 1 = right 0 = left
const tick = () => {
    // console.log('tick');
    
    // Time
    // const currentTime = Date.now();
    // const deltaTime = currentTime - time;
    // time = currentTime; // tick마다 시간 차이 기록하기 위함
    // console.log(deltaTime);

    // Clock
    // const elapsedTime = clock.getElapsedTime(); // 경과된 시간
    

    // Update objects
        // if(mesh.position.x >= 1) flag = 0;
        // else if(mesh.position.x <= -1) flag = 1;

        // flag == 1 ? mesh.position.x += 0.001 : mesh.position.x -= 0.001;
        // // flag == 1 ? mesh.position.x += 0.001 * deltaTime : mesh.position.x -= 0.001 * deltaTime;
    // deltaTime을 애니메이션에 사용함으로서
    // 각 모니터/PC 성능차에 관계 없이 동일한 속도로 애니메이션 표시

    // mesh.rotation.y = elapsedTime * Math.PI * 2;
    // // console.log(elapsedTime);
    // const second_stamp = document.querySelector('span');
    // second_stamp.innerHTML = Math.floor(elapsedTime);

    // mesh.position.y = Math.sin(elapsedTime);
    // mesh.position.x = Math.cos(elapsedTime);
    
    // camera.position.y = Math.sin(elapsedTime);
    // camera.position.x = Math.cos(elapsedTime);
    // camera.lookAt(mesh.position);

    // Render
    renderer.render(scene, camera);
    
    window.requestAnimationFrame(tick);
};


tick();