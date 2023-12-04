import * as THREE from 'three';
import { MovingLight } from '../assets/create_moving_light';
import { Laser } from '../assets/create_laser';
import { LaserFan } from '../assets/create_laser_fan';

export let movingLights : MovingLight[] = [];
export let laserLights: (Laser | LaserFan)[] = [];

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

    const laserfan1 = new LaserFan(0x66ff00, 0.01, [-5, 1, 0], 15, 45);
    laserfan1.updateSpread();
    laserfan1.setModeAuto((t, _laserFan) => {
        let laserFan = _laserFan as LaserFan;
        laserFan.updateSpread(laserFan.spreadAngle * (Math.sin(t / 60) + 2));
        const dt = Math.sin(t / 120) * 1.3;
        laserFan.object.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), dt);
        // laserFan.object.rotateY(0.2)

        if((t / 10 | 0) % 2 == 0) laserFan.object.visible = true;
        else laserFan.object.visible = false;
    });
    laserLights.push(laserfan1)

    const laserfan2 = new LaserFan(0x66ff00, 0.01, [5, 1, 0], 15, 45);
    laserfan2.updateSpread();
    laserfan2.setModeAuto((t, _laserFan) => {
        let laserFan = _laserFan as LaserFan;
        laserFan.updateSpread(laserFan.spreadAngle * (Math.sin(t / 60) + 2));
        const dt = Math.sin(t / 120) * 1.3;
        laserFan.object.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), dt);
        // laserFan.object.rotateY(-0.2)

        if((t / 10 | 0) % 2 == 0) laserFan.object.visible = true;
        else laserFan.object.visible = false;
    });
    laserLights.push(laserfan2)

    laserLights.forEach(l => l.setModeOff())
}