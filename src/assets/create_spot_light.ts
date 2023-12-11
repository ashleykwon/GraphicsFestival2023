import * as THREE from 'three';
import { scene, scene2 } from '../index';
import { Device } from './device';

export class SpotLight extends Device {
    color: number;
    radius: number;
    position: number[];
    direction: number[];
    
    constructor(color: number, radius: number, position: number[], direction: number[]){
        super();
        this.color = color;
        this.radius = radius;
        this.position = position;
        this.direction = direction;
        
        const spotlightGroup = new THREE.Group();
        const geometry = new THREE.SphereGeometry(radius, 10, 10);
        geometry.scale(1, 1, 1)
        const material = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 2,
            roughness: 0
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(position[0], position[1], position[2]);
        spotlightGroup.add(mesh);

        // const light = new THREE.PointLight(color, 100, 0);
        // light.position.set(position[0], position[1] + radius, position[2]);
        // spotlightGroup.add(light);
        // const light2 = new THREE.PointLight(color, 100, 0);
        // light2.position.set(position[0], position[1] - radius, position[2]);
        // spotlightGroup.add(light2);

        this.object = spotlightGroup;

        scene2.add(this.object);
        this.setModeOff();
    }
}