import * as THREE from 'three';
import { load_object } from '../util/object_loader';
import { scene } from '../index';
import { PyroSparkler } from '../assets/create_pyro_sparkler';
import { Device } from '../assets/device';
import { Dome } from '../assets/create_dome';
import { PyroJet } from '../assets/create_pyro_jet';
import { SmokeJet } from '../assets/create_smoke_jet';
import { LaserScreen } from '../assets/create_screen';
import { LightStrip } from '../assets/create_light_strip';

export let cube: THREE.Mesh;

export let pyroSparklers : PyroSparkler[] = [];
export let pyroJets : PyroJet[] = [];
export let smokeJets : SmokeJet[] = [];

export let otherDevices : Device[] = [];
export let screenDevices: LaserScreen[] = [];
export let lightStrips : LightStrip[] = [];

export const setupStage = () => {
    // pyro sparklers
    const pyroA = new PyroSparkler([2, 3, -10], 800, 8); // stage row
    const pyroB = new PyroSparkler([2, 3, 10], 800, 8);
    const pyroC = new PyroSparkler([2, 3, -30], 800, 8);
    const pyroD = new PyroSparkler([2, 3, 30], 800, 8);
    pyroSparklers.push(pyroA)
    pyroSparklers.push(pyroB)
    pyroSparklers.push(pyroC)
    pyroSparklers.push(pyroD)

    const pyroAp = new PyroSparkler([-9, 33, -10], 800, 8); // top row
    const pyroBp = new PyroSparkler([-9, 33, 10], 800, 8);
    const pyroCp = new PyroSparkler([-9, 33, -30], 800, 8);
    const pyroDp = new PyroSparkler([-9, 33, 30], 800, 8);
    pyroSparklers.push(pyroAp)
    pyroSparklers.push(pyroBp)
    pyroSparklers.push(pyroCp)
    pyroSparklers.push(pyroDp)

    // pyro jets
    const pyro3 = new PyroJet([2, 3, -20], 2*800, 10); // top row
    const pyro4 = new PyroJet([2, 3, 20], 2*800, 10);
    const pyro5 = new PyroJet([2, 3, -40], 2*800, 10);
    const pyro6 = new PyroJet([2, 3, 40], 2*800, 10);
    pyroJets.push(pyro6);
    pyroJets.push(pyro5)
    pyroJets.push(pyro3)
    pyroJets.push(pyro4);

    const pyro3p = new PyroJet([-9, 33, -20], 2*800, 10); // stage row
    const pyro4p = new PyroJet([-9, 33, 20], 2*800, 10);
    const pyro5p = new PyroJet([-9, 33, -40], 2*800, 10);
    const pyro6p = new PyroJet([-9, 33, 40], 2*800, 10);
    pyroJets.push(pyro6p);
    pyroJets.push(pyro5p)
    pyroJets.push(pyro3p)
    pyroJets.push(pyro4p);

    // smoke jets
    const smokeA = new SmokeJet([-12.5, 2, 63.5 + 1], 3*800, 16);
    const smokeB = new SmokeJet([-12.5, 2, -(63.5 + 1)], 3*800, 16);
    const smokeC = new SmokeJet([24.5, 2, 83.5], 3*800, 16);
    const smokeD = new SmokeJet([24.5, 2, -83.5], 3*800, 16);
    smokeJets.push(smokeA);
    smokeJets.push(smokeB);
    smokeJets.push(smokeC);
    smokeJets.push(smokeD);

    // [...pyroSparklers, ...pyroJets, ...smokeJets].forEach(pd => pd.setModeOn())
    // [...pyroSparklers, ...pyroJets, ...smokeJets].forEach(pd => pd.setModeOff())

    // pyroJets.forEach(pd => {
    //     pd.emitParticles = false;
    //     pd.setModeOn();
    // });
    
    // const smoke1 = new SmokeJet([4, 0, 0], 1600, 8);
    // smoke1.setModeOn();
    // pyroDevices.push(smoke1);

    let d_s = -19
    const screenL1L = new LaserScreen([-9, 7.6, 47.5], [1, 0, 0.25], 18, 3.5, 1);
    const screenL2L = new LaserScreen([-8, 12.5, 47.5], [1, 0, 0.25], 18, 3.5, 1);
    const screenL3L = new LaserScreen([-6.3, 17.6, 47.5], [1, 0, 0.25], 18, 3.5, 1);
    const screenL4L = new LaserScreen([-5.3, 23.1, 47.5], [1, 0, 0.25], 18, 3.5, 1);
    screenDevices.push(screenL1L, screenL2L, screenL3L, screenL4L);

    const screenL1R = new LaserScreen([-9, 7.6, 47.5 + d_s], [1, 0, -0.25], 18, 3.5, 1);
    const screenL2R = new LaserScreen([-8, 12.5, 47.5 + d_s], [1, 0, -0.25], 18, 3.5, 1);
    const screenL3R = new LaserScreen([-6.3, 17.6, 47.5 + d_s], [1, 0, -0.25], 18, 3.5, 1);
    const screenL4R = new LaserScreen([-5.3, 23.1, 47.5 + d_s], [1, 0, -0.25], 18, 3.5, 1);
    screenDevices.push(screenL1R, screenL2R, screenL3R, screenL4R);

    const screenC1L = new LaserScreen([-10.5, 7.6, 15.2], [1, 0, 0.25], 7, 3.5, 1);
    const screenC2L = new LaserScreen([-8.8, 12.5, 13], [1, 0, 0.25], 12, 3.5, 1);
    const screenC3L = new LaserScreen([-6.8, 17.4, 10.5], [1, 0, 0.25], 17, 3.5, 1);
    const screenC4L = new LaserScreen([-5.3, 23.1, 9.5], [1, 0, 0.25], 18, 3.5, 1);
    screenDevices.push(screenC1L, screenC2L, screenC3L, screenC4L);

    const screenC1R = new LaserScreen([-10.5, 7.6, -15.2], [1, 0, -0.25], 7, 3.5, 1);
    const screenC2R = new LaserScreen([-8.8, 12.5, -13], [1, 0, -0.25], 12, 3.5, 1);
    const screenC3R = new LaserScreen([-6.8, 17.4, -10.5], [1, 0, -0.25], 17, 3.5, 1);
    const screenC4R = new LaserScreen([-5.3, 23.1, -9.5], [1, 0, -0.25], 18, 3.5, 1);
    screenDevices.push(screenC1R, screenC2R, screenC3R, screenC4R);

    const screenR1L = new LaserScreen([-9, 7.6, -47.5], [1, 0, -0.25], 18, 3.5, 1);
    const screenR2L = new LaserScreen([-8, 12.5, -47.5], [1, 0, -0.25], 18, 3.5, 1);
    const screenR3L = new LaserScreen([-6.3, 17.6, -47.5], [1, 0, -0.25], 18, 3.5, 1);
    const screenR4L = new LaserScreen([-4.8, 23.1, -47.5], [1, 0, -0.25], 18, 3.5, 1);
    screenDevices.push(screenR1L, screenR2L, screenR3L, screenR4L);

    const screenR1R = new LaserScreen([-9, 7.6, -47.5 - d_s], [1, 0, 0.25], 18, 3.5, 1);
    const screenR2R = new LaserScreen([-8, 12.5, -47.5 - d_s], [1, 0, 0.25], 18, 3.5, 1);
    const screenR3R = new LaserScreen([-6.3, 17.6, -47.5 - d_s], [1, 0, 0.25], 18, 3.5, 1);
    const screenR4R = new LaserScreen([-5.3, 23.1, -47.5 - d_s], [1, 0, 0.25], 18, 3.5, 1);
    screenDevices.push(screenR1R, screenR2R, screenR3R, screenR4R);

    const screenC = new LaserScreen([-10, 39, -0.3], [1, 0, 0], 16, 10, 1);
    screenDevices.push(screenC);

    // light strips
    const lstripL1 = new LightStrip(0x00ffaa, [-5, 4.5, 57], [0, 4.5, 38.5])
    const lstripL2 = new LightStrip(0x00ffaa, [0, 4.5, 57 - 19], [-5, 4.5, 38 - 19])
    const lstripR1 = new LightStrip(0x00ffaa, [-5, 4.5, -(57)], [0, 4.5, -(38.5)])
    const lstripR2 = new LightStrip(0x00ffaa, [0, 4.5, -(57 - 19)], [-5, 4.5, -(38 - 19)])
    const lstripC1 = new LightStrip(0x00ffaa, [-5, 4.5, 57 - 38], [0, 4.5, 38 - 38])
    const lstripC2 = new LightStrip(0x00ffaa, [-5, 4.5, -(57 - 38)], [0, 4.5, -(38 - 38)])
    lightStrips.push(lstripL1, lstripL2, lstripR1, lstripR2, lstripC1, lstripC2);

    let ls_ht = 29;
    let ls_htd = -3;
    const lstripL1T = new LightStrip(0x00ffaa, [-5 + ls_htd, ls_ht, 57], [0 + ls_htd, ls_ht, 38.5])
    const lstripL2T = new LightStrip(0x00ffaa, [0 + ls_htd, ls_ht, 57 - 19], [-5 + ls_htd, ls_ht, 38 - 19])
    const lstripR1T = new LightStrip(0x00ffaa, [-5 + ls_htd, ls_ht, -(57)], [0 + ls_htd, ls_ht, -(38.5)])
    const lstripR2T = new LightStrip(0x00ffaa, [0 + ls_htd, ls_ht, -(57 - 19)], [-5 + ls_htd, ls_ht, -(38 - 19)])
    const lstripC1T = new LightStrip(0x00ffaa, [-5 + ls_htd, ls_ht, 57 - 38], [0 + ls_htd, ls_ht, 38 - 38])
    const lstripC2T = new LightStrip(0x00ffaa, [-5 + ls_htd, ls_ht, -(57 - 38)], [0 + ls_htd, ls_ht, -(38 - 38)])
    lightStrips.push(lstripL1T, lstripL2T, lstripR1T, lstripR2T, lstripC1T, lstripC2T);

    let ls_right_corr = -0.3;
    const lstripSL1 = new LightStrip(0x00ffaa, [-5, 5.7, 4.3], [13.5, 5.7, 4.3])
    const lstripSL2 = new LightStrip(0x00ffaa, [18, 5.7, 0 + ls_right_corr], [13.5, 5.7, 4.3])
    const lstripSR1 = new LightStrip(0x00ffaa, [-5, 5.7, -4.3 + ls_right_corr], [13.5, 5.7, -4.3 + ls_right_corr])
    const lstripSR2 = new LightStrip(0x00ffaa, [18, 5.7, 0 + ls_right_corr], [13.5, 5.7, -4.3 + ls_right_corr])
    lightStrips.push(lstripSL1, lstripSL2, lstripSR1, lstripSR2);

    const lstripSL1B = new LightStrip(0x00ffaa, [-5, -1, 4.3 + 6.5], [46.5, -1, 4.3 + 6.5])
    const lstripSL2B = new LightStrip(0x00ffaa, [58, -1, 0 + ls_right_corr], [46.5, -1, 4.3 + 6.5])
    const lstripSR1B = new LightStrip(0x00ffaa, [-5, -1, -4.3 + ls_right_corr - 6.5], [46.5, -1, -4.3 + ls_right_corr - 6.5])
    const lstripSR2B = new LightStrip(0x00ffaa, [58, -1, 0 + ls_right_corr], [46.5, -1, -4.3 + ls_right_corr - 6.5])
    lightStrips.push(lstripSL1B, lstripSL2B, lstripSR1B, lstripSR2B);

    const lstripCB1 = new LightStrip(0x00ffaa, [-5, 7.9, 6], [-5, 7.9, -6])
    const lstripCB2 = new LightStrip(0x00ffaa, [-11, 7.9, -6], [-5, 7.9, -6])
    const lstripCB3 = new LightStrip(0x00ffaa, [-11, 7.9, 6], [-11, 7.9, -6])
    const lstripCB4 = new LightStrip(0x00ffaa, [-5, 7.9, 6], [-11, 7.9, 6])
    lightStrips.push(lstripCB1, lstripCB2, lstripCB3, lstripCB4);

    const lstripT1L1 = new LightStrip(0x00ffaa, [-17, 1, 59.5], [-17, 41, 59.5]) // light tower L1
    const lstripT1L2 = new LightStrip(0x00ffaa, [-17, 1, 68], [-17, 41, 68])
    const lstripT1L3 = new LightStrip(0x00ffaa, [-8.5, 1, 59.5], [-8.5, 41, 59.5])
    const lstripT1L4 = new LightStrip(0x00ffaa, [-8.5, 1, 68], [-8.5, 41, 68])
    lightStrips.push(lstripT1L1, lstripT1L2, lstripT1L3, lstripT1L4);

    let lt_offset = [37.5, 19.5];
    const lstripT2L1 = new LightStrip(0x00ffaa, [-17 + lt_offset[0], 1, 59.5 + lt_offset[1]], [-17 + lt_offset[0], 21, 59.5 + lt_offset[1]]) // light tower L2
    const lstripT2L2 = new LightStrip(0x00ffaa, [-17 + lt_offset[0], 1, 68 + lt_offset[1]], [-17 + lt_offset[0], 21, 68 + lt_offset[1]])
    const lstripT2L3 = new LightStrip(0x00ffaa, [-8.5 + lt_offset[0], 1, 59.5 + lt_offset[1]], [-8.5 + lt_offset[0], 21, 59.5 + lt_offset[1]])
    const lstripT2L4 = new LightStrip(0x00ffaa, [-8.5 + lt_offset[0], 1, 68 + lt_offset[1]], [-8.5 + lt_offset[0], 21, 68 + lt_offset[1]])
    lightStrips.push(lstripT2L1, lstripT2L2, lstripT2L3, lstripT2L4);

    const lstripT1R1 = new LightStrip(0x00ffaa, [-17, 1, -59.5], [-17, 41, -59.5]) // light tower R1
    const lstripT1R2 = new LightStrip(0x00ffaa, [-17, 1, -68], [-17, 41, -68])
    const lstripT1R3 = new LightStrip(0x00ffaa, [-8.5, 1, -59.5], [-8.5, 41, -59.5])
    const lstripT1R4 = new LightStrip(0x00ffaa, [-8.5, 1, -68], [-8.5, 41, -68])
    lightStrips.push(lstripT1R1, lstripT1R2, lstripT1R3, lstripT1R4);

    const lstripT2R1 = new LightStrip(0x00ffaa, [-17 + lt_offset[0], 1, -59.5 - lt_offset[1]], [-17 + lt_offset[0], 21, -59.5 - lt_offset[1]]) // light tower R2
    const lstripT2R2 = new LightStrip(0x00ffaa, [-17 + lt_offset[0], 1, -68 - lt_offset[1]], [-17 + lt_offset[0], 21, -68 - lt_offset[1]])
    const lstripT2R3 = new LightStrip(0x00ffaa, [-8.5 + lt_offset[0], 1, -59.5 - lt_offset[1]], [-8.5 + lt_offset[0], 21, -59.5 - lt_offset[1]])
    const lstripT2R4 = new LightStrip(0x00ffaa, [-8.5 + lt_offset[0], 1, -68 - lt_offset[1]], [-8.5 + lt_offset[0], 21, -68 - lt_offset[1]])
    lightStrips.push(lstripT2R1, lstripT2R2, lstripT2R3, lstripT2R4);

    // const dome = new Dome();
    // otherDevices.push(dome);
    
    const geometry = new THREE.BoxGeometry(3, 3, 3); 
    const material = new THREE.MeshStandardMaterial({
        color: 0x00ff00, 
        emissive: 0x00ffff,
        emissiveIntensity: 2,
        wireframe: true,
        wireframeLinewidth: 5
    }); 
    cube = new THREE.Mesh(geometry, material); 
    cube.position.set(10, 12, 0)
    scene.add(cube);

    const loaded_scale = 0.3;
    load_object(
        '/assets/stage_structure_solid_only.obj',
        (object:  THREE.Object3D) => {
            let bb = new THREE.Box3().setFromObject(object);
            let size = bb.getSize(new THREE.Vector3()); 
            
            object.scale.set(loaded_scale, loaded_scale, loaded_scale);
        }, 
        new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 1
        })
    )

    load_object(
        '/assets/stage_structure_truss_only.obj', 
        (object: THREE.Object3D) => {
            let bb = new THREE.Box3().setFromObject(object);
            let size = bb.getSize(new THREE.Vector3()); 

            object.scale.set(loaded_scale, loaded_scale, loaded_scale);
        },
        new THREE.MeshStandardMaterial({
            color: 0x444444,
            roughness: 0
        })
    );

    const groundGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
    // const groundMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
    const groundMaterial = new THREE.MeshStandardMaterial({color: 0x000000});
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotateX(-Math.PI / 2);
    ground.translateZ(-10)
    scene.add(ground)
}