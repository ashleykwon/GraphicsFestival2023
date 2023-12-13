import * as THREE from "three";
import { camera, controls, scene } from "../index";

import { MeshLine, MeshLineMaterial, MeshLineRaycast } from '../assets/meshline';
import { Device } from "../assets/device";

type CameraCurve = {
    points: number[][],
    lookAt: number[]
}

export const cameraCurveDevices: CameraCurveDevice[] = [];

export class CameraCurveDevice extends Device {
    points: number[][];
    lookAt: number[];
    curve: THREE.CatmullRomCurve3;
    active: boolean;

    constructor(points: number[][], lookAt: number[]){
        super();

        this.points = points;
        this.lookAt = lookAt;
        this.active = false;

        const three_pts = points.map(pt => new THREE.Vector3(pt[0], pt[1], pt[2]));
        this.curve = new THREE.CatmullRomCurve3(three_pts);
        
        const calculated_points = this.curve.getPoints( 50 );
        const geometry = new THREE.BufferGeometry().setFromPoints( calculated_points );
        
        const line = new MeshLine();
        line.setGeometry(geometry);

        const material = new MeshLineMaterial({
            color: 0xff0000,
            resolution: new THREE.Vector2(800, 600),
            lineWidth: 0.1,
            dashArray: 0.3,
            dashRatio: 0.5
        });

        // @ts-ignore
        const mesh = new THREE.Mesh(line, material);
        // scene.add(mesh);
        this.object = mesh;
    }
}

export const setupCameraCurves = () => {
    const curves: CameraCurve[] = [
        { // 0 = front to back
            lookAt: [0, 10, 0],
            points: [[100, 5, 0], [250, 5, 0]],
        },
        { // 1 = back to front
            lookAt: [0, 10, 0],
            points: [[100, 5, 0], [60, 5, 0]],
        },
        { // 2 = lower outer arc, left to right
            lookAt: [0, 10, 0],
            points:  [[60, 10, 90], [110, 10, 30], [110, 10, -30], [60, 10, -90]],
        },
        { // 3 = top inner arc, left to right 
            lookAt: [0, 10, 0],
            points: [[40, 40, 60], [80, 40, 20], [80, 40, -20], [40, 40, -60]],
        },
        { // 4 = left side loop
            lookAt: [0, 10, 0],
            points: [[0, 2, 60], [30, 40, 50], [50, 50, 20],  [30, 10, 60]],
        },
        { // 5 = right side loop
            lookAt: [0, 10, 0],
            points: [[20, 10, -50], [40, 10, -60], [50, 10, -20],  [30, 20, -10]],
        },

        { // 6 = lower outer arc, right to left
            lookAt: [0, 10, 0],
            points:  [[50, 10, 90], [90, 10, 30], [90, 10, -30], [50, 10, -90]].reverse(),
        },
        { // 7 = top inner arc, right to left 
            lookAt: [0, 10, 0],
            points: [[40, 40, 60], [80, 40, 20], [80, 40, -20], [40, 40, -60]].reverse(),
        },
        { // 8 = top right to center
            lookAt: [0, 10, 0],
            points: [[40, 40, -60], [50, 20, -40], [60, 10, 0]],
        },

        { // 9 = lower inner arc, left to right
            lookAt: [0, 10, 0],
            points:  [[40, 10, 60], [80, 10, 30], [80, 10, -30], [40, 10, -60]],
        },

        { // 10 = right side loop
            lookAt: [0, 10, 0],
            points: [[20, 10, -50], [40, 10, -60], [50, 10, -20],  [30, 20, -10]].reverse(),
        },
    ];

    for(let curve of curves){
        const newDevice = new CameraCurveDevice(curve.points, curve.lookAt);
        cameraCurveDevices.push(newDevice);
    }
}

export const moveCameraAlongCurve = (curve_id: number, duration: number) => {
    cameraCurveDevices.forEach(cd => cd.active = false);
    let startTime = 0;
    
    let l = cameraCurveDevices[curve_id].lookAt;
    let lv = new THREE.Vector3(l[0], l[1], l[2]);
    camera.lookAt(lv)
    controls.target = lv;
    controls.update();

    cameraCurveDevices[curve_id].setModePlay((tms, device) => {
        const cameraCurve = device as CameraCurveDevice;
        if(startTime == 0) startTime = tms;

        let alpha = (tms - startTime) / duration;
        if(alpha > 1) alpha = 1;
        console.log(cameraCurve.curve, alpha);
        let point = cameraCurve.curve.getPointAt(alpha);
        camera.position.set(point.x, point.y + 0.1, point.z);
    }, () => {}, duration);
}