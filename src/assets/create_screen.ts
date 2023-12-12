import { scene } from '../index';
import { Device } from './device';

import * as THREE from 'three';

import { range, texture, mix, uv, color, positionLocal, timerLocal, SpriteNodeMaterial } from 'three/examples/jsm/nodes/Nodes';

const vertexShader = `
attribute float scale;
attribute float brightness;
out vec2 vPosition;
varying vec2 vUv;

void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

    gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShaderSolid = `
uniform float u_time;
varying vec2 vUv;

vec3 palette(float t){
    vec3 a = vec3(0.358, -0.042, 0.358);
    vec3 b = vec3(0.500, -0.882, 0.500);
    vec3 c = vec3(0.188, 0.008, 0.588);
    vec3 d = vec3(0.000, 0.333, 0.667);
    return a + b*cos(6.28318*(c*t +d));
}


void main() {
   
    gl_FragColor = vec4(palette(u_time), 1.0); // adjust this 0.3 here to reduce brightness

}
`;


const fragmentShaderSparkle = `
uniform float u_time;

varying vec2 vUv;

vec3 palette(float t){
    vec3 a = vec3(0.358, -0.042, 0.358);
    vec3 b = vec3(0.500, -0.882, 0.500);
    vec3 c = vec3(0.188, 0.008, 0.588);
    vec3 d = vec3(0.000, 0.333, 0.667);
    return a + b*cos(6.28318*(c*t +d));
}

void main() {
    float angle = u_time*0.3;
    vec2 normalizedCoord = -1.0 + 2.0 *vUv *2.0 - 1.0; // -1 to 1
    vec2 originalUV = normalizedCoord;
    normalizedCoord[1] /= 2.0;
    vec3 finalColor = vec3(0.0);

    for (float i = 0.0; i < 3.0; i++){ // 3 is the number of fractal layers
        normalizedCoord = fract(normalizedCoord) - 0.5; // multiply normalizedCoord by a number to increase the number of circles drawn. 0.5 is subtracted to center the coordinate

        float d = length(normalizedCoord);
        vec3 screenColor = palette(length(originalUV) + i*0.4 + u_time*0.4);

        d = abs(sin(d*8.0 + u_time)/8.0); // 8 can be changed to a smaller to make less crazy visualization

        d = pow(0.005/d, 1.2); // the smaller this 0.005 becomes, the thinner the circles will be
        finalColor += screenColor * d;
    }
    
    gl_FragColor = 0.3*vec4(finalColor, 1.0);
}
`;



const fragmentShaderRandomColors = `
uniform vec3 lineColor;
uniform float u_time;
uniform int patternID;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

varying vec2 vUv;

vec3 palette(float t){
    vec3 a = vec3(0.358, -0.042, 0.358);
    vec3 b = vec3(0.500, -0.882, 0.500);
    vec3 c = vec3(0.188, 0.008, 0.588);
    vec3 d = vec3(0.000, 0.333, 0.667);
    return a + b*cos(6.28318*(c*t +d));
}

void main() {
    if (patternID == 0){
        gl_FragColor = vec4(palette(u_time), 1.0);
    }
    else if (patternID == 1){
        gl_FragColor = vec4(palette(u_time + 0.5), 1.0);
    }
    else{
        gl_FragColor = vec4(palette(u_time - 0.5), 1.0);
    }
}
`;


export class LaserScreen extends Device {
    position:  number[];
    planeWidth: number;
    planeHeight: number;

    constructor(position: number[], orientation: number[], planeWidth: number, planeHeight: number){
        super();
        
        this.position = position;
        this.planeWidth = planeWidth;
        this.planeHeight = planeHeight;
        
  
        const geometry = new THREE.PlaneGeometry(this.planeWidth, this.planeHeight);
       
        const material = new THREE.ShaderMaterial({
            uniforms: {
                planeWidth: {value: this.planeWidth},
                planeHeight: {value: this.planeHeight},
                u_time: {value: 0.0},
                patternID : {value: Math.random()*(2-0)+0}
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShaderRandomColors
        });

        this.object = new THREE.Mesh(geometry, material);
        this.object.position.set(this.position[0], this.position[1], this.position[2]);
        this.object.lookAt(new THREE.Vector3(
            position[0] + orientation[0],
            position[1] + orientation[1],
            position[2] + orientation[2],
        ));
        scene.add(this.object);

        this.setModeAuto((t: number, device: Device) => {
            if(!this.object.visible) return;
            const d = device as LaserScreen;
            if (d.object.material.uniforms.u_time.value >= 2.0){
                d.object.material.uniforms.u_time.value = 0;
            }
            d.object.material.uniforms.u_time.value += 0.01;
        });

        
    }
}