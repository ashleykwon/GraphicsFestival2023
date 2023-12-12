import { LightStrip } from "assets/create_light_strip";
import { SpotLight } from "../assets/create_spot_light";
import { Device } from "../assets/device";
import { spotLights, towerLasers } from "./setup_lights";
import { lightStrips } from "./setup_stage";
import * as THREE from "three";
import { Laser } from "assets/create_laser";

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
            const laser = device as Laser;
            if(startTimes[i] == 0) startTimes[i] = t;

            const mix = (t - startTimes[i]) / durationSec;
            const fc = c1t.lerp(c2t, mix / 1000);
            laser.object.material.color = fc;
            laser.object.material.emissive = fc;
        }, () => {}, duration);
    });
}