import * as THREE from 'three';
import { scene } from '../index';
import { Laser } from './create_laser';
import { Device } from './device';
import { remap } from '../util/math_util';

export class LaserFan extends Device {
    color: number;
    width: number;
    position: number[];
    numLasers: number;
    spreadAngle: number;
    lasers: Laser[];

    constructor(color: number, width: number, position: number[], numLasers: number, spreadAngle: number){
        super();

        this.color = color;
        this.width = width;
        this.position = position;
        this.numLasers = numLasers;
        this.spreadAngle = spreadAngle;

        this.object = new THREE.Group();
        this.object.translateX(position[0]);
        this.object.translateY(position[1]);
        this.object.translateZ(position[2]);
        this.lasers = [];

        for(let i = 0; i < numLasers; i++){
            const laser = new Laser(color, width, [0, 0, 0]);
            laser.setModeOn();
            this.lasers.push(laser);
            this.object.add(laser.object);
        }

        scene.add(this.object);
        this.setModeOff();
    }

    updateSpread(angle?: number){
        if(angle === undefined) angle = this.spreadAngle
        for(let i = 0; i < this.numLasers; i++){
            const degrees = remap(i, 0, this.numLasers - 1, -angle / 2, angle / 2);
            const theta = degrees * Math.PI / 180;
            this.lasers[i].object.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), theta);
        }

        // console.log(this, this.lasers)
    }
}