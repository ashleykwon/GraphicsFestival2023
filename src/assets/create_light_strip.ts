import * as THREE from "three";
import { Device } from "./device";
import { scene } from "../index";

import { MeshLine, MeshLineMaterial, MeshLineRaycast } from './meshline';

export class LightStrip extends Device {
    constructor(color: number, start: number[], end: number[]){
        super();

        
        const points = [];
        points.push(new THREE.Vector3(start[0], start[1], start[2]));
        points.push(new THREE.Vector3(end[0], end[1], end[2]));
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        const line = new MeshLine();
        line.setGeometry(geometry);

        const material = new MeshLineMaterial({
            color: color,
            resolution: new THREE.Vector2(800, 600),
            lineWidth: 0.5,
            dashArray: 0.3,
            dashRatio: 0.5
        });

        // @ts-ignore
        const mesh = new THREE.Mesh(line, material);
        scene.add(mesh);

        this.object = mesh;
    }
}