import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let mixer;
let clock = new THREE.Clock();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 10, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.maxPolarAngle = Math.PI / 2;

// Get model name from the URL
const urlParams = new URLSearchParams(window.location.search);
const modelName = urlParams.get('model');

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');

dracoLoader.preload();
let modelPath = '';
let camPosition;

// Determine model path based on URL
loader.setDRACOLoader(dracoLoader);
modelPath = `./models/${modelName}.glb`;
if (modelName == "Copey_GLB") {
    camera.position.set(0.5, 1, 0.5); // Cámara más lejos
    camera.fov = 30; // Zoom moderado
    camPosition = new THREE.Vector3(0, 0.5, 0); // Ajusta el objetivo al exterior del modelo
} else {
    camera.position.set(1, 2, 1); // Más lejos para otros modelos
    camera.fov = 40; // Más abierto para otros
    camPosition = new THREE.Vector3(0, 1, 0);
}

camera.updateProjectionMatrix(); // Aplica los cambios al FOV
controls.target.copy(camPosition); // Asegura que apunte al modelo
controls.minDistance = 0.5; // Evita acercamiento excesivo


if (modelPath) {
    loader.load(modelPath, function (gltf) {
        const model = gltf.scene;

        if (modelName == "Flor_de_Bayahibe") model.scale.set(30, 30, 30)
        else if (modelName == "Copey_GLB") model.scale.set(3, 3, 3);
        scene.add(model);

        mixer = new THREE.AnimationMixer(model);

        const modelPosition = new THREE.Vector3();
        model.getWorldPosition(modelPosition);
        controls.target.copy(camPosition);
        if (gltf.animations[0]) {

            const animationAction = mixer.clipAction(gltf.animations[0]);
            animationAction.play();
        }

    }, undefined, function (error) {
        console.error('An error occurred while loading the model:', error);
    });
}

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);

    controls.update();
    renderer.render(scene, camera);
}

animate();