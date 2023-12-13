import { LightStrip } from "assets/create_light_strip";
import { SpotLight } from "../assets/create_spot_light";
import { Device } from "../assets/device";
import { movingLights, spotLights, towerLasers } from "./setup_lights";
import { lightStrips } from "./setup_stage";
import * as THREE from "three";
import { Laser } from "assets/create_laser";
import { MovingLight } from "assets/create_moving_light";

export const sparkleSpotlights = (duration: number) => {
    let onOff = new Array(spotLights.length).fill(false);
    onOff = onOff.map(() => Math.random() < 0.5 ? true : false);

    let sparkleCounters = new Array(spotLights.length).fill(0);
    spotLights.forEach((sl, i) => {
        sl.setModePlay((t: number, device: Device) => {
            const spotlight = device as SpotLight;

            sparkleCounters[i] += 1;
            if(sparkleCounters[i] % 6 != 0) return;

            spotlight.object.visible = Math.random() < 0.5;

        }, () => {}, duration);
    })
}



export const pulseSparkleSpotlights = (duration: number, groups: number, pulseCount: number) => {
    let startTimes = new Array(spotLights.length).fill(0);
    // let ids = new Array(spotLights.length).fill(0).map(() => Math.random() * groups | 0);
    let ids = new Array(spotLights.length).fill(0);
    for(let i = 1; i < ids.length; i++){
        let num = Math.random() * groups | 0;
        while(num == ids[i - 1]){
            num = Math.random() * groups | 0;
        }
        ids[i] = num;
    }
    let t_duration = duration / 1000 * 120;

    spotLights.forEach((ls, i) => {
        ls.setModePlay((t: number, device: Device) => {
            const sl = device as SpotLight;
            if(startTimes[i] == 0) startTimes[i] = t;

            const mix = ((t - startTimes[i]) / t_duration) * (pulseCount / groups);
            const curGroup = Math.floor(mix * groups) % groups;
            sl.object.visible = ids[i] == curGroup;
        }, () => {}, duration);
    });
}

export const crossfadeLightStrips = (c1: number, c2: number, duration: number) => {
    let lightStripStartTimes = new Array(lightStrips.length).fill(0);
    let durationSec = duration / 1000;
    const c1t = new THREE.Color(c1);
    const c2t = new THREE.Color(c2);

    lightStrips.forEach((ls, i) => {
        ls.setModePlay((t: number, device: Device) => {
            const lightstrip = device as LightStrip;
            if(lightStripStartTimes[i] == 0) lightStripStartTimes[i] = t;

            const mix = (t - lightStripStartTimes[i]) / durationSec;
            const fc = c1t.lerp(c2t, mix / 1000);
            lightstrip.object.material.color = fc;
        }, () => {}, duration);
    });
}

export const crossfadeTowerLasers = (c1: number, c2: number, duration: number) => {
    let startTimes = new Array(towerLasers.length).fill(0);
    let durationSec = duration / 1000;
    const c1t = new THREE.Color(c1);
    const c2t = new THREE.Color(c2);

    towerLasers.forEach((ls, i) => {
        ls.setModePlay((t: number, device: Device) => {
            // console.log(c1, c2)
            const laser = device as Laser;
            if(startTimes[i] == 0) startTimes[i] = t;

            const mix = (t - startTimes[i]) / durationSec;
            const fc = c1t.lerp(c2t, mix / 1000);
            laser.object.material.color = fc;
            laser.object.material.emissive = fc;
        }, () => {}, duration);
    });
}

export const crossfadeMovingLights = (c1: number, c2: number, duration: number) => {
    let startTimes = new Array(movingLights.length).fill(0);
    let durationSec = duration / 1000;
    const c1t = new THREE.Color(c1);
    const c2t = new THREE.Color(c2);

    movingLights.forEach((ls, i) => {
        ls.setModePlay((t: number, device: Device) => {
            const ml = device as MovingLight;
            if(startTimes[i] == 0) startTimes[i] = t;

            const mix = (t - startTimes[i]) / durationSec;
            const fc = c1t.lerp(c2t, mix / 1000);
            ml.object.color = fc;
        }, () => {}, duration);
    });
}