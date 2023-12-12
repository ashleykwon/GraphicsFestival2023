import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';

import { load_object } from './util/object_loader';
import { setupStage, cube, otherDevices, screenDevices, pyroSparklers, pyroJets, smokeJets, lightStrips } from './scene/setup_stage';
import { setupLights, movingLights, laserLights, laserFansTop, laserFansBottom, spotLights, towerLasers } from './scene/setup_lights';
import { cameraPosition } from 'three/examples/jsm/nodes/Nodes';
import { crowd, setupCrowd } from './scene/setup_crowd';
import { Device } from './assets/device';
import { SpotLight } from './assets/create_spot_light';
import { CrowdMode, setCrowdState, updateCrowd } from './scene/update_crowd';
import { crossfadeLightStrips, crossfadeTowerLasers, sparkleSpotlights } from './scene/light_effects';

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
setupCrowd();

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

const camData = localStorage.getItem("cameraPos");
if(camData){
    const d = JSON.parse(camData)
    camera.position.set(d.position.x, d.position.y, d.position.z);
    camera.rotation.set(d.rotation._x, d.rotation._y, d.rotation._z);
    controls.target = new THREE.Vector3(d.lookAt.x, d.lookAt.y, d.lookAt.z)
}

export const BPM = 128;
export const t_measure = 60 * 1000 / BPM * 4; 
export const t_2note = t_measure / 2;
export const t_4note = t_measure / 4;
export const t_8note = t_measure / 8;
export const t_16note = t_measure / 16;
console.log(t_measure, t_4note);

let frameCount = 0;
let startTime = new Date().getTime();
let firstRun = true;
const animate = () => {
    const t = (new Date().getTime() - startTime) / 1000 * 120 + 2500;
    const ts = (new Date().getTime() - startTime) / 1000;

    // updating assets
    movingLights.forEach(ml => ml.update(t));
    laserLights.forEach(l => l.update(t));
    laserFansTop.forEach(lft => lft.update(t));
    laserFansBottom.forEach(lfb => lfb.update(t));
    pyroSparklers.forEach(pd => {
        if(pd.object.visible) pd.particleSimStep(t, pd);
        pd.update(t)
    });
    pyroJets.forEach(pd => {
        if(pd.object.visible) pd.particleSimStep(t, pd);
        pd.update(t)
    });
    smokeJets.forEach(pd => {
        if(pd.object.visible) pd.particleSimStep(t, pd);
        pd.update(t)
    });
    otherDevices.forEach(d => d.update(frameCount));
    screenDevices.forEach(d => d.update(frameCount));
    spotLights.forEach(sl => sl.update(t));

    lightStrips.forEach(ls => ls.update(ts));
    towerLasers.forEach(l => l.update(ts));

    // update unique objects in the scene
    cube.rotateX(0.01);
    cube.rotateY(0.01);
    localStorage.setItem("cameraPos", JSON.stringify({
        position: camera.position,
        rotation: camera.rotation,
        lookAt: controls.target
    }));

    // update crowd
    updateCrowd(ts, firstRun, () => firstRun = false);
    
    console.log(t)

    // is the intro
    if (0 <= t && t <= 1000){
        [...pyroJets, ...pyroSparklers, ...smokeJets].forEach(pd => pd.object.visible = false);
        laserFansTop.forEach(l => l.object.visible = false);
        laserFansBottom.forEach(l => l.object.visible = false);
        setCrowdState(CrowdMode.SWAY);
    }

    // is the breakdown
    else if (1000 < t && t <= 2000){
        movingLights.forEach(ml => ml.object.visible = true);
        laserFansTop.forEach(lft => lft.object.visible = true);
        laserFansTop.forEach(lft => {lft.updateSpread(80.0 + 0.1*(t%100)); lft.update(t);}); // this 0.1 can be matched with the bpm
        // laserFansTop.forEach(l => l.object.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2 + (t%10000) * Math.PI / 2));
        
        laserFansBottom.forEach(lfb => lfb.object.visible = true);
        laserFansBottom.forEach(lfb => {lfb.updateSpread(80.0 + 0.1*(t%100)); lfb.update(t);});
        // laserFansBottom.forEach(l => l.object.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2 + (t%10000) * Math.PI / 2));
        
        screenDevices.forEach(s => {s.object.fragShaderID = 1; s.update(t);});
        setCrowdState(CrowdMode.BOP);
    }

    // is the buildup
    else if (2000 < t && t <= 3000){
        movingLights.forEach(ml => ml.object.visible = true);

        laserFansTop.forEach(lft => lft.object.visible = true);
        laserFansTop.forEach(lft => {lft.updateSpread(80.0 + 0.5*(t%100)); lft.update(t);});
        // laserFansTop.forEach(lft => lft.object.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), (-Math.PI / 2) + (t%100)* Math.PI / 180));
        
        laserFansBottom.forEach(lfb => lfb.object.visible = true);
        laserFansBottom.forEach(lfb => {lfb.updateSpread(80.0 + 0.5*(t%100)); lfb.update(t);});
        // laserFansBottom.forEach(lfb => lfb.object.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2 + (t%100)* 25 * Math.PI / 180));
        
        screenDevices.forEach(s => {s.object.fragShaderID = 2; s.update(t);});
        setCrowdState(CrowdMode.BOP);
    }

    // is the drop
    else if (3000 < t && t <= 4000){
        pulsePyroJet(t_2note);
        [...pyroJets, ...pyroSparklers, ...smokeJets].forEach(pd => pd.object.visible = true);
        movingLights.forEach(ml => ml.object.visible = true);

        laserFansTop.forEach(lft => lft.object.visible = true);
        laserFansTop.forEach(lft => {lft.updateSpread(70.0 + 1.2*(t%100)); lft.update(t);});
        // laserFansTop.forEach(l => l.object.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2 + (t/10.0)* 25 * Math.PI / 180));
        laserFansBottom.forEach(lfb => lfb.object.visible = true);
        laserFansBottom.forEach(lfb => {lfb.updateSpread(70.0 + 1.2*(t%100)); lfb.update(t);});
        // laserFansBottom.forEach(l => l.object.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2 + (t/10.0)* 25 * Math.PI / 180));
        
        screenDevices.forEach(s => {s.object.fragShaderID = 3; s.update(t);});
        setCrowdState(CrowdMode.JUMP);
    }
    
    // three.js needs these funcitons to be called every time we render the scene
    controls.update();
    composer.render();

    frameCount += 1;
    requestAnimationFrame(animate);
}
animate();




const pulsePyroJet = (duration: number) => {
    pyroJets.forEach(pd => {
        pd.emitParticles = true;
        setTimeout(() => {
            pd.emitParticles = false;
        }, duration);
    })
}

const flashDevices = (devices: Device[], flash_duration: number, duration: number, visible_at_end: boolean) => {
    let flip = true;
    let loopFunc = () => {
        devices.forEach(d => {
            d.object.visible = flip;
        });
        flip = !flip;
    }
    loopFunc();
    let flashLoop = setInterval(loopFunc, flash_duration);

    setTimeout(() => {
        devices.forEach(d => {
            d.object.visible = visible_at_end;
        });
        clearInterval(flashLoop);
    }, duration);
}

let counter = 0;
setCrowdState(CrowdMode.BOP);
const interval_test = () => {
    sparkleSpotlights(t_measure);
    pulsePyroJet(t_2note);

    // if(counter % 3 == 0) setCrowdState(CrowdMode.SWAY);
    // if(counter % 3 == 1) setCrowdState(CrowdMode.BOP);
    // if(counter % 3 == 2) setCrowdState(CrowdMode.JUMP);
    // counter += 1;

    crossfadeLightStrips(0xaaff00, 0x00aaff, 2 * t_measure);
    crossfadeTowerLasers(0x00aaff, 0xaaff00, 2 * t_measure);

    flashDevices(towerLasers, t_16note, t_measure, false);
}
// interval_test();
// setInterval(interval_test, 2 * t_measure);

