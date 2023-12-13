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
import { crossfadeLightStrips, crossfadeMovingLights, crossfadeTowerLasers, pulseSparkleSpotlights, sparkleSpotlights } from './scene/light_effects';

import Timeline from '../assets/song.json';
import { PyroJet } from './assets/create_pyro_jet';
import { PyroJetPartial } from './assets/create_pyro_jet_partial';
import { PyroSparklerPartial } from './assets/create_pyro_sparkler_partial';
import { SmokeJetPartial } from './assets/create_smoke_jet_partial';
import { cameraCurveDevices, moveCameraAlongCurve, setupCameraCurves } from './scene/setup_camera_curves';
import { LaserScreen } from './assets/create_screen';

// **********************
// INITIALIZE THREE.JS
// **********************

// important objects are scene and camera
export const scene = new THREE.Scene();
export const scene2 = new THREE.Scene();
export const scene3 = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.005);

export const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, 1000 );
// camera.position.set(20, 10, 0);
camera.position.set(100, 5, 0);
const screenDimensions = [1920 * 2, 1080 * 2];
// const screenDimensions = [1500, 700];

const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
    antialias: true
});
renderer.setSize(screenDimensions[0], screenDimensions[1]);
export const controls = new OrbitControls(camera, renderer.domElement);
controls.target = new THREE.Vector3(0, 10, 0);
controls.update();

let stageID = 0;

// **********************
// SET UP SCENE
// **********************

if(stageID == 0){
    setupStage();
    setupLights();
    setupCrowd();
    setupCameraCurves();
}

else if(stageID == 1){
    // const pyroA = new PyroJetPartial([0, 0, -15], 2*800, 12, 3);
    // const pyroB = new PyroJetPartial([0, 0, -5], 2*800, 12, 2);
    // const pyroC = new PyroJetPartial([0, 0, 5], 2*800, 12, 1);
    // const pyroD = new PyroJetPartial([0, 0, 15], 2*800, 12, 0);
    const pyroA = new PyroSparklerPartial([0, 0, -15], 2*800, 12, 3);
    const pyroB = new PyroSparklerPartial([0, 0, -5], 2*800, 12, 2);
    const pyroC = new PyroSparklerPartial([0, 0, 5], 2*800, 12, 1);
    const pyroD = new PyroSparklerPartial([0, 0, 15], 2*800, 12, 0);
    // const pyroA = new SmokeJetPartial([0, 0, -15], 2*800, 14, 3);
    // const pyroB = new SmokeJetPartial([0, 0, -5], 2*800, 14, 2);
    // const pyroC = new SmokeJetPartial([0, 0, 5], 2*800, 14, 1);
    // const pyroD = new SmokeJetPartial([0, 0, 15], 2*800, 14, 0);
    pyroA.setModeOn();
    pyroB.setModeOn();
    pyroC.setModeOn();
    pyroD.setModeOn();
    pyroJets.push(pyroA);
    pyroJets.push(pyroB);
    pyroJets.push(pyroC);
    pyroJets.push(pyroD);
}

else if (stageID == 2){
    // Intro
    const screen1 = new LaserScreen([0, 5, 10], [1, 0, 0], 5, 10, 4);
    
    // Breakdown
    const screen2 = new LaserScreen([0, 5, 3], [1, 0, 0], 5, 10, 1);

    // Build 8
    const screen3 = new LaserScreen([0, 5, -4], [1, 0, 0], 5, 10, 5);

    // Build 16, Random colors
    const screen4 = new LaserScreen([0, 7.75, -11], [1, 0, 0], 5, 4.5, 2);
    const screen4V2 = new LaserScreen([0, 2, -11], [1, 0, 0], 5, 4.5, 2);
    
    // Build 32, Outro
    const screen5 = new LaserScreen([0, 5, -18], [1, 0, 0], 5, 10, 6);

    // Drop
    const screen6 = new LaserScreen([0, 5, -25], [1, 0, 0], 5, 10, 3);

    screenDevices.push(screen1, screen2, screen3);
    screenDevices.push(screen4, screen4V2, screen5, screen6);
}


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
const pixelRatio = renderer.getPixelRatio();
fxaaPass.uniforms['resolution'].value.x = 1 / (screenDimensions[0] * pixelRatio);
fxaaPass.uniforms['resolution'].value.y = 1 / (screenDimensions[1] * pixelRatio);
const outputPass = new OutputPass();

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(renderScene2);
composer.addPass(renderScene3);
composer.addPass(bloomPass);
composer.addPass(outputPass);
composer.addPass(fxaaPass);

// **********************
// RENDER LOOP
// **********************

export const BPM = Timeline.bpm;
export const t_measure = 60 * 1000 / BPM * 4; 
export const t_2note = t_measure / 2;
export const t_4note = t_measure / 4;
export const t_8note = t_measure / 8;
export const t_16note = t_measure / 16;
console.log(t_measure, t_4note);

// prep scene for main loop
if(stageID == 0){
    const camData = localStorage.getItem("cameraPos");
    // if(camData){
    //     const d = JSON.parse(camData)
    //     camera.position.set(d.position.x, d.position.y, d.position.z);
    //     camera.rotation.set(d.rotation._x, d.rotation._y, d.rotation._z);
    //     controls.target = new THREE.Vector3(d.lookAt.x, d.lookAt.y, d.lookAt.z)
    // }

    laserFansTop.forEach(lf => lf.setModeOff());
    laserFansBottom.forEach(lf => lf.setModeOff());
    towerLasers.forEach(tl => tl.setModeOff());
    movingLights.forEach(ml => ml.object.color = new THREE.Color(0x004488))
    lightStrips.forEach(ls => ls.object.material.color = new THREE.Color(0xffaa00))

    // main loop logic
    // start song trigger function
    let startAudioAtMs = 0 - 100; // 39375;
    let attack = 0;
    let songStarted = false;
    let audio = new Audio('../assets/Yottabyte.mp3');
    audio.oncanplay = () => console.log("AUDIO LOADED")
    type TimefileSlot = {
        name: string,
        range: number[],
        length: number
    }
    let timefile: TimefileSlot[];
    const startSong = () => {
        audio.currentTime = startAudioAtMs / 1000;
        audio.play();
        songStarted = true;
        startTime = new Date().getTime();

        const pair_diff = (pair: number[]) => pair[1] - pair[0];
        timefile = [
            {
                name: 'intro', 
                range: Timeline.first.intro,
                length: pair_diff(Timeline.first.intro)
            }, 
            {
                name: 'breakdown', 
                range: Timeline.first.breakdown,
                length: pair_diff(Timeline.first.breakdown)
            },
            {
                name: 'build-8', 
                range: Timeline.first['build-8'],
                length: pair_diff(Timeline.first['build-8'])
            },
            {
                name: 'build-16', 
                range: Timeline.first['build-16'],
                length: pair_diff(Timeline.first['build-16'])
            },
            {
                name: 'build-32', 
                range: Timeline.first['build-32'],
                length: pair_diff(Timeline.first['build-32'])
            },
            {
                name: 'build-rest', 
                range: Timeline.first['build-rest'],
                length: pair_diff(Timeline.first['build-rest'])
            },
            {
                name: 'drop', 
                range: Timeline.first.drop,
                length: pair_diff(Timeline.first.drop)
            }, 
        ];    
    }
    document.body.addEventListener('keydown', (e) => {
        if(e.key == ' ') startSong();
        if(e.key == 'm') audio.pause();
    });

    let frameCount = 0;
    let startTime = new Date().getTime();
    let firstRun = true;
    let currentStageName = '';
    let prevIntervalLoops: any[] = [];
    let prevIntervalLoops2: any[] = [];
    let pulseSparsity = 6;
    const animate = () => {
        const ms_difference = (new Date().getTime() - startTime) + startAudioAtMs;
        const t = ms_difference / 1000 * 120;
        const tms = ms_difference;
        const ts = tms / 1000;

        // update crowd
        updateCrowd(ts, firstRun, () => firstRun = false);

        if(songStarted){
            let currentTimeFile = timefile.find(pair => pair.range[0] <= tms && tms <= pair.range[1]) as TimefileSlot;
            if(currentTimeFile === undefined) currentTimeFile = {name: '', range: [], length: 0};

            let newStageEntered = false;
            if(currentTimeFile.name != currentStageName) newStageEntered = true;
            currentStageName = currentTimeFile.name;
            
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

            cameraCurveDevices.forEach(cd => cd.update(tms));

            cube.rotateX(0.01); // update unique objects in the scene
            cube.rotateY(0.01);
            localStorage.setItem("cameraPos", JSON.stringify({
                position: camera.position,
                rotation: camera.rotation,
                lookAt: controls.target
            }));

            // is the intro
            if(currentTimeFile.name == 'intro'){
                if(newStageEntered){
                    console.log("INTRO");

                    prevIntervalLoops.forEach(id => clearInterval(id));
                    [...pyroJets, ...pyroSparklers, ...smokeJets].forEach(pd => pd.object.visible = false);
                    laserFansTop.forEach(l => l.object.visible = false);
                    laserFansBottom.forEach(l => l.object.visible = false);
                    setCrowdState(CrowdMode.SWAY);
                    
                    screenDevices.forEach(s => s.changeProgram(4));

                    setTimeout(() => {
                        crossfadeLightStrips(0xffaa00, 0xaaff00, 2 * t_measure); 
                        crossfadeMovingLights(0x004488, 0x00ffaa, 4 * t_measure);
                    }, t_measure);
                    setTimeout(() => {
                        movingLights.forEach(ml => {
                            ml.setModeOn();
                            ml.object.color = new THREE.Color(0x00ffaa)
                        })
                    }, 4 * t_measure);

                    const interval_test = () => {
                        sparkleSpotlights(t_measure);
                        crossfadeLightStrips(0xaaff00, 0x00aaff, 2 * t_measure);
                        // crossfadeTowerLasers(0x00aaff, 0xaaff00, 2 * t_measure);
                    }
                    setTimeout(() => {
                        sparkleSpotlights(t_measure);
                        prevIntervalLoops.push(setInterval(interval_test, 2 * t_measure))
                    }, t_measure);
                    
                    moveCameraAlongCurve(1, (8 + 1) * t_measure);
                    // lightStrips.forEach(ls => ls.object.material.color = new THREE.Color(0xffaa00))
                }
            }

            // is the breakdown
            else if (currentTimeFile.name == 'breakdown'){
                if(newStageEntered){
                    console.log("BREAKDOWN")

                    movingLights.forEach(ml => ml.object.visible = true);
                    laserFansTop.forEach(lft => lft.object.visible = true);
                    laserFansBottom.forEach(lfb => lfb.object.visible = true);
                    screenDevices.forEach(s => s.changeProgram(1));
                    setCrowdState(CrowdMode.BOP);

                    // light color control
                    
                    prevIntervalLoops.forEach(id => clearInterval(id));
                    const interval_test = () => {
                        crossfadeLightStrips(0xaa00ff, 0xff00aa, 2 * t_measure);
                    }
                    smokeJets.forEach(pd => pd.object.visible = true);
                    const interval_test2 = () => {
                        pulseSmokeJet(t_measure);
                    }

                    movingLights.forEach(ml => ml.object.color = new THREE.Color(0xffaa00))
                    sparkleSpotlights(t_measure * 0.5);
                    interval_test();
                    interval_test2();
                    prevIntervalLoops.push(setInterval(interval_test, 2 * t_measure))
                    prevIntervalLoops.push(setInterval(interval_test2, 2 * t_measure))

                    moveCameraAlongCurve(9, 8 * t_measure);
                }
                
                laserFansTop.forEach(lft => {
                    lft.object.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), -25 * Math.PI / 180);
                    lft.updateSpread(80.0 + 0.1*(t%100)); lft.update(t);}); // this 0.1 can be matched with the bpm
                laserFansBottom.forEach(lfb => {
                    lfb.object.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), -25 * Math.PI / 180);
                    lfb.updateSpread(80.0 + 0.1*(t%100)); lfb.update(t);});
            }

            // is the buildup
            else if (currentTimeFile.name == 'build-8'){
                if(newStageEntered){
                    console.log("BUILD 8")

                    movingLights.forEach(ml => ml.object.visible = true);
                    laserFansTop.forEach(lft => lft.object.visible = true);
                    laserFansBottom.forEach(lfb => lfb.object.visible = true);
                    screenDevices.forEach(s => s.changeProgram(5));
                    setCrowdState(CrowdMode.BOP);

                    // light color control

                    prevIntervalLoops.forEach(id => clearInterval(id));
                    const interval_test = () => {
                        crossfadeLightStrips(0xffff00, 0x0000ff, 2 * t_measure);
                        crossfadeTowerLasers(0x0000ff, 0xffff00, 2 * t_measure);
                        flashDevices(towerLasers, t_16note, t_measure, false);
                    }
                    movingLights.forEach(ml => ml.object.color = new THREE.Color(0xaa00ff))
                    setTimeout(() => {
                        pulseSparkleSpotlights(t_measure * 2, pulseSparsity, 8 * 2);
                    }, 2 * t_measure);

                    interval_test();
                    prevIntervalLoops.push(setInterval(interval_test, 2 * t_measure))

                    moveCameraAlongCurve(5, 3 * t_measure);
                    setTimeout(() => {
                        moveCameraAlongCurve(3, 3 * t_measure);
                    }, 3 * t_measure);
                }

                laserFansTop.forEach(lft => {
                    lft.changeColor(0xff0000);
                    lft.object.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), -25 * Math.PI / 180);
                    lft.updateSpread(80.0 + 0.5*(t%100)); 
                    lft.update(t);
                });
                laserFansBottom.forEach(lfb => {
                    lfb.changeColor(0xff0000);
                    lfb.object.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), -25 * Math.PI / 180);
                    lfb.updateSpread(80.0 + 0.5*(t%100)); 
                    lfb.update(t);
                });
            }

            // is the buildup
            else if (currentTimeFile.name == 'build-16'){
                if(newStageEntered){
                    console.log("BUILD 16")

                    movingLights.forEach(ml => ml.object.visible = true);
                    laserFansTop.forEach(lft => lft.object.visible = true);
                    laserFansBottom.forEach(lfb => lfb.object.visible = true);
                    screenDevices.forEach(s => s.changeProgram(2));
                    setCrowdState(CrowdMode.BOP);

                    prevIntervalLoops2.forEach(id => clearInterval(id));
                    const interval_test = () => {
                        pulseSparkleSpotlights(t_measure, pulseSparsity, 16);
                    };
                    interval_test();
                    prevIntervalLoops2.push(setInterval(interval_test, t_measure));

                    moveCameraAlongCurve(7, 2 * t_measure);
                    setTimeout(() => {
                        moveCameraAlongCurve(8, 2 * t_measure);
                    }, 2 * t_measure);
                }

                laserFansTop.forEach(lft => {lft.updateSpread(80.0 + 0.5*(t%100)); lft.update(t);});
                laserFansBottom.forEach(lfb => {lfb.updateSpread(80.0 + 0.5*(t%100)); lfb.update(t);});
            }

            // is the buildup
            else if (currentTimeFile.name == 'build-32'){
                if(newStageEntered){
                    console.log("BUILD 32")

                    movingLights.forEach(ml => ml.object.visible = true);
                    laserFansTop.forEach(lft => lft.object.visible = true);
                    laserFansBottom.forEach(lfb => lfb.object.visible = true);
                    screenDevices.forEach(s => s.changeProgram(6));
                    setCrowdState(CrowdMode.BOP);

                    prevIntervalLoops2.forEach(id => clearInterval(id));
                    pulseSparkleSpotlights(t_measure, pulseSparsity, 32);
                }

                laserFansTop.forEach(lft => {lft.updateSpread(80.0 + 0.5*(t%100)); lft.update(t);});
                laserFansBottom.forEach(lfb => {lfb.updateSpread(80.0 + 0.5*(t%100)); lfb.update(t);});
            }

            // is the buildup
            else if (currentTimeFile.name == 'build-rest'){
                if(newStageEntered){
                    console.log("BUILD REST")
                    movingLights.forEach(ml => ml.object.visible = true);
                    laserFansTop.forEach(lft => lft.object.visible = false);
                    laserFansBottom.forEach(lfb => lfb.object.visible = false);
                    screenDevices.forEach(s => {
                        s.object.material.uniforms.u_time.value = 0;
                        s.changeProgram(0)
                    });
                    setCrowdState(CrowdMode.BOP);

                    prevIntervalLoops.forEach(id => clearInterval(id));
                    prevIntervalLoops2.forEach(id => clearInterval(id));
                    crossfadeLightStrips(0xaaff00, 0x000000, 2 * t_measure);
                    crossfadeTowerLasers(0x00aaff, 0x000000, 2 * t_measure);
                }

                laserFansTop.forEach(lft => {lft.updateSpread(80.0 + 0.5*(t%100)); lft.update(t);});
                laserFansBottom.forEach(lfb => {lfb.updateSpread(80.0 + 0.5*(t%100)); lfb.update(t);});
            }

            // is the drop
            else if (currentTimeFile.name == 'drop'){
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

                    // light color loops

                    prevIntervalLoops.forEach(id => clearInterval(id));
                    const interval_test = () => {
                        pulsePyroJet(t_measure);

                        crossfadeLightStrips(0x00ff00, 0xffaa00, 2 * t_measure);
                        crossfadeTowerLasers(0xffaa00, 0x00ff00, 2 * t_measure);
                    }
                    const interval_test2 = () => {
                        flashDevices(towerLasers, t_16note, t_measure, false);
                        sparkleSpotlights(t_measure);
                        randomPointDevices(towerLasers, t_16note, t_measure);
                    }
                    const interval_test3 = () => {
                        pulseSmokeJet(t_measure);
                    }
                    
                    movingLights.forEach(ml => ml.object.color = new THREE.Color(0xffff00))

                    interval_test();
                    interval_test2();
                    interval_test3();
                    prevIntervalLoops.push(setInterval(interval_test, 2 * t_measure))
                    prevIntervalLoops.push(setInterval(interval_test2, t_measure))
                    prevIntervalLoops.push(setInterval(interval_test3, 4 * t_measure))

                    
                    moveCameraAlongCurve(1, 2 * t_measure);
                    setTimeout(() => {
                        moveCameraAlongCurve(4, 2 * t_measure);
                    }, 2 * t_measure);
                    setTimeout(() => {
                        moveCameraAlongCurve(6, 8 * t_measure);
                    }, 4 * t_measure);
                    setTimeout(() => {
                        moveCameraAlongCurve(10, 4 * t_measure);
                    }, 12 * t_measure);
                }

                laserFansTop.forEach(lft => {lft.updateSpread(70.0 + 1.2*(t%100)); lft.update(t);});
                laserFansBottom.forEach(lfb => {lfb.updateSpread(70.0 + 1.2*(t%100)); lfb.update(t);});
            } 

            else {
                if(newStageEntered){
                    console.log("OUTRO");
                    
                    laserFansTop.forEach(lft => lft.object.visible = false);
                    laserFansBottom.forEach(lfb => lfb.object.visible = false);
                    screenDevices.forEach(s => s.changeProgram(6));

                    moveCameraAlongCurve(0, 4 * t_measure);
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

    const pulseSmokeJet = (duration: number) => {
        smokeJets.forEach(pd => {
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


    const randomPointDevices = (devices: Device[], flash_duration: number, duration: number) => {
        let flip = true;
        let loopFunc = () => {
            devices.forEach(d => {
                d.object.rotation.x = 0;
                d.object.rotation.y = 0;
                d.object.rotation.z = 0;

                d.object.rotateX((Math.random() - 0.5) * 0.2);
                d.object.rotateY((Math.random() - 0.5) * 0.2);
                d.object.rotateZ((Math.random() - 0.5) * 0.2);
            });
            flip = !flip;
        }
        loopFunc();
        let flashLoop = setInterval(loopFunc, flash_duration);

        setTimeout(() => clearInterval(flashLoop), duration);
    }

}

else if(stageID == 1){
    let started = false;
    document.body.addEventListener('keydown', (e) => {
        if(e.key == ' ') started = true;
    });

    let frameCount = 0;
    let startTime = new Date().getTime();

    const animate = () => {
        if(started){
            const ms_difference = (new Date().getTime() - startTime);
            const t = ms_difference / 1000 * 120;
            const tms = ms_difference;
            const ts = tms / 1000;
    
            pyroJets.forEach(pd => {
                pd.particleSimStep(t, pd);
                pd.update(t)
            }); 
        }

        controls.update();
        composer.render();

        frameCount += 1;
        requestAnimationFrame(animate);
    }
    animate();
}

else if(stageID == 2){
    let started = false;
    document.body.addEventListener('keydown', (e) => {
        if(e.key == ' ') started = true;
    });

    let frameCount = 0;
    let startTime = new Date().getTime();

    const animate = () => {
        if(started){
            const ms_difference = (new Date().getTime() - startTime);
            const t = ms_difference / 1000 * 120;
            const tms = ms_difference;
            const ts = tms / 1000;
    
            
        }
        screenDevices.forEach(d => d.update(frameCount));
        controls.update();
        composer.render();

        frameCount += 1;
        requestAnimationFrame(animate);
    }
    animate();
}