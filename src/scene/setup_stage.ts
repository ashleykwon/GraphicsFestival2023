import * as THREE from 'three';
import { load_object } from '../util/object_loader';
import { scene } from '../index';
import { Pyrotechnic } from '../assets/create_pyrotechnic';

export let cube: THREE.Mesh;

export let pyroDevices : Pyrotechnic[] = [];

export const setupStage = () => {
    const pyro1 = new Pyrotechnic();
    pyroDevices.push(pyro1)
    
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
        (object: THREE.Object3D) => {
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
    );

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
}