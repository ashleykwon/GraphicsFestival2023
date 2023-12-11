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

const fragmentShader = `
uniform float u_time;
varying vec2 vUv;

vec3 palette(float t){
    vec3 a = vec3(0.650, 0.500, 0.310);
    vec3 b = vec3(-0.650, 0.500, 0.600);
    vec3 c = vec3(0.538, 2.358, 3.028);
    vec3 d = vec3(0.758, 0.498, 0.667);
    return a + b*cos(6.28318*(c*t +d));
}

void main() {
    float angle = u_time*0.3;
    vec2 normalizedCoord = -1.0 + 2.0 *vUv *2.0 - 1.0;
    for (float i = 0.0; i < 20.0; i++){
        normalizedCoord = abs(normalizedCoord);
        normalizedCoord -= 0.5;
        normalizedCoord *= 1.1;
        normalizedCoord *= mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    } 
    gl_FragColor = 0.3*vec4(palette(length(normalizedCoord)), 1.0);

}
`;


const fragmentShaderTwo = `
uniform vec3 lineColor;
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
    vec3 finalColor = vec3(0.0);

    for (float i = 0.0; i < 3.0; i++){ // 3 is the number of fractal layers
        normalizedCoord = fract(normalizedCoord) - 0.5; // multiply normalizedCoord by a number to increase the number of circles drawn. 0.5 is subtracted to center the coordinate

        float d = length(normalizedCoord);
        vec3 screenColor = palette(length(originalUV) + i*0.4 + u_time*0.4);

        d = abs(sin(d*8.0 + u_time)/8.0); // 8 can be changed to a smaller to make less crazy visualization

        d = pow(0.005/d, 1.2); // the smaller this 0.005 becomes, the thinner the circles will be
        finalColor += screenColor * d;
    }
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`;



const fragmentShaderThree = `
uniform vec3 lineColor;
uniform float u_time;

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

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 normalizedCoord = -1.0 + 2.0 *vUv *2.0 - 1.0;
    vec2 originalUV = normalizedCoord;
    vec3 finalColor = vec3(0.0);
    int N = 12;

    float a = atan(normalizedCoord.x,normalizedCoord.y)+PI;
    float r = TWO_PI/float(N);

    float d = cos(floor(1.5+a/r)*r-a)*length(normalizedCoord) - u_time*0.2;
    if (d < 0.7){
        d = 1.0;
    }
    else{
        d = 0.0;
    }
    vec3 screenColor = palette(d + u_time);
    finalColor += screenColor * d;

    gl_FragColor = vec4(finalColor, 1.0);
}
`;


export class LaserScreen extends Device {
    position:  number[];
    lineColor: number[];
    verticalLineDensity: number;
    horizontalLineDensity: number;
    planeWidth: number;
    planeHeight: number;
    lineThickness: number;

    constructor(position: number[], lineColor: number[], verticalLineDensity: number, horizontalLineDensity: number, planeWidth: number, planeHeight: number, lineThickness: number){
        super();
        
        this.position = position;
        this.lineColor = lineColor;
        this.verticalLineDensity = verticalLineDensity;
        this.horizontalLineDensity = horizontalLineDensity;
        this.planeWidth = planeWidth;
        this.planeHeight = planeHeight;
        this.lineThickness = lineThickness;
  
        const geometry = new THREE.PlaneGeometry(this.planeWidth, this.planeHeight);
       
        const material = new THREE.ShaderMaterial({
            uniforms: {
                lineColor: {value: this.lineColor},
                verticalLineDensity: {value: this.verticalLineDensity},
                horizontalLineDensity: {value: this.horizontalLineDensity},
                planeWidth: {value: this.planeWidth},
                planeHeight: {value: this.planeHeight},
                lineThickness: {value: this.lineThickness},
                u_time: {value: 0.0}
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });

        this.object = new THREE.Mesh(geometry, material);
        // this.object.rotation.set(new THREE.Vector3( 0,  Math.PI / 2, 0));
        this.object.rotateY(Math.PI / 2);
        this.object.scale.set(4, 2, 0)
        this.object.position.set(this.position[0], this.position[1], this.position[2]);
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