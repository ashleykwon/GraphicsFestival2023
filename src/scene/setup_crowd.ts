import * as THREE from "three";
import { load_object } from "../util/object_loader";
import { scene } from "../index";
import { InstancedUniformsMesh } from 'three-instanced-uniforms-mesh'

export let crowd : InstancedUniformsMesh<THREE.MeshStandardMaterial>[] = [];

export const setupCrowd = () => {
    const mat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0,
        flatShading: false,
    });

    load_object(
        '/assets/blob.obj', 
        (object: THREE.Object3D) => {
            let bb = new THREE.Box3().setFromObject(object);
            let size = bb.getSize(new THREE.Vector3());
            let factor = 2 / size.x; 

            console.log(mat)

            const mesh1 = new InstancedUniformsMesh((object.children[0] as THREE.Mesh).geometry, mat, 350);
            mesh1.scale.set(factor, factor, factor)
            mesh1.rotateY(Math.PI);
            crowd.push(mesh1);
            mesh1.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
            scene.add(mesh1);

            const mesh2 = new InstancedUniformsMesh((object.children[0] as THREE.Mesh).geometry, mat, 350);
            mesh2.scale.set(factor, factor, factor)
            mesh2.rotateY(Math.PI);
            crowd.push(mesh2);
            mesh2.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
            scene.add(mesh2);
        },
        mat, false
    );

    load_object(
        '/assets/blob.obj', 
        (object: THREE.Object3D) => {
            let bb = new THREE.Box3().setFromObject(object);
            let size = bb.getSize(new THREE.Vector3());
            let factor = 2 / size.x; 
            object.scale.set(factor, factor, factor)

            object.position.set(-12, 10, 0)
        },
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.5,
            flatShading: false,
        })
    );
}