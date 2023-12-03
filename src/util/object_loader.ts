import * as THREE from 'three';
import { scene } from "../index";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const loader = new OBJLoader();

export const load_object = (
    path: string, 
    transform_function: (object: THREE.Object3D) => any, 
    material: THREE.Material, 
    add = true
) => {
    loader.load(
        path,
        (object) => {
            transform_function(object);
    
            if(add){
                object.children.forEach(child => {
                    // @ts-ignore
                    child.material = material
                });
                scene.add(object);
            }
        },
        (xhr) => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
        (error) => console.log('An error happened', error)
    );
}