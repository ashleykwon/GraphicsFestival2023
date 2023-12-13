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

import * as Timeline from '../assets/song.json';

// **********************
// INITIALIZE THREE.JS
// **********************

// important objects are scene and camera
export const scene = new THREE.Scene();
export const scene2 = new THREE.Scene();
export const scene3 = new THREE.Scene();
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
const renderScene3 = new RenderPass(scene3, camera);
renderScene.clear = true;
renderScene2.clear = false;
renderScene3.clear = false;
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
composer.addPass(renderScene3);
composer.addPass(outputPass);

// **********************
// RENDER LOOP
// **********************

// prep scene for main loop
const camData = localStorage.getItem("cameraPos");
if(camData){
    const d = JSON.parse(camData)
    camera.position.set(d.position.x, d.position.y, d.position.z);
    camera.rotation.set(d.rotation._x, d.rotation._y, d.rotation._z);
    controls.target = new THREE.Vector3(d.lookAt.x, d.lookAt.y, d.lookAt.z)
}

laserFansTop.forEach(lf => lf.setModeOff());
laserFansBottom.forEach(lf => lf.setModeOff());
towerLasers.forEach(tl => tl.setModeOff());

// main loop logic
export const BPM = Timeline.bpm;
export const t_measure = 60 * 1000 / BPM * 4; 
export const t_2note = t_measure / 2;
export const t_4note = t_measure / 4;
export const t_8note = t_measure / 8;
export const t_16note = t_measure / 16;
console.log(t_measure, t_4note);

// start song trigger function
let startAudioAtMs = 39375; // 39375;
let attack = 0;
let songStarted = false;
let audio = new Audio('../assets/Yottabyte.mp3');
audio.oncanplay = () => console.log("AUDIO LOADED")
let timefile: [string, number[]][];
const startSong = () => {
    audio.currentTime = startAudioAtMs / 1000;
    audio.play();
    songStarted = true;
    startTime = new Date().getTime();

    const pair_diff = (pair: number[]) => pair[1] - pair[0];
    timefile = [
        ['intro', Timeline.first.intro],
        ['breakdown', Timeline.first.breakdown],
        ['build-8', Timeline.first['build-8']],
        ['build-16', Timeline.first['build-16']],
        ['build-32', Timeline.first['build-32']],
        ['build-rest', Timeline.first['build-rest']],
        ['drop', Timeline.first.drop]
    ];

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
    
    setTimeout(() => {
        interval_test();
        setInterval(interval_test, 2 * t_measure)
    }, t_measure);
    
}
document.body.addEventListener('keydown', (e) => {
    if(e.key == ' ') startSong();
    if(e.key == 'm') audio.pause();
});

let frameCount = 0;
let startTime = new Date().getTime();
let firstRun = true;
let currentStageName = '';
const animate = () => {
    const ms_difference = (new Date().getTime() - startTime) + startAudioAtMs;
    const t = ms_difference / 1000 * 120;
    const tms = ms_difference;
    const ts = tms / 1000;

    // update crowd
    updateCrowd(ts, firstRun, () => firstRun = false);

    if(songStarted){
        let currentTimeFile = timefile.find(pair => pair[1][0] <= tms && tms <= pair[1][1]) as [string, number[]];
        if(currentTimeFile === undefined) currentTimeFile = ['', []];

        let newStageEntered = false;
        if(currentTimeFile[0] != currentStageName) newStageEntered = true;
        currentStageName = currentTimeFile[0];
        
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

        cube.rotateX(0.01); // update unique objects in the scene
        cube.rotateY(0.01);
        localStorage.setItem("cameraPos", JSON.stringify({
            position: camera.position,
            rotation: camera.rotation,
            lookAt: controls.target
        }));

        // is the intro
        if(currentTimeFile[0] == 'intro'){
            if(newStageEntered){
                console.log("INTRO");

                [...pyroJets, ...pyroSparklers, ...smokeJets].forEach(pd => pd.object.visible = false);
                laserFansTop.forEach(l => l.object.visible = false);
                laserFansBottom.forEach(l => l.object.visible = false);
                setCrowdState(CrowdMode.SWAY);
            }
        }

        // is the breakdown
        else if (currentTimeFile[0] == 'breakdown'){
            if(newStageEntered){
                console.log("BREAKDOWN")

                movingLights.forEach(ml => ml.object.visible = true);
                laserFansTop.forEach(lft => lft.object.visible = true);
                laserFansBottom.forEach(lfb => lfb.object.visible = true);
                screenDevices.forEach(s => s.changeProgram(1));
                setCrowdState(CrowdMode.BOP);
            }
            
            laserFansTop.forEach(lft => {lft.updateSpread(80.0 + 0.1*(t%100)); lft.update(t);}); // this 0.1 can be matched with the bpm
            laserFansBottom.forEach(lfb => {lfb.updateSpread(80.0 + 0.1*(t%100)); lfb.update(t);});
        }

        // is the buildup
        else if (currentTimeFile[0] == 'build-8'){
            if(newStageEntered){
                console.log("BUILD 8")

                movingLights.forEach(ml => ml.object.visible = true);
                laserFansTop.forEach(lft => lft.object.visible = true);
                laserFansBottom.forEach(lfb => lfb.object.visible = true);
                screenDevices.forEach(s => s.changeProgram(2));
                setCrowdState(CrowdMode.BOP);
            }

            laserFansTop.forEach(lft => {lft.updateSpread(80.0 + 0.5*(t%100)); lft.update(t);});
            laserFansBottom.forEach(lfb => {lfb.updateSpread(80.0 + 0.5*(t%100)); lfb.update(t);});
        }

        // is the buildup
        else if (currentTimeFile[0] == 'build-16'){
            if(newStageEntered){
                console.log("BUILD 16")

                movingLights.forEach(ml => ml.object.visible = true);
                laserFansTop.forEach(lft => lft.object.visible = true);
                laserFansBottom.forEach(lfb => lfb.object.visible = true);
                screenDevices.forEach(s => s.changeProgram(2));
                setCrowdState(CrowdMode.BOP);
            }

            laserFansTop.forEach(lft => {lft.updateSpread(80.0 + 0.5*(t%100)); lft.update(t);});
            laserFansBottom.forEach(lfb => {lfb.updateSpread(80.0 + 0.5*(t%100)); lfb.update(t);});
        }

        // is the buildup
        else if (currentTimeFile[0] == 'build-32'){
            if(newStageEntered){
                console.log("BUILD 32")

                movingLights.forEach(ml => ml.object.visible = true);
                laserFansTop.forEach(lft => lft.object.visible = true);
                laserFansBottom.forEach(lfb => lfb.object.visible = true);
                screenDevices.forEach(s => s.changeProgram(2));
                setCrowdState(CrowdMode.BOP);
            }

            laserFansTop.forEach(lft => {lft.updateSpread(80.0 + 0.5*(t%100)); lft.update(t);});
            laserFansBottom.forEach(lfb => {lfb.updateSpread(80.0 + 0.5*(t%100)); lfb.update(t);});
        }

        // is the buildup
        else if (currentTimeFile[0] == 'build-rest'){
            if(newStageEntered){
                console.log("BUILD REST")
                movingLights.forEach(ml => ml.object.visible = true);
                laserFansTop.forEach(lft => lft.object.visible = false);
                laserFansBottom.forEach(lfb => lfb.object.visible = false);
                screenDevices.forEach(s => s.setModeOff());
                setCrowdState(CrowdMode.BOP);

                crossfadeLightStrips(0xaaff00, 0x000000, 2 * t_measure);
                crossfadeTowerLasers(0x00aaff, 0x000000, 2 * t_measure);
            }

            laserFansTop.forEach(lft => {lft.updateSpread(80.0 + 0.5*(t%100)); lft.update(t);});
            laserFansBottom.forEach(lfb => {lfb.updateSpread(80.0 + 0.5*(t%100)); lfb.update(t);});
        }

        // is the drop
        else if (currentTimeFile[0] == 'drop'){
            // pulsePyroJet(t_2note);
            if(newStageEntered){
                console.log("DROP");
                crossfadeLightStrips(0xaaff00, 0x00aaff, 2 * t_measure);
                crossfadeTowerLasers(0x00aaff, 0xaaff00, 2 * t_measure);

                [...pyroJets, ...pyroSparklers, ...smokeJets].forEach(pd => pd.object.visible = true);
                movingLights.forEach(ml => ml.object.visible = true);
                laserFansTop.forEach(lft => lft.object.visible = true);
                laserFansBottom.forEach(lfb => lfb.object.visible = true);
                screenDevices.forEach(s => {
                    s.setModeAuto();
                    s.changeProgram(3)
                });
                setCrowdState(CrowdMode.JUMP);
            }

            laserFansTop.forEach(lft => {lft.updateSpread(70.0 + 1.2*(t%100)); lft.update(t);});
            laserFansBottom.forEach(lfb => {lfb.updateSpread(70.0 + 1.2*(t%100)); lfb.update(t);});
        } 

        else {
            if(newStageEntered){
                console.log("OUTRO");
                
                laserFansTop.forEach(lft => lft.object.visible = false);
                laserFansBottom.forEach(lfb => lfb.object.visible = false);
                screenDevices.forEach(s => s.changeProgram(1));
                setCrowdState(CrowdMode.BOP);
            }
        }
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


