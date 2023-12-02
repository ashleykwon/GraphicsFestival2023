import { scene } from "../index.js";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const loader = new OBJLoader();

export const load_object = (path, transform_function, material, add = true) => {
    loader.load(
        path,
        (object) => {
            transform_function(object);
    
            if(add){
                object.children.forEach(child => {child.material = material});
                scene.add(object);
            }
        },
        (xhr) => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
        (error) => console.log('An error happened', error)
    );
}