import * as THREE from 'three';
import { scene } from '../index.js';
import { Device } from './device.js';

export class MovingLight extends Device {
    constructor(color, intensity){
        super();
        this.color = color;
        this.intensity = intensity;

        this.object = new THREE.PointLight(this.color, this.intensity);
        scene.add(this.object);
        this.setModeOff();
    }
}