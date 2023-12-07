import * as THREE from 'three';
import { load_object } from '../util/object_loader';
import { scene } from '../index';
import { PyroSparkler } from '../assets/create_pyro_sparkler';
import { Device } from '../assets/device';
import { Dome } from '../assets/create_dome';
import { PyroJet } from '../assets/create_pyro_jet';

export let cube: THREE.Mesh;

export let pyroDevices : (PyroSparkler | PyroJet)[] = [];
export let otherDevices : Device[] = [];

export const setupStage = () => {
    const pyro1 = new PyroSparkler([-8, 0, 0], 800, 6);
    pyro1.setModeOn();
    pyroDevices.push(pyro1)
    const pyro2 = new PyroSparkler([8, 0, 0], 800, 6);
    pyro2.setModeOn();
    pyroDevices.push(pyro2)

    const pyro3 = new PyroJet([-4, 0, 0], 800, 10);
    pyro3.setModeOn();
    pyroDevices.push(pyro3)
    const pyro4 = new PyroJet([4, 0, 0], 800, 10);
    pyro4.setModeOn();
    pyroDevices.push(pyro4)

    // const dome = new Dome();
    // otherDevices.push(dome);
    
    const geometry = new THREE.BoxGeometry(2, 2, 2); 
    const material = new THREE.MeshStandardMaterial({
        color: 0x00ff00, 
        emissive: 0x00ffff,
        emissiveIntensity: 1,
        wireframe: true,
        wireframeLinewidth: 2
    }); 
    cube = new THREE.Mesh(geometry, material); 
    cube.position.setY(3)
    scene.add(cube);

    load_object(
        '/assets/truss_full.obj',
        (object:  THREE.Object3D) => {
            let bb = new THREE.Box3().setFromObject(object);
            let size = bb.getSize(new THREE.Vector3()); 
            
            object.scale.set(10 / size.x, 10 / size.x, 10 / size.x)
            object.rotateX(-Math.PI / 2);
            object.rotateZ(-Math.PI / 2);
        }, 
        new THREE.MeshStandardMaterial({
            color: 0xdddddd,
            roughness: 0
        })
    )

    load_object(
        '/assets/stage.obj', 
        (object: THREE.Object3D) => {
            let bb = new THREE.Box3().setFromObject(object);
            let size = bb.getSize(new THREE.Vector3()); 
            object.scale.set(15 / size.x, 15 / size.x, 15 / size.x)
            object.rotateX(-Math.PI / 2);
            object.rotateZ(-Math.PI / 2);
            object.position.set(0, -0.1, -2.5);
        },
        new THREE.MeshStandardMaterial({
            color: 0x444444,
            roughness: 1
        })
    );

    const groundGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
    const groundMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotateX(-Math.PI / 2);
    ground.translateZ(-100)
    scene.add(ground)
}