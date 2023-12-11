import { scene } from '../index';
import { Device } from './device';

import * as THREE from 'three';

import { range, texture, mix, uv, color, positionLocal, timerLocal, SpriteNodeMaterial } from 'three/examples/jsm/nodes/Nodes';

const vertexShader = `
attribute float scale;
attribute float brightness;

out float particle_brightness;

void main() {

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

    gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
uniform vec3 lineColor;
uniform int verticalLineDensity;
uniform int horizontalLineDensity;
uniform int planeWidth;
uniform int planeHeight;;

void main() {
    if (gl_FragCoord.x % verticalLineDensity == 0 || gl_FragCoord.y % horizontalLineDensity == 0){
        gl_FragColor = vec4(lineColor, 1.0);
    }
    else{
        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
    }
}
`;

export class LaserScreen extends Device {
    constructor(position: number[], orientation: number[], planeWidth: number, planeHeight: number){
        super();

        const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
        const material = new THREE.MeshBasicMaterial({
            color: 0x66ff00,
            side: THREE.DoubleSide
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.position.set(position[0], position[1], position[2]);
        plane.lookAt(new THREE.Vector3(
            position[0] + orientation[0],
            position[1] + orientation[1],
            position[2] + orientation[2],
        ));

        scene.add(plane);

        this.object = plane;
    }
}