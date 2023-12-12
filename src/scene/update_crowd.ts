import * as THREE from "three";
import { crowd } from "./setup_crowd";
import { BPM } from "../index";

export enum CrowdMode {
    SWAY,
    BOP,
    JUMP
}

let crowdMode = CrowdMode.SWAY; // bop, jump
const randArray = new Array(1000).fill(0).map(() => Math.random());

export const setCrowdState = (mode: CrowdMode) => {
    crowdMode = mode;
}

export const updateCrowd = (t: number, firstRun: boolean, setFirstRunFalse: () => void) => {
    const crowd1 = crowd[0];
    const crowd2 = crowd[1];
    if(crowd1 && crowd2){
        const dummy1 = new THREE.Object3D();
        const dummy2 = new THREE.Object3D();

        const time = Date.now() * 0.001;
    
        let i = 0, j = 0;
        const offset1 = [-20, 0, -55];
        const offset2 = [-20, 0, 190];
        const spacing = 10;

        if(firstRun){
            for (let x = 0; x < 20; x ++) {
                for (let y = 0; y < 15; y ++) {
                    crowd1.setUniformAt('diffuse', i, new THREE.Color(0xffffff * Math.random() | 0))
                    crowd2.setUniformAt('diffuse', j, new THREE.Color(0xffffff * Math.random() | 0))
                    // crowd1.setUniformAt('emissive', i, new THREE.Color(0xffffff * Math.random() | 0))
                    // crowd2.setUniformAt('emissive', j, new THREE.Color(0xffffff * Math.random() | 0))
                    i++; j++;
                }
            }
            setFirstRunFalse();
        }
    
        i = 0, j = 0;
        for (let x = 0; x < 20; x ++) {
            for (let y = 0; y < 15; y ++) {
                // const z1 = Math.sin(t / 30 + 10 * Math.PI / 180 * randArray[i]) ** (20);
                // const z2 = Math.sin(t / 30 + 10 * Math.PI / 180 * randArray[j]) ** (20);
                
                let z1 = 0, z2 = 0;
                if(crowdMode == CrowdMode.SWAY){
                    const jumpRate = BPM * 0.5;
                    const offset = randArray[i] < 0.5 ? 0 : 0.5;
                    z1 = Math.abs(Math.cos((t + offset)*Math.PI * jumpRate / 60   + 40 * Math.PI / 180 * randArray[i]) ** (2));
                    z2 = Math.abs(Math.cos((t + offset)*Math.PI * jumpRate / 60   + 40 * Math.PI / 180 * randArray[j]) ** (2));
                } else if(crowdMode == CrowdMode.BOP){
                    const jumpRate = BPM;
                    z1 = 2 * Math.abs(Math.cos(t*Math.PI * jumpRate / 60   + 30 * Math.PI / 180 * randArray[i]) ** (3));
                    z2 = 2 * Math.abs(Math.cos(t*Math.PI * jumpRate / 60   + 30 * Math.PI / 180 * randArray[j]) ** (3));
                } else if(crowdMode == CrowdMode.JUMP){
                    const jumpRate = BPM;
                    z1 = (3 + 2 * randArray[i + 4]) * Math.abs(Math.cos(t*Math.PI * jumpRate / 60   + 30 * Math.PI / 180 * randArray[i]) ** (6));
                    z2 = (3 + 2 * randArray[j + 3]) * Math.abs(Math.cos(t*Math.PI * jumpRate / 60   + 30 * Math.PI / 180 * randArray[j]) ** (6));
                }

                let scale1 = 1 + (randArray[i] * 0.5);
                dummy1.scale.set(scale1, scale1, scale1);
                dummy1.position.set(
                    offset1[0] - x * spacing + spacing * 0.5 * randArray[i - 3],
                    offset1[1] + z1, 
                    offset1[2] - y * spacing + spacing * 0.5 * randArray[i + 3]
                );
                dummy1.updateMatrix();
                crowd1.setMatrixAt(i++, dummy1.matrix);

                let scale2 = 1 + (randArray[j] * 0.5);
                dummy2.scale.set(scale2, scale2, scale2);
                dummy2.position.set(
                    offset2[0] - x * spacing + spacing * 0.5 * randArray[j - 3],
                    offset2[1] + z2, 
                    offset2[2] - y * spacing + spacing * 0.5 * randArray[j + 3]
                );
                dummy2.updateMatrix();
                crowd2.setMatrixAt(j++, dummy2.matrix);
            }
        }
    
        crowd1.instanceMatrix.needsUpdate = true;
        crowd2.instanceMatrix.needsUpdate = true;
    }
}