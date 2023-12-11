import { scene } from '../index';
import { Device } from './device';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { range, texture, mix, uv, color, positionLocal, timerLocal, SpriteNodeMaterial } from 'three/examples/jsm/nodes/Nodes';

const vertexShader = `
attribute float scale;
attribute float brightness;

void main() {

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

    gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
uniform vec3 dancerColor;

void main() {
    gl_FragColor = vec4(lineColor, 1.0);
}
`;

export class JigglyDancer extends Device {
    position:  number[];
    dancerColor: number[];

    constructor(position: number[], dancerColor: number[]){
        super();
        
        this.position = position;
        this.dancerColor = dancerColor;

        const geometry = new THREE.SphereGeometry(6, 128, 128);

       this.object = new THREE.Mesh(geometry,
            new THREE.ShaderMaterial({
                uniforms: {
                    dancerColor: {value: this.dancerColor},
                },
                vertexShader: vertexShader,
                fragmentShader: fragmentShader
            }));
    // sphere.receiveShadow = true;
    // sphere.castShadow = true;
    // sphere.rotation.x = - Math.PI / 4;
    // sphere.position.z = - 30;
    scene.add(this.object);

    const count: number = geometry.attributes.position.count;
    
    const position_clone = JSON.parse(JSON.stringify(geometry.attributes.position.array)) as Float32Array;
    const normals_clone = JSON.parse(JSON.stringify(geometry.attributes.normal.array)) as Float32Array;
    const damping = 0.2;

    this.setModeAuto((t: number, device: Device) => {
        if(!this.object.visible) return;
        const now = Date.now() / 200;

        // iterate all vertices
        for (let i = 0; i < count; i++) {
            // indices
            const ix = i * 3
            const iy = i * 3 + 1
            const iz = i * 3 + 2

            // use uvs to calculate wave
            const uX = geometry.attributes.uv.getX(i) * Math.PI * 16
            const uY = geometry.attributes.uv.getY(i) * Math.PI * 16

            // calculate current vertex wave height
            const xangle = (uX + now)
            const xsin = Math.sin(xangle) * damping
            const yangle = (uY + now)
            const ycos = Math.cos(yangle) * damping

            // set new position
            geometry.attributes.position.setX(i, position_clone[ix] + normals_clone[ix] * (xsin + ycos))
            geometry.attributes.position.setY(i, position_clone[iy] + normals_clone[iy] * (xsin + ycos))
            geometry.attributes.position.setZ(i, position_clone[iz] + normals_clone[iz] * (xsin + ycos))
        }
        geometry.computeVertexNormals();
        geometry.attributes.position.needsUpdate = true;
    });
        
    }
}