// https://entertainmenteffects.co.uk/top-5-most-dazzling-concert-special-effects
// https://github.com/mrdoob/three.js/blob/master/examples/webgl_points_waves.html
// comet, gerb, mines

import { scene } from '../index';
import { Device } from './device';

import * as THREE from 'three';

import { range, texture, mix, uv, color, positionLocal, timerLocal, SpriteNodeMaterial } from 'three/examples/jsm/nodes/Nodes';

const vertexShader = `
attribute float scale;
attribute float brightness;
attribute float noise1D;

out float particle_brightness;
out float noise_seed;

void main() {

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

    gl_PointSize = scale * ( 300.0 / - mvPosition.z );

    gl_Position = projectionMatrix * mvPosition;

    particle_brightness = brightness;
    noise_seed = noise1D;
}
`;

const fragmentShader = `
uniform vec3 color;

in float particle_brightness;
in float noise_seed;

// from https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

void main() {
    float nx = gl_PointCoord.x - particle_brightness * 100000.f;
    float ny = gl_PointCoord.y + noise_seed * 100000.f;

    if (length(gl_PointCoord - vec2(
        0.5 + noise(1.f * vec2(nx, ny)) - 0.5 + noise(4.f * vec2(nx, ny)) * 0.2 - 0.1, 
        0.5 + noise(1.f * vec2(nx, ny)) - 0.5 + noise(4.f * vec2(nx, ny)) * 0.2 - 0.1
    )) > 0.475) discard;

    float r = length(gl_PointCoord - vec2(0.5, 0.5));
    if(r > 0.475) discard;
    float norm_r = 1.f - r / 0.475;

    float alpha = particle_brightness;
    float dh = noise(8.f * vec2(nx, ny));

    // if(dh > 0.2) alpha = 0.f; 

    float l = 0.3;
    gl_FragColor = vec4(vec3(l, l, l) * alpha, 0.5) + 0.2;
    // gl_FragColor = vec4(vec3(l, l, l), 1.0) * alpha * 1.5;
}
`;

export class SmokeJet extends Device {
    position: number[];
    numParticles: number;
    height: number;
    particleSimStep: (t: number, device: Device) => void;
    emitParticles: boolean;
    framesPassed: number;
    resetSim: (device: Device) => void;
    
    constructor(position: number[], numParticles: number, height: number){
        super();

        this.position = position;
        this.numParticles = numParticles;
        this.height = height;

        const NUM_PARTICLES = numParticles;
        const positions = new Float32Array(NUM_PARTICLES * 3);
        const scales = new Float32Array(NUM_PARTICLES);
        const brightness = new Float32Array(NUM_PARTICLES);
        const noise1D = new Float32Array(NUM_PARTICLES);

        let i = 0, j = 0;

        for(let n = 0; n < NUM_PARTICLES; n++) {
            positions[i] = this.position[0];
            positions[i + 1] = this.position[1];
            positions[i + 2] = this.position[2]; 

            let s = 1.5;
            scales[j] = (Math.random() * 0.5 + 1) * s;
            if(Math.random() > 0.98) scales[j] = (Math.random() * 2 + 2) * s;

            brightness[j] = Math.random();
            noise1D[j] = Math.random();

            i += 3;
            j ++;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
        geometry.setAttribute('brightness', new THREE.BufferAttribute(brightness, 1));
        geometry.setAttribute('noise1D', new THREE.BufferAttribute(noise1D, 1));
        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: {value: new THREE.Color(0xaaaaaa)},
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true
        });

        this.object = new THREE.Points(geometry, material);
        this.object.frustumCulled = false;
        scene.add(this.object);

        this.framesPassed = 0;

        let shouldResetSim = false;
        this.resetSim = (device: Device) => {
            shouldResetSim = true;
        }

        this.particleSimStep = ((t: number, device: Device) => {
            this.framesPassed += 4;
            t = t / 60
            const d = device as SmokeJet;
            let i = 0, j = 0;

            const positions = d.object.geometry.attributes.position.array;
            const scales = d.object.geometry.attributes.scale.array;

            const p0 = this.position[0];
            const p1 = this.position[1];
            const p2 = this.position[2];

            let startCount = 0;
            for(let n = 0; n < NUM_PARTICLES; n++) {
                if(positions[i + 1] === p1) startCount += 1;

                if(startCount > 16 && positions[i + 1] === p1){

                } else if(!this.emitParticles && positions[i + 1] === p1){

                } 
                
                else {
                    const plumeHeightSq = (p0 - positions[i]) ** 2 + (p1 - positions[i + 1]) ** 2 + (p2 - positions[i + 2]) ** 2
                    const maxHeight = this.height**2;
                    const ratio = plumeHeightSq / maxHeight; // from 0 to 1

                    positions[i] += (Math.random() - 0.5) * (0.1 + ratio * 0.3);
                    positions[i + 1] += Math.random() * 0.15 // * 0.1;
                    positions[i + 2] += (Math.random() - 0.5) * (0.1 + ratio * 0.3);


                    if((this.height**2) < plumeHeightSq){
                        positions[i] = p0;
                        positions[i + 1] = p1;
                        positions[i + 2] = p2;
                    } 

                    if(shouldResetSim){
                        positions[i] = p0;
                        positions[i + 1] = p1;
                        positions[i + 2] = p2;
                    }
                }
    
                i += 3;
                j ++;
            }

            if(shouldResetSim) {
                this.framesPassed = 0;
                shouldResetSim = false;
            }

            d.object.geometry.attributes.position.needsUpdate = true;
            d.object.geometry.attributes.scale.needsUpdate = true;
        });
        
        this.emitParticles = true;

        this.setModeOff();
    }
}