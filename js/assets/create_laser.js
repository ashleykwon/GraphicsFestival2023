import * as THREE from 'three';
import { scene } from '../index.js';
import { Device } from './device.js';

export class Laser extends Device {
    constructor(color, width, position){
        super(); 
        
        this.color = color;
        this.width = width;  // 0.05
        this.position = position;

        this.mode = 'OFF';
        this.autoFunc = () => {};
        this.playFunc = () => {};
        this.playCallback = () => {};
        this.playStartTime = 0;
        this.playLength = 0;

        this.geometry = new THREE.CylinderGeometry(this.width, this.width, 100);
        this.material = new THREE.MeshStandardMaterial({
            color: this.color, 
            emissive: this.color,
            emissiveIntensity: 1
        }); 
        this.object = new THREE.Mesh(this.geometry, this.material); 

        this.geometry.translate(0, 50, 0); // fix origin to be at beam origin
        this.object.position.set(...this.position)

        scene.add(this.object);
        this.setModeOff();
    }
}