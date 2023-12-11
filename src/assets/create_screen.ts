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
uniform vec3 lineColor;
uniform int verticalLineDensity;
uniform int horizontalLineDensity;
uniform int planeWidth;
uniform int planeHeight;
uniform float lineThickness;
uniform float u_time;

varying vec2 vUv;

void main() {
    float angle = u_time*0.3;
    vec2 normalizedCoord = -1.0 + 2.0 *vUv *2.0 - 1.0;
    for (float i = 0.0; i < 32.0; i++){
        normalizedCoord = abs(normalizedCoord);
        normalizedCoord -= 0.5;
        normalizedCoord *= 1.1;
        normalizedCoord *= mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    }
    gl_FragColor = vec4(length(normalizedCoord), 
    length(normalizedCoord + vec2(0.2, -0.3)), 
    length(normalizedCoord + vec2(-0.4, -0.1)), 1.0);
}
`;
// vec2 uv = vPosition;
//     gl_FragColor = vec4(0, 0, 1, 1);
//     for (int i = 0; i < verticalLineDensity; i++){
//         float currentHorizontalStartPoint = -1.0 + u_time + float(i)*1.0/float(horizontalLineDensity);
//         float currentVerticalStartPoint =  -1.0 + u_time + float(i)*1.0/float(verticalLineDensity);
//         if ((currentVerticalStartPoint < uv[0] && uv[0] < currentVerticalStartPoint + lineThickness) || (currentHorizontalStartPoint < uv[1] && uv[1] < currentHorizontalStartPoint + lineThickness)){
//             gl_FragColor = vec4(lineColor, 1);
//         }
//     }

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
        // this.object.rotation.set(new THREE.Vector3( 0, 0, Math.PI / 2));
        this.object.scale.set(2.5, 1, 0)
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