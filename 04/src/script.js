// npm->working files should in "src" directory
// this file is "ROOT" script file. root of all script files
// "static" directory = sorces(img, txt . . .)

// html에 css를 import하지 않아도 적용됨
import './style.css';

// import three.js from node_modules>three
import * as THREE from 'three';

const canvas = document.querySelector(".webgl");

// scene
const scene = new THREE.Scene();

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 5;

scene.add(camera);

// object (Mesh = geometry + material)
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: "red"});
    // option name should be " "
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);

// renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas //이름 같으니 canvas < 라고만 써도 됨
}); // const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);

// call the render() method
renderer.render(scene, camera);

