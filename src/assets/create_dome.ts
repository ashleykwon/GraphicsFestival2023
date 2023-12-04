import { scene } from '../index';
import { Device } from './device';

import * as THREE from 'three';


const vertexShader = `
attribute float scale;

void main() {

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

    gl_PointSize = scale * ( 300.0 / - mvPosition.z );

    gl_Position = projectionMatrix * mvPosition;

}
`;

const fragmentShader = `
uniform vec3 color;

void main() {

    if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;

    gl_FragColor = vec4( color, 1.0 );

}
`;

export class Dome extends Device {
    // particles: THREE.Points<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.ShaderMaterial>;
    constructor(){
        super();

        const SEPARATION = 10, AMOUNTX = 50 * 1.6, AMOUNTY = 50 * 1.6;
        const numParticles = AMOUNTX * AMOUNTY;
        const positions = new Float32Array(numParticles * 3);
        const scales = new Float32Array(numParticles);

        let i = 0, j = 0;
        for(let ix = 0; ix < AMOUNTX; ix ++) {
            for(let iy = 0; iy < AMOUNTY; iy++) {
                positions[i] = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2); 
                positions[i + 1] = 0;
                positions[i + 2] = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2); 
                scales[j] = 1;
                i += 3;
                j ++;
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: {value: new THREE.Color(0xffffff)},
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });

        this.object = new THREE.Points(geometry, material);
        scene.add(this.object);

        this.setModeAuto((t: number, device: Device) => {
            t = t / 60
            const d = device as Dome;
            let i = 0, j = 0;

            const positions = d.object.geometry.attributes.position.array;
            const scales = d.object.geometry.attributes.scale.array;

            for (let ix = 0; ix < AMOUNTX; ix ++) {
                for (let iy = 0; iy < AMOUNTY; iy ++) {
                    positions[i + 1] = 
                        (Math.sin((ix + t) * 0.3) + Math.sin((iy + t) * 0.5)) * 5
                        - ((ix - AMOUNTX/2)**2 + (iy - AMOUNTY/2)**2) * 0.2
                        + 200;

                    scales[j] = ((Math.sin((ix + t) * 0.3) + 1) * 20 +
                                    (Math.sin((iy + t) * 0.5) + 1) * 20) / 20;

                    i += 3;
                    j++;
                }
            }

            d.object.geometry.attributes.position.needsUpdate = true;
            d.object.geometry.attributes.scale.needsUpdate = true;
        });
    }
}