import * as THREE from 'three';
import { scene } from '../index';
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
        const geometry = new THREE.SphereGeometry(radius);
        const material = new THREE.MeshBasicMaterial({
            color: color
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(position[0], position[1], position[1]);
        spotlightGroup.add(mesh);

        const light = new THREE.SpotLight(this.color, 500, 0, 45 * Math.PI / 180);
        light.position.set(position[0], position[1], position[1]);
        light.lookAt(
            position[0] + direction[0],
            position[1] + direction[1],
            position[2] + direction[2]
        );
        spotlightGroup.add(light);

        this.object = spotlightGroup;

        scene.add(this.object);
        this.setModeOff();
    }
}