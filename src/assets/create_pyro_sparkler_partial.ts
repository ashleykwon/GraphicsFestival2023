// https://entertainmenteffects.co.uk/top-5-most-dazzling-concert-special-effects
// https://github.com/mrdoob/three.js/blob/master/examples/webgl_points_waves.html
// comet, gerb, mines

import { scene } from '../index';
import { Device } from './device';

import * as THREE from 'three';

import { range, texture, mix, uv, color, positionLocal, timerLocal, SpriteNodeMaterial } from 'three/examples/jsm/nodes/Nodes';

const vertexShader = `
uniform float stop;
attribute float scale;
attribute float brightness;

out float particle_brightness;

void main() {

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

    if(stop == 0.f){
        gl_PointSize = 10.f;
    } else {
        gl_PointSize = scale * ( 300.0 / - mvPosition.z);
    }

    gl_Position = projectionMatrix * mvPosition;

    particle_brightness = brightness;
}
`;

const fragmentShader = `
uniform float stop;
uniform vec3 color;

in float particle_brightness;

void main() {
    if(stop == 0.f){
        if (length( gl_PointCoord - vec2( 0.5, 0.5)) > 0.475) discard;
        gl_FragColor = vec4(vec3(1.0, 1.0, 1.0) * 0.3, 1.0);
        return;
    }

    else if(stop == 1.f){
        if (length( gl_PointCoord - vec2( 0.5, 0.5)) > 0.475) discard;
        gl_FragColor = vec4(vec3(1.0, 1.0, 1.0) * 0.3, 1.0);
        return;
    }

    else if(stop == 2.f){
        if (length( gl_PointCoord - vec2( 0.5, 0.5)) > 0.475) discard;
        gl_FragColor = vec4(mix(color, vec3(1.0), particle_brightness - 0.3), 1.0);
        return;
    }


    if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;

    if(particle_brightness < 0.5){
        gl_FragColor = vec4(color, 1.0) * particle_brightness;
    } else {
        gl_FragColor = vec4(mix(color, vec3(1.0), particle_brightness - 0.5), 1.0);
    }
}
`;

export class PyroSparklerPartial extends Device {
    position: number[];
    numParticles: number;
    height: number;
    particleSimStep: (t: number, device: Device) => void;
    emitParticles: boolean;
    framesPassed: number;
    resetSim: (device: Device) => void;
    
    constructor(position: number[], numParticles: number, height: number, stop: number){
        super();

        this.position = position;
        this.numParticles = numParticles;
        this.height = height;

        const NUM_PARTICLES = numParticles;
        const positions = new Float32Array(NUM_PARTICLES * 3);
        const scales = new Float32Array(NUM_PARTICLES);
        const brightness = new Float32Array(NUM_PARTICLES);

        let i = 0, j = 0;

        for(let n = 0; n < NUM_PARTICLES; n++) {
            positions[i] = this.position[0];
            positions[i + 1] = this.position[1] + this.height * Math.random() * 0.5;
            positions[i + 2] = this.position[2]; 

            scales[j] = Math.random() * 0.2 + 0.2;
            brightness[j] = Math.random();

            i += 3;
            j ++;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
        geometry.setAttribute('brightness', new THREE.BufferAttribute(brightness, 1));
        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: {value: new THREE.Color(0xffaa00)},
                stop: {value: stop}
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });

        const machineGeometry = new THREE.BoxGeometry(2, 2, 2);
        const machineMaterial = new THREE.MeshStandardMaterial({color: 0xaaaaaa});
        const machine = new THREE.Mesh(machineGeometry, machineMaterial);
        machine.position.set(position[0], position[1], position[2]);
        scene.add(machine);

        this.object = new THREE.Points(geometry, material);
        this.object.frustumCulled = false;
        scene.add(this.object);

        this.framesPassed = 0;

        this.resetSim = (device: Device) => {

        }
        
        this.particleSimStep = (t: number, device: Device) => {
            if(!this.object.visible) return;

            t = t / 60
            const d = device as PyroSparklerPartial;
            let i = 0, j = 0;

            const positions = d.object.geometry.attributes.position.array;
            const scales = d.object.geometry.attributes.scale.array;

            const p0 = this.position[0];
            const p1 = this.position[1];
            const p2 = this.position[2];

            for(let n = 0; n < NUM_PARTICLES; n++) {
                positions[i] += (Math.random() - 0.5) * 0.5;
                positions[i + 1] += Math.random() * 2;
                positions[i + 2] += (Math.random() - 0.5) * 0.5;

                if((this.height**2) < (p0 - positions[i]) ** 2 + (p1 - positions[i + 1]) ** 2 + (p2 - positions[i + 2]) ** 2){
                    positions[i] = p0;
                    positions[i + 1] = p1;
                    positions[i + 2] = p2;
                }
    
                i += 3;
                j ++;
            }

            d.object.geometry.attributes.position.needsUpdate = true;
            d.object.geometry.attributes.scale.needsUpdate = true;
        };

        this.emitParticles = true;

        this.setModeOff();
    }
}