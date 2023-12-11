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

export let pyroDevices : (PyroSparkler | PyroJet | SmokeJet)[] = [];
export let otherDevices : Device[] = [];

export const setupStage = () => {
    // pyro sparklers
    const pyroA = new PyroSparkler([2, 3, -10], 800, 8); // stage row
    const pyroB = new PyroSparkler([2, 3, 10], 800, 8);
    const pyroC = new PyroSparkler([2, 3, -30], 800, 8);
    const pyroD = new PyroSparkler([2, 3, 30], 800, 8);
    pyroDevices.push(pyroA)
    pyroDevices.push(pyroB)
    pyroDevices.push(pyroC)
    pyroDevices.push(pyroD)

    const pyroAp = new PyroSparkler([-9, 33, -10], 800, 8); // top row
    const pyroBp = new PyroSparkler([-9, 33, 10], 800, 8);
    const pyroCp = new PyroSparkler([-9, 33, -30], 800, 8);
    const pyroDp = new PyroSparkler([-9, 33, 30], 800, 8);
    pyroDevices.push(pyroAp)
    pyroDevices.push(pyroBp)
    pyroDevices.push(pyroCp)
    pyroDevices.push(pyroDp)

    // pyro jets
    const pyro3 = new PyroJet([2, 3, -20], 2*800, 10); // top row
    const pyro4 = new PyroJet([2, 3, 20], 2*800, 10);
    const pyro5 = new PyroJet([2, 3, -40], 2*800, 10);
    const pyro6 = new PyroJet([2, 3, 40], 2*800, 10);
    pyroDevices.push(pyro6);
    pyroDevices.push(pyro5)
    pyroDevices.push(pyro3)
    pyroDevices.push(pyro4);

    const pyro3p = new PyroJet([-9, 33, -20], 2*800, 10); // stage row
    const pyro4p = new PyroJet([-9, 33, 20], 2*800, 10);
    const pyro5p = new PyroJet([-9, 33, -40], 2*800, 10);
    const pyro6p = new PyroJet([-9, 33, 40], 2*800, 10);
    pyroDevices.push(pyro6p);
    pyroDevices.push(pyro5p)
    pyroDevices.push(pyro3p)
    pyroDevices.push(pyro4p);

    pyroDevices.forEach(pd => pd.setModeOn())
    // pyroDevices.forEach(pd => pd.setModeOff())
    
    // const smoke1 = new SmokeJet([4, 0, 0], 1600, 8);
    // smoke1.setModeOn();
    // pyroDevices.push(smoke1);

    let d_s = -19
    const screenL1L = new LaserScreen([-9, 7.6, 47.5], [1, 0, 0.25], 18, 3.5);
    const screenL2L = new LaserScreen([-8, 12.5, 47.5], [1, 0, 0.25], 18, 3.5);
    const screenL3L = new LaserScreen([-6.3, 17.6, 47.5], [1, 0, 0.25], 18, 3.5);
    const screenL4L = new LaserScreen([-5.3, 23.1, 47.5], [1, 0, 0.25], 18, 3.5);

    const screenL1R = new LaserScreen([-9, 7.6, 47.5 + d_s], [1, 0, -0.25], 18, 3.5);
    const screenL2R = new LaserScreen([-8, 12.5, 47.5 + d_s], [1, 0, -0.25], 18, 3.5);
    const screenL3R = new LaserScreen([-6.3, 17.6, 47.5 + d_s], [1, 0, -0.25], 18, 3.5);
    const screenL4R = new LaserScreen([-5.3, 23.1, 47.5 + d_s], [1, 0, -0.25], 18, 3.5);

    const screenC1L = new LaserScreen([-10.5, 7.6, 15.2], [1, 0, 0.25], 7, 3.5);
    const screenC2L = new LaserScreen([-8.8, 12.5, 13], [1, 0, 0.25], 12, 3.5);
    const screenC3L = new LaserScreen([-6.8, 17.4, 10.5], [1, 0, 0.25], 17, 3.5);
    const screenC4L = new LaserScreen([-5.3, 23.1, 9.5], [1, 0, 0.25], 18, 3.5);

    const screenC1R = new LaserScreen([-10.5, 7.6, -15.2], [1, 0, -0.25], 7, 3.5);
    const screenC2R = new LaserScreen([-8.8, 12.5, -13], [1, 0, -0.25], 12, 3.5);
    const screenC3R = new LaserScreen([-6.8, 17.4, -10.5], [1, 0, -0.25], 17, 3.5);
    const screenC4R = new LaserScreen([-5.3, 23.1, -9.5], [1, 0, -0.25], 18, 3.5);

    const screenR1L = new LaserScreen([-9, 7.6, -47.5], [1, 0, -0.25], 18, 3.5);
    const screenR2L = new LaserScreen([-8, 12.5, -47.5], [1, 0, -0.25], 18, 3.5);
    const screenR3L = new LaserScreen([-6.3, 17.6, -47.5], [1, 0, -0.25], 18, 3.5);
    const screenR4L = new LaserScreen([-4.8, 23.1, -47.5], [1, 0, -0.25], 18, 3.5);

    const screenR1R = new LaserScreen([-9, 7.6, -47.5 - d_s], [1, 0, 0.25], 18, 3.5);
    const screenR2R = new LaserScreen([-8, 12.5, -47.5 - d_s], [1, 0, 0.25], 18, 3.5);
    const screenR3R = new LaserScreen([-6.3, 17.6, -47.5 - d_s], [1, 0, 0.25], 18, 3.5);
    const screenR4R = new LaserScreen([-5.3, 23.1, -47.5 - d_s], [1, 0, 0.25], 18, 3.5);

    const screenC = new LaserScreen([-10, 39, -0.3], [1, 0, 0], 16, 10);

    // light strips
    const lstrip1 = new LightStrip(0x00ffaa, [-5, 4.5, 57], [0, 4.5, 38])

    // const dome = new Dome();
    // otherDevices.push(dome);
    
    // const geometry = new THREE.BoxGeometry(2, 2, 2); 
    // const material = new THREE.MeshStandardMaterial({
    //     color: 0x00ff00, 
    //     emissive: 0x00ffff,
    //     emissiveIntensity: 1,
    //     wireframe: true,
    //     wireframeLinewidth: 2
    // }); 
    // cube = new THREE.Mesh(geometry, material); 
    // cube.position.setY(3)
    // scene.add(cube);

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