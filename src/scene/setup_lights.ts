import * as THREE from 'three';
import { MovingLight } from '../assets/create_moving_light';
import { Laser } from '../assets/create_laser';
import { LaserFan } from '../assets/create_laser_fan';
import { scene } from '../index';
import { SpotLight } from '../assets/create_spot_light';

export let movingLights : (MovingLight | SpotLight)[] = [];
export let laserLights: (Laser | LaserFan)[] = [];
export let spotLights: SpotLight[] = [];

export const setupLights = () => {
    // spot lights
    const genSpotlights = (pt1: number[], pt2: number[], num: number) => {
        let createdLights: SpotLight[] = [];
        for(let i = 0; i <= (num - 1); i += 1){
            let t = i / (num - 1);
            let p = [
                t * pt1[0] + (1 - t) * pt2[0], 
                t * pt1[1] + (1 - t) * pt2[1], 
                t * pt1[2] + (1 - t) * pt2[2]
            ];
            const SL = new SpotLight(0xffffff, 0.2, p, [1, 0, 0]);
            SL.setModeOn();
            createdLights.push(SL);
        }
        return createdLights;
    }
    // const lightSL1 = new SpotLight(0xffffff, 0.3, [30, 30, 0], [1, 0, 0]);
    // lightSL1.setModeOn();
    spotLights.push(...genSpotlights([-7.5, 22, 68], [-7.5, 22, 60], 4));
    spotLights.push(...genSpotlights([-7.5, 41, 68], [-7.5, 41, 60], 4));
    spotLights.push(...genSpotlights([-7.5, 22, -68], [-7.5, 22, -60], 4));

    spotLights.push(...genSpotlights([-7.5, 41, -68], [-7.5, 41, -60], 4));
    spotLights.push(...genSpotlights([-7.5, 41, -68], [-7.5, 41, -60], 4));

    
    spotLights.push(...genSpotlights([-6.5, 25, 55], [-2.5, 25, 39], 8));
    spotLights.push(...genSpotlights([-2.5, 25, 55 - 18.5], [-6.5, 25, 39 - 18.5], 8));
    spotLights.push(...genSpotlights([-6.5 - 1.5, 25 - 5.3, 55], [-2.5 - 1.5, 25 - 5.3, 39], 8));
    spotLights.push(...genSpotlights([-2.5 - 1.5, 25 - 5.3, 55 - 18.5], [-6.5 - 1.5, 25 - 5.3, 39 - 18.5], 8));
    spotLights.push(...genSpotlights([-6.5 - 3.8, 25 - 10.3, 55], [-2.5 - 3.8, 25 - 10.3, 39], 8));
    spotLights.push(...genSpotlights([-2.5 - 3.8, 25 - 10.3, 55 - 18.5], [-6.5 - 3.8, 25 - 10.3, 39 - 18.5], 8));
    spotLights.push(...genSpotlights([-6.5 - 5, 25 - 15.3, 55], [-2.5 - 5, 25 - 15.3, 39], 8));
    spotLights.push(...genSpotlights([-2.5 - 5, 25 - 15.3, 55 - 18.5], [-6.5 - 5, 25 - 15.3, 39 - 18.5], 8));

    spotLights.push(...genSpotlights([-6.5, 25, -(55)], [-2.5, 25, -(39)], 8));
    spotLights.push(...genSpotlights([-2.5, 25, -(55 - 18.5)], [-6.5, 25, -(39 - 18.5)], 8));
    spotLights.push(...genSpotlights([-6.5 - 1.5, 25 - 5.3, -(55)], [-2.5 - 1.5, 25 - 5.3, -(39)], 8));
    spotLights.push(...genSpotlights([-2.5 - 1.5, 25 - 5.3, -(55 - 18.5)], [-6.5 - 1.5, 25 - 5.3, -(39 - 18.5)], 8));
    spotLights.push(...genSpotlights([-6.5 - 3.8, 25 - 10.3, -(55)], [-2.5 - 3.8, 25 - 10.3, -(39)], 8));
    spotLights.push(...genSpotlights([-2.5 - 3.8, 25 - 10.3, -(55 - 18.5)], [-6.5 - 3.8, 25 - 10.3, -(39 - 18.5)], 8));
    spotLights.push(...genSpotlights([-6.5 - 5, 25 - 15.3, -(55)], [-2.5 - 5, 25 - 15.3, -(39)], 8));
    spotLights.push(...genSpotlights([-2.5 - 5, 25 - 15.3, -(55 - 18.5)], [-6.5 - 5, 25 - 15.3, -(39 - 18.5)], 8));

    // ************
    // moving lights

    const light1 = new MovingLight(0x00ffff, 500.0);
    light1.setModeAuto((t, light) => {
        const sint = Math.sin(t / 60);
        const cost = Math.cos(t / 60);
        light.object.position.set(15 + cost * 5, 30, sint * 5);
    })
    movingLights.push(light1)

    const light2 = new MovingLight(0x00ff00, 500.0);
    light2.setModeAuto((t, light) => {
        const sint = Math.sin(t / 60 + Math.PI);
        const cost = Math.cos(t / 60 + Math.PI);
        light.object.position.set(15 + cost * 5, 30, sint * 5);
    })
    movingLights.push(light2)

    const light3 = new MovingLight(0xffffff, 100.0);
    light3.object.position.set(24.5, 10, 83);
    light3.setModeOn();
    movingLights.push(light3)

    const light4 = new MovingLight(0xffffff, 100.0);
    light4.object.position.set(24.5, 10, -83);
    light4.setModeOn();
    movingLights.push(light4)

    const light_left_truss = new MovingLight(0xffffff, 100.0);
    light_left_truss.object.position.set(-13, 10, 64);
    light_left_truss.setModeOn();
    movingLights.push(light_left_truss)

    const light_right_truss = new MovingLight(0xffffff, 100.0);
    light_right_truss.object.position.set(-13, 10, -64);
    light_right_truss.setModeOn();
    movingLights.push(light_right_truss)

    // ************
    // laser lights
    let centerL = [-14, 1, 63]
    const laserL1 = new Laser(0x00ff00, 0.1, [centerL[0] + 2, centerL[1], centerL[2]]);
    const laserL2 = new Laser(0x00ff00, 0.1, [centerL[0], centerL[1], centerL[2] + 2]);
    const laserL3 = new Laser(0x00ff00, 0.1, [centerL[0] + 2, centerL[1], centerL[2] + 2]);
    const laserL4 = new Laser(0x00ff00, 0.1, [centerL[0], centerL[1], centerL[2]]);
    laserL1.setModeOn();
    laserL2.setModeOn();
    laserL3.setModeOn();
    laserL4.setModeOn();
    laserLights.push(laserL1);
    laserLights.push(laserL2);
    laserLights.push(laserL3);
    laserLights.push(laserL4);

    let centerLF = [24, 1, 82]
    const laserLF1 = new Laser(0x00ff00, 0.1, [centerLF[0] + 2, centerLF[1], centerLF[2]]);
    const laserLF2 = new Laser(0x00ff00, 0.1, [centerLF[0], centerLF[1], centerLF[2] + 2]);
    const laserLF3 = new Laser(0x00ff00, 0.1, [centerLF[0] + 2, centerLF[1], centerLF[2] + 2]);
    const laserLF4 = new Laser(0x00ff00, 0.1, [centerLF[0], centerLF[1], centerLF[2]]);
    laserLF1.setModeOn();
    laserLF2.setModeOn();
    laserLF3.setModeOn();
    laserLF4.setModeOn();
    laserLights.push(laserLF1);
    laserLights.push(laserLF2);
    laserLights.push(laserLF3);
    laserLights.push(laserLF4);

    let centerR = [-14, 1, -63 - 2]
    const laserR1 = new Laser(0x00ff00, 0.1, [centerR[0] + 2, centerR[1], centerR[2]]);
    const laserR2 = new Laser(0x00ff00, 0.1, [centerR[0], centerR[1], centerR[2] + 2]);
    const laserR3 = new Laser(0x00ff00, 0.1, [centerR[0] + 2, centerR[1], centerR[2] + 2]);
    const laserR4 = new Laser(0x00ff00, 0.1, [centerR[0], centerR[1], centerR[2]]);
    laserR1.setModeOn();
    laserR2.setModeOn();
    laserR3.setModeOn();
    laserR4.setModeOn();
    laserLights.push(laserR1);
    laserLights.push(laserR2);
    laserLights.push(laserR3);
    laserLights.push(laserR4);

    let centerRF = [24, 1, -82 - 6]
    const laserRF1 = new Laser(0x00ff00, 0.1, [centerRF[0] + 2, centerRF[1], centerRF[2]]);
    const laserRF2 = new Laser(0x00ff00, 0.1, [centerRF[0], centerRF[1], centerRF[2] + 2]);
    const laserRF3 = new Laser(0x00ff00, 0.1, [centerRF[0] + 2, centerRF[1], centerRF[2] + 2]);
    const laserRF4 = new Laser(0x00ff00, 0.1, [centerRF[0], centerRF[1], centerRF[2]]);
    laserRF1.setModeOn();
    laserRF2.setModeOn();
    laserRF3.setModeOn();
    laserRF4.setModeOn();
    laserLights.push(laserRF1);
    laserLights.push(laserRF2);
    laserLights.push(laserRF3);
    laserLights.push(laserRF4);

    // const laserfan1 = new LaserFan(0xaaff00, 0.05, [-5, 1, 0], 15, 90);
    // laserfan1.updateSpread();
    // laserfan1.setModeAuto((t, _laserFan) => {
    //     let laserFan = _laserFan as LaserFan;
    //     laserFan.updateSpread(laserFan.spreadAngle * (Math.sin(t / 60) + 2));
    //     const dt = Math.sin(t / 120) * 1.3;
    //     laserFan.object.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), dt);

    //     laserFan.object.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2);

    //     if((t / 10 | 0) % 2 == 0) laserFan.object.visible = true;
    //     else laserFan.object.visible = false;
    // });
    // laserLights.push(laserfan1)

    // const laserfan2 = new LaserFan(0xaaff00, 0.05, [5, 1, 0], 15, 90);
    // laserfan2.updateSpread();
    // laserfan2.setModeAuto((t, _laserFan) => {
    //     let laserFan = _laserFan as LaserFan;
    //     laserFan.updateSpread(laserFan.spreadAngle * (Math.sin(t / 60) + 2));
    //     const dt = Math.sin(t / 120) * 1.3;
    //     laserFan.object.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), dt);

    //     if((t / 10 | 0) % 2 == 0) laserFan.object.visible = true;
    //     else laserFan.object.visible = false;
    // });
    // laserLights.push(laserfan2)


    const laserfanTA = new LaserFan(0xaaff00, 0.05, [-5, 29, 0], 15, 90);
    laserfanTA.updateSpread();
    laserfanTA.setModeAuto((t, _laserFan) => {
        let laserFan = _laserFan as LaserFan;
        laserFan.object.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2 + 45 * Math.PI / 180);
    });
    laserLights.push(laserfanTA)

    const laserfanTB = new LaserFan(0xaaff00, 0.05, [-5, 29, 38.5], 15, 90);
    laserfanTB.updateSpread();
    laserfanTB.setModeAuto((t, _laserFan) => {
        let laserFan = _laserFan as LaserFan;
        laserFan.object.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2 + 25 * Math.PI / 180);
    });
    laserLights.push(laserfanTB)

    const laserfanTC = new LaserFan(0xaaff00, 0.05, [-5, 29, -38.5], 15, 90);
    laserfanTC.updateSpread();
    laserfanTC.setModeAuto((t, _laserFan) => {
        let laserFan = _laserFan as LaserFan;
        laserFan.object.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2 + 25 * Math.PI / 180);
    });
    laserLights.push(laserfanTC)

    const laserfanMA = new LaserFan(0xaaff00, 0.05, [-5, 6.5, 0], 15, 90);
    laserfanMA.updateSpread();
    laserfanMA.setModeAuto((t, _laserFan) => {
        let laserFan = _laserFan as LaserFan;
        laserFan.object.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2 + 45 * Math.PI / 180);
    });
    laserLights.push(laserfanMA)

    const laserfanMB = new LaserFan(0xaaff00, 0.05, [-5, 6.5, 38.5], 15, 90);
    laserfanMB.updateSpread();
    laserfanMB.setModeAuto((t, _laserFan) => {
        let laserFan = _laserFan as LaserFan;
        laserFan.object.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2 + 25 * Math.PI / 180);
    });
    laserLights.push(laserfanMB)

    const laserfanMC = new LaserFan(0xaaff00, 0.05, [-5, 6.5, -38.5], 15, 90);
    laserfanMC.updateSpread();
    laserfanMC.setModeAuto((t, _laserFan) => {
        let laserFan = _laserFan as LaserFan;
        laserFan.object.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2 + 25 * Math.PI / 180);
    });
    laserLights.push(laserfanMC)

    // laserLights.forEach(l => l.setModeOff())

    // ************
    // spot lights
    // const spotlight1 = new SpotLight(
    //     0xffff00, 0.2, 
    //     [-4, 8, -2], [1, -1, 0]
    // );
    // spotlight1.setModeOn(); 
    // movingLights.push(spotlight1);
}