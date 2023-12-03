import * as THREE from 'three';
import { load_object } from '/js/util/object_loader.js';
import { scene, lamps } from '/js/index.js';
import { MovingLight } from '../assets/create_moving_light.js';
import { Laser } from '../assets/create_laser.js';

export let movingLights = [];
export let laserLights = [];

export const setupLights = () => {
    // ************
    // moving lights
    const light1 = new MovingLight(0x0000ff, 100.0);
    light1.setModeAuto((t, light) => {
        const sint = Math.sin(t / 60);
        const cost = Math.cos(t / 60);
        light.object.position.set(cost * 5, 10, sint * 5);
    })
    movingLights.push(light1)

    const light2 = new MovingLight(0xff0000, 100.0);
    light2.setModeAuto((t, light) => {
        const sint = Math.sin(t / 60 + Math.PI);
        const cost = Math.cos(t / 60 + Math.PI);
        light.object.position.set(cost * 5, 10, sint * 5);
    })
    movingLights.push(light2)

    // ************
    // laser lights
    const laser1 = new Laser(0x00ff00, 0.05, [0, 1, 0]);
    laserLights.push(laser1);
}