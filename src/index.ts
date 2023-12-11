import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';

import { load_object } from './util/object_loader';
import { setupStage, cube, pyroDevices, otherDevices } from './scene/setup_stage';
import { setupLights, movingLights, laserLights } from './scene/setup_lights';
import { cameraPosition } from 'three/examples/jsm/nodes/Nodes';

// **********************
// INITIALIZE THREE.JS
// **********************

// important objects are scene and camera
export const scene = new THREE.Scene();
export const scene2 = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.005);

export const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, 1000 );
camera.position.set(60, 10, 0);
const screenDimensions = [1200 * 2, 700 * 2];

const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
    antialias: true
});
renderer.setSize(screenDimensions[0], screenDimensions[1]);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target = new THREE.Vector3(0, 30, 0);
controls.update();


// **********************
// SET UP SCENE
// **********************

setupStage();
setupLights();

// **********************
// RENDER + SHADER PASSES
// **********************

const renderScene = new RenderPass(scene, camera);
const renderScene2 = new RenderPass(scene2, camera);
renderScene.clear = true;
renderScene2.clear = false;
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
composer.addPass(renderScene2);
composer.addPass(bloomPass);
composer.addPass(outputPass);

// **********************
// RENDER LOOP
// **********************

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const onPointerMove = ( event: any ) => {
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
window.addEventListener( 'pointermove', onPointerMove );

const camData = localStorage.getItem("cameraPos");
if(camData){
    const d = JSON.parse(camData)
    camera.position.set(d.position.x, d.position.y, d.position.z);
    camera.rotation.set(d.rotation._x, d.rotation._y, d.rotation._z);
    controls.target = new THREE.Vector3(d.lookAt.x, d.lookAt.y, d.lookAt.z)
}


let frameCount = 0;
const animate = () => {
    // updating assets
    movingLights.forEach(ml => ml.update(frameCount));
    laserLights.forEach(l => l.update(frameCount));
    pyroDevices.forEach(pd => {
        if(pd.object.visible) pd.particleSimStep(frameCount, pd);
        pd.update(frameCount)
    });
    otherDevices.forEach(d => d.update(frameCount))

    cube.rotateX(0.01);
    cube.rotateY(0.01);
    localStorage.setItem("cameraPos", JSON.stringify({
        position: camera.position,
        rotation: camera.rotation,
        lookAt: controls.target
    }));
    
    raycaster.setFromCamera( pointer, camera );
	const intersects = raycaster.intersectObjects( scene.children )
    console.log(intersects[0]?.point)

    // three.js needs these funcitons to be called every time we render the scene
    controls.update();
    composer.render();

    frameCount += 1;
    requestAnimationFrame(animate);
}
animate();

// let flip = false;
// setInterval(() => {
//     const ml = movingLights[2]
//     if(flip) ml.setModeOn();
//     else ml.setModeOff();

//     flip = !flip;
// }, 500);

// setInterval(() => {
//     pyroDevices.forEach(pd => {
//         pd.emitParticles = true;
//         setTimeout(() => {
//             pd.emitParticles = false;
//         }, 300);
//     })
// }, 1000);

// setInterval(() => {
//     let l = laserLights[0];
//     (l.setModePlay(
//         (t, laser) => {
//             const dt = Math.sin(t / 60) * 0.1;
//             laser.object.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), dt);

//             if((t / 10 | 0) % 2 == 0) laser.object.visible = true;
//             else laser.object.visible = false;
//         },
//         (t, laser) => {
//             laser.object.visible = true;
//         }, 1000)
//     );
// }, 2000);

// let flip = true;
// setInterval(() => {
//     movingLights[flip ? 1 : 0].setModeOff();
//     movingLights[flip ? 0 : 1].setModeAuto();
//     flip = !flip;
// }, 500);

// let flip = true;
// setInterval(() => {
//     pyroDevices.forEach(pd => {
//         if(flip) pd.setModeOff();
//         else pd.setModeAuto();
//     });
//     flip = !flip;
// }, 500);