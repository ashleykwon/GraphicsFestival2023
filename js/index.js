import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';

import { load_object } from '/js/util/object_loader.js';
import { setupStage, cube } from '/js/scene/setup_stage.js';
import { setupLights, movingLights, laserLights } from '/js/scene/setup_lights.js';

// **********************
// INITIALIZE THREE.JS
// **********************

export const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.025);

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 3, 15);
const screenDimensions = [800 * 2, 600 * 2];

const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('main-canvas'),
    antialias: true
});
renderer.setSize(...screenDimensions);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target = new THREE.Vector3(0, 10, -20);
controls.update();


// **********************
// SET UP SCENE
// **********************


export const lamps = [];

setupStage();
setupLights();

// **********************
// RENDER + SHADER PASSES
// **********************

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(...screenDimensions), 1.5, 0.4, 0.85 );
const params = {
    threshold: 0.3,
    strength: 0.4,
    radius: 0,
    exposure: 1
};
bloomPass.threshold = params.threshold;
bloomPass.strength = params.strength;
bloomPass.radius = params.radius;
const fxaaPass = new ShaderPass(FXAAShader);
const outputPass = new OutputPass();

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);
// composer.addPass(fxaaPass);
composer.addPass(outputPass);

// **********************
// RENDER LOOP
// **********************

let frameCount = 0;
const animate = () => {
    movingLights.forEach(ml => ml.update(frameCount));
    laserLights.forEach(l => l.update(frameCount));

    cube.rotateX(0.01);
    cube.rotateY(0.01);
    frameCount += 1;

    for(let i = 0; i < lamps.length; i++){
        const lamp = lamps[i];
        lamp.rotateZ(Math.sin(frameCount / 60 + Math.PI / 2) / 120);
    }

    controls.update();
    requestAnimationFrame(animate);
    composer.render();
}
animate();


setInterval(() => {
    laserLights.forEach(l => l.setModePlay(
        (t, laser) => {
            const dt = Math.sin(t / 60) * 0.1;
            laser.object.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), dt);

            if((t / 10 | 0) % 2 == 0) laser.object.visible = true;
            else laser.object.visible = false;
        },
        (t, laser) => {
            laser.object.visible = true;
        }, 1000)
    );
}, 2000);

// let flip = true;
// setInterval(() => {
//     movingLights[flip ? 1 : 0].setModeOff();
//     movingLights[flip ? 0 : 1].setModeAuto();
//     flip = !flip;
// }, 500);