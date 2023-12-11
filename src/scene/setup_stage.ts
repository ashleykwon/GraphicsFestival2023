import * as THREE from 'three';
import { load_object } from '../util/object_loader';
import { scene } from '../index';
import { PyroSparkler } from '../assets/create_pyro_sparkler';
import { Device } from '../assets/device';
import { Dome } from '../assets/create_dome';
import { PyroJet } from '../assets/create_pyro_jet';
import { SmokeJet } from '../assets/create_smoke_jet';

import { LaserScreen } from '../assets/create_screen';
import { JigglyDancer } from 'assets/create_jiggly_dancer';

export let cube: THREE.Mesh;

export let pyroDevices : (PyroSparkler | PyroJet | SmokeJet)[] = [];
export let otherDevices : Device[] = [];

export const setupStage = () => {
    const pyro1 = new PyroSparkler([2, 3, -10], 800, 8);
    pyroDevices.push(pyro1)
    const pyro2 = new PyroSparkler([2, 3, 10], 800, 8);
    pyroDevices.push(pyro2)
    const pyroC = new PyroSparkler([2, 3, -30], 800, 8);
    pyroDevices.push(pyroC)
    const pyroD = new PyroSparkler([2, 3, 30], 800, 8);
    pyroDevices.push(pyroD)

    pyro1.setModeOn();
    pyro2.setModeOn();
    pyroC.setModeOn();
    pyroD.setModeOn();

    const pyro3 = new PyroJet([2, 3, -20], 2*800, 10);
    pyro3.setModeOn();
    pyroDevices.push(pyro3)
    const pyro4 = new PyroJet([2, 3, 20], 2*800, 10);
    pyro4.setModeOn();
    pyroDevices.push(pyro4);
    const pyro5 = new PyroJet([2, 3, -40], 2*800, 10);
    pyro5.setModeOn();
    pyroDevices.push(pyro5)
    const pyro6 = new PyroJet([2, 3, 40], 2*800, 10);
    pyro6.setModeOn();
    pyroDevices.push(pyro6);
    
    // const smoke1 = new SmokeJet([4, 0, 0], 1600, 8);
    // smoke1.setModeOn();
    // pyroDevices.push(smoke1);


    // create screen
    const laserScreen1 = new LaserScreen([-10, 20, 0], [1, 1, 0], 1000.0, 1000.0, 10, 10, 0.1);
    otherDevices.push(laserScreen1);
    console.log('laser screen made');
    // lineColor: number[], verticalLineDensity: number, horizontalLineDensity: number, planeWidth: number, planeHeight: number

    // make a directional light (only for debugging purposes)
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    scene.add( directionalLight );


    // const jigglyDancer1 = new JigglyDancer([0, 0, 4], [0, 1, 0]);
    // otherDevices.push(jigglyDancer1);

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
            color: 0xdddddd,
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