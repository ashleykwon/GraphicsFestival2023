import * as THREE from 'three';
import { scene } from '../index';
import { Device } from './device';

export class MovingLight extends Device {
    color: number;
    intensity: number;
    
    constructor(color: number, intensity: number){
        super();
        this.color = color;
        this.intensity = intensity;

        this.object = new THREE.PointLight(this.color, this.intensity);
        scene.add(this.object);
        this.setModeOff();
    }
}