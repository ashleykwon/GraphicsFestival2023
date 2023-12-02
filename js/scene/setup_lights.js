import * as THREE from 'three';
import { load_object } from '/js/util/object_loader.js';
import { scene, lamps } from '/js/index.js';

export let light1;
export let light2;

export const setupLights = () => {
    light1 = new THREE.PointLight(0x0000ff, 100.0);
    light2 = new THREE.PointLight(0xff0000, 100.0);
    light1.position.set(2, 10, 0)
    light2.position.set(-2, 10, 0)
    scene.add(light1)
    scene.add(light2)

    load_object(
        '/assets/light.obj', 
        (object) => {
            let bb = new THREE.Box3().setFromObject(object);
            let size = bb.getSize(new THREE.Vector3()); 
            object.scale.set(1 / size.x, 1 / size.x, 1 / size.x)
            object.rotateX(Math.PI);
            object.rotateZ(-Math.PI / 2);
            object.position.set(0, 1.5, 0.5);
    
            const beamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 100);
            const material = new THREE.MeshStandardMaterial({
                color: 0x00ff00, 
                emissive: 0x00ff00,
                emissiveIntensity: 1
            }); 
            const beam = new THREE.Mesh(beamGeometry, material); 
            beam.position.set(0, 51.2, 0)
    
            const lightGroup = new THREE.Group();
            lightGroup.add(object);
            lightGroup.add(beam);
    
            lightGroup.position.set(0, -1, -5)
    
            scene.add(lightGroup);
            lamps.push(lightGroup)
    
            lamps.push(lamps[0].clone(true))
            lamps.push(lamps[0].clone(true))
            lamps[1].rotateZ(Math.PI / 16);
            lamps[2].rotateZ(-Math.PI / 16);
            scene.add(lamps[1])
            scene.add(lamps[2])
        },
        new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 1
        }),
        false
    );
}