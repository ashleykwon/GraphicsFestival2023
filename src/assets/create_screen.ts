import { scene, scene2, scene3 } from '../index';
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

const fragmentShaderBlack = `
uniform float u_time;
uniform float planeWidth;
uniform float planeHeight;
varying vec2 vUv;

void main() {
    vec2 uv = vUv - vec2(0., 0.5);
    uv.x *= planeWidth / planeHeight;
    
    uv *= mat2(.707, -.707, .707, .707);
    uv *= 4.;
    
    vec2 gv = fract(uv)-.5; 
	vec2 id = floor(uv);
    
	float m = 0.;
    float mb = 0.1;
    float mg = 0.05;
    float t;
    for(float y=-1.; y<=1.; y++) {
    	for(float x=-1.; x<=1.; x++) {
            vec2 offs = vec2(x, y);
            
            t = -u_time+length(id-offs)*.2;
            float r = mix(.4, 1.5, sin(t)*.5+.5);
    		float c = smoothstep(r, r*.9, length(gv+offs));
            
    		m = m*(1.-c) + c*(1.-m);
            mb = mb*(1.1-c) + c*(1.-m);
            mg = mg*(0.9-m) + c*(0.9-c) + 0.9;
        }
    }
    float inv_utime = 1.f - u_time * 0.5;
    if(inv_utime < 0.f){
        inv_utime = 0.f;
    }
    gl_FragColor = clamp(vec4(m, mg, mb, 1.0) * inv_utime, 0.0, 1.0);
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
uniform float planeWidth;
uniform float planeHeight;

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

    normalizedCoord[0] *= planeWidth / planeHeight;
    vec3 finalColor = vec3(0.0);

    for (float i = 0.0; i < 3.0; i++){ // 3 is the number of fractal layers
        normalizedCoord = fract(normalizedCoord) - 0.5; // multiply normalizedCoord by a number to increase the number of circles drawn. 0.5 is subtracted to center the coordinate

        float d = length(normalizedCoord);
        vec3 screenColor = palette(length(originalUV) + i*0.4 + u_time*0.4);

        d = abs(sin(d*8.0 + u_time)/8.0); // 8 can be changed to a smaller to make less crazy visualization

        d = pow(0.005/d, 1.2); // the smaller this 0.005 becomes, the thinner the circles will be
        finalColor += screenColor * d;
    }
    
    gl_FragColor = clamp(0.9*vec4(finalColor, 1.0), 0.0, 50.0);
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


const fragmentShaderV2 = `
uniform float u_time;
uniform float planeWidth;
uniform float planeHeight;
varying vec2 vUv;

void main() {
    vec2 uv = vUv - vec2(0., 0.5);
    uv.x *= planeWidth / planeHeight;

    float r = mod(uv.x * sin(u_time * 1.7) + uv.y * cos(u_time * 0.9), 0.5f) / 0.5f;
    float g = mod(uv.x * cos(u_time * 0.8) + uv.y * cos(u_time * 2.7), 0.8f) / 0.8f;
    float b = mod(uv.x * cos(u_time * 1.3) + uv.y * sin(u_time * 1.1), 0.3f) / 0.3f;

    gl_FragColor = clamp(1.0 - vec4(pow(r, 0.6), pow(g, 0.9), pow(b, 0.3), 0.0), 0.0, 1.0);
}`;

// https://www.shadertoy.com/view/wdlGRM
const fragmentShaderV3 = `
uniform float u_time;
uniform float planeWidth;
uniform float planeHeight;
varying vec2 vUv;

void main() {
    vec2 uv = vUv - vec2(0., 0.5);
    uv.x *= planeWidth / planeHeight;
    
    uv *= mat2(.707, -.707, .707, .707);
    uv *= 4.;
    
    vec2 gv = fract(uv)-.5; 
	vec2 id = floor(uv);
    
	float m = 0.;
    float mb = 0.1;
    float mg = 0.05;
    float t;
    for(float y=-1.; y<=1.; y++) {
    	for(float x=-1.; x<=1.; x++) {
            vec2 offs = vec2(x, y);
            
            t = -u_time+length(id-offs)*.2;
            float r = mix(.4, 1.5, sin(t)*.5+.5);
    		float c = smoothstep(r, r*.9, length(gv+offs));
            
    		m = m*(1.-c) + c*(1.-m);
            mb = mb*(1.1-c) + c*(1.-m);
            mg = mg*(0.9-m) + c*(0.9-c) + 0.9;
        }
    }

    gl_FragColor = clamp(vec4(m, mg, mb, 1.0), 0.0, 1.0) * 0.5;
}
`;

const fragmentShaderV1 = `
uniform float u_time;
varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    vec3 col = 0.5 + 0.5*cos(u_time+uv.xyx+vec3(0,2,4));
    gl_FragColor = vec4(col, 1.0);
}
`;

export class LaserScreen extends Device {
    position:  number[];
    planeWidth: number;
    planeHeight: number;
    fragShaderID: number;
    material: THREE.ShaderMaterial;

    constructor(position: number[], orientation: number[], planeWidth: number, planeHeight: number, fragShaderID: number){
        super();
        
        this.position = position;
        this.planeWidth = planeWidth;
        this.planeHeight = planeHeight;
        this.fragShaderID = fragShaderID;
        

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
        this.material = material;
        
        // material.needsUpdate=true;
        // this.object.material.attributes.fragmentShader.needsUpdate = true;
        if (fragShaderID == 1){
            material.fragmentShader = fragmentShaderSolid;
        }
        if (fragShaderID == 2){
            material.fragmentShader = fragmentShaderRandomColors;
        }
        if (fragShaderID == 3){
            material.fragmentShader = fragmentShaderSparkle;
        }

        else if(fragShaderID == 4){
            material.fragmentShader = fragmentShaderV1;
        }

        else if(fragShaderID == 5){
            material.fragmentShader = fragmentShaderV2;
        }

        else if(fragShaderID == 6){
            material.fragmentShader = fragmentShaderV3;
        }

        this.object = new THREE.Mesh(geometry, material);
        this.object.position.set(this.position[0], this.position[1], this.position[2]);
        this.object.lookAt(new THREE.Vector3(
            position[0] + orientation[0],
            position[1] + orientation[1],
            position[2] + orientation[2],
        ));
        this.object.material = material;
        this.object.material.needsUpdate = true;
        scene3.add(this.object);
    
        this.setModeAuto((t: number, device: Device) => {
            if(!this.object.visible) return;
            const d = device as LaserScreen;
            // if (d.object.material.uniforms.u_time.value >= 2.0){
            //    d.object.material.uniforms.u_time.value = 0;
            // }
            d.object.material.uniforms.u_time.value += 0.01;
        });
    }
    
    changeProgram(id: number){
        this.fragShaderID = id;

        if(this.fragShaderID == 0){
            this.material.fragmentShader = fragmentShaderBlack;
        }

        if(this.fragShaderID == 1){
            this.material.fragmentShader = fragmentShaderSolid;
        }

        else if(this.fragShaderID == 2){
            this.material.fragmentShader = fragmentShaderRandomColors;
        }
        
        else if(this.fragShaderID == 3){
            this.material.fragmentShader = fragmentShaderSparkle;
        }

        else if(this.fragShaderID == 4){
            this.material.fragmentShader = fragmentShaderV1;
        }

        else if(this.fragShaderID == 5){
            this.material.fragmentShader = fragmentShaderV2;
        }

        else if(this.fragShaderID == 6){
            this.material.fragmentShader = fragmentShaderV3;
        }

        this.material.needsUpdate = true;
    }
}