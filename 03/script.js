// Scene
const scene = new THREE.Scene();

// Red cube
    // Mesh = Geometry(triangle based SHAPE) + Material(all options. ex-color . . .)
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material  = new THREE.MeshBasicMaterial({ color: 'red' });
    // send Geometry & Material to Mesh
const mesh = new THREE.Mesh(geometry, material);
    // add object to scene
scene.add(mesh);

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
    // PerspectiveCamera ( fov(field fo view), aspect (, near) (, far))
    // fov : how large your vision angle is
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.x = 5; camera.position.y = 0.8; camera.position.z = 1;
camera.rotation.y = 1;
    // add camera to scene
scene.add(camera); 

// Canvas
    // result will be drawn into a >> canvas << 
const canvas = document.querySelector(".webgl");

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas //이름 같으니 canvas < 라고만 써도 됨
});
renderer.setSize(sizes.width, sizes.height);

// call the render() method
renderer.render(scene, camera);