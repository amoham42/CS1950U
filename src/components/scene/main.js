import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { ParticleSystem, ParticleProps3D, ParticleEmitter } from './particleSystem.js';

import Stats from "stats.js";

const createGround = (scene) => {
  const ground = new THREE.PlaneGeometry(100, 100, 1, 1);
  const material = new THREE.MeshPhongMaterial({
    color: 0x586F3E,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(ground, material);
  plane.position.set(0, 0, 0);
  plane.rotation.x = Math.PI / 2;
  scene.add(plane);
};

const distanceTo = (sphere, particle) => {
  const x = sphere.x - particle.x;
  const y = sphere.y - particle.y;
  const z = sphere.z - particle.z;

  return Math.sqrt((x * x) + (y * y) + (z * z));
}

function updateParticleForces(sphere, particles, delta) {
  const spherePosition = sphere.position;
  const sphereRadius = sphere.geometry.boundingSphere.radius;
  for (const particle of particles) {
    if(!particle.active) continue;
    const particlePosition = particle.mesh.position;

    
    const distance = distanceTo(spherePosition, particlePosition);
    if (distance < sphereRadius) {
      const direction = new THREE.Vector3()
        .subVectors(particlePosition, spherePosition)
        .normalize();

      const forceStrength = (sphereRadius - distance) * 500;

      particle.force.add(direction.multiplyScalar(forceStrength * delta));
    }
  }
};

export const initializeScene = (mountRef, cameraRef, lightRef) => {
  let animationFrameId;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.3, 100);
  cameraRef.current = camera;
  camera.position.set(2.8, 0.9, 1.5);
  camera.lookAt(0, 1, 0);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  mountRef.current.appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.CineonToneMapping;
renderer.toneMappingExposure = 1;

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const handleResize = () => {
  const { innerWidth, innerHeight } = window;
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
};


document.addEventListener('mousemove', onMouseMove);

const raycaster = new THREE.Raycaster();
raycaster.far = 6
const pointer = new THREE.Vector2();

function onMouseMove( event ) {

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

const backgroundShader = {
  uniforms: {
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1) },
    iMouse: { value: new THREE.Vector2(0, 0) },
  },
  vertexShader: `
    varying vec2 fragCoord;
    void main() {
      fragCoord = uv; // Pass UV coordinates to the fragment shader
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    #define iterations 15
    #define formuparam 0.53
    #define volsteps 10
    #define stepsize 0.12
    #define zoom 0.900
    #define tile 0.350
    #define speed 0.001
    #define brightness 0.002
    #define darkmatter 0.900
    #define distfading 0.750
    #define saturation 0.850

    uniform float iTime;
    uniform vec3 iResolution;
    uniform vec2 iMouse;

    float SCurve(float value) {
      if (value < 0.5) {
        return value * value * value * value * value * 16.0; 
      }
      value -= 1.0;
      return value * value * value * value * value * 16.0 + 1.0;
    }

    void mainImage(out vec4 fragColor, in vec2 fragCoord) {
      vec2 uv = fragCoord.xy / iResolution.xy - 0.5;
      uv.y *= iResolution.y / iResolution.x;
      vec3 dir = vec3(uv * zoom, 1.0);
      float time = iTime * speed + 0.25;

      float a1 = 0.5 + iMouse.x / iResolution.x * 2.0;
      float a2 = 0.8 + iMouse.y / iResolution.y * 2.0;
      mat2 rot1 = mat2(cos(a1), sin(a1), -sin(a1), cos(a1));
      mat2 rot2 = mat2(cos(a2), sin(a2), -sin(a2), cos(a2));
      dir.xz *= rot1;
      dir.xy *= rot2;
      vec3 from = vec3(1.0, 0.5, 0.5);
      from += vec3(time * 2.0, time, -2.0);
      from.xz *= rot1;
      from.xy *= rot2;

      float s = 0.1, fade = 1.0;
      vec3 v = vec3(0.0);
      for (int r = 0; r < volsteps; r++) {
        vec3 p = from + s * dir * 0.5;
        p = abs(vec3(tile) - mod(p, vec3(tile * 2.0)));
        float pa, a = pa = 0.0;
        for (int i = 0; i < iterations; i++) {
          p = abs(p) / dot(p, p) - formuparam;
          a += abs(length(p) - pa);
          pa = length(p);
        }
        float dm = max(0.0, darkmatter - a * a * 0.001);
        a = pow(a, 2.5);
        if (r > 6) fade *= 1.0 - dm;
        v += fade;
        v += vec3(s, s * s, s * s * s * s) * a * brightness * fade;
        fade *= distfading;
        s += stepsize;
      }

      v = mix(vec3(length(v)), v, saturation);

      vec4 C = vec4(v * 0.01, 1.0);
      C.r = pow(C.r, 0.35); 
      C.g = pow(C.g, 0.36); 
      C.b = pow(C.b, 0.4); 
      vec4 L = C;   	
    
    	C.r = mix(L.r, SCurve(C.r), 1.0); 
    	C.g = mix(L.g, SCurve(C.g), 0.9); 
    	C.b = mix(L.b, SCurve(C.b), 0.6); 
      fragColor = C; 
    }

    void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `,
};

const shaderMaterial = new THREE.ShaderMaterial(backgroundShader);

const backgroundPlane = new THREE.PlaneGeometry(2, 2);
const backgroundMesh = new THREE.Mesh(backgroundPlane, shaderMaterial);
backgroundMesh.position.z = -6;
const backgroundScene = new THREE.Scene();
const backgroundCamera = new THREE.Camera();
backgroundMesh.material.depthTest = true;
backgroundMesh.material.depthWrite = false;
scene.add(backgroundMesh);


window.addEventListener("resize", handleResize);
const loader = new GLTFLoader();
const textureLoader = new TextureLoader();
const pointLight = new THREE.PointLight(0xCD6605, 20, 6, 1);
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;
pointLight.castShadow = true;
pointLight.shadow.bias = 0.0000001;
pointLight.position.set(0, 0.4, -0.1);
pointLight.shadow.radius = 25;
scene.add(pointLight);

const gradientMaps = ( function () {

  const threeTone = textureLoader.load( 'https://threejs.org/examples/textures/gradientMaps/threeTone.jpg' );
  threeTone.minFilter = THREE.NearestFilter;
  threeTone.magFilter = THREE.NearestFilter;

  const fiveTone = textureLoader.load( 'https://threejs.org/examples/textures/gradientMaps/fiveTone.jpg' );
  fiveTone.minFilter = THREE.NearestFilter;
  fiveTone.magFilter = THREE.NearestFilter;

  return {
    none: null,
    threeTone: threeTone,
    fiveTone: fiveTone
  };

} )();

loader.load(
  'sceneglb.glb',
  (gltf) => {
    gltf.scene.traverse((node) => {
      if (node.isMesh) {
        node.receiveShadow = true;
        node.castShadow = true;
        if (node.material) {
          const originalMat = node.material;
          
          if (node.name.includes('Node')) {
            node.material = new THREE.MeshToonMaterial({
              color: originalMat.color,
              map: originalMat.map,
              emissive: new THREE.Color(0x666666),
              emissiveIntensity: 0.1,
              gradientMap: gradientMaps.fiveTone,
            });
          } else {
            node.material = new THREE.MeshPhongMaterial({
              color: originalMat.color,
              map: originalMat.map,
              shininess: 20,
              emissive: new THREE.Color(0x333333),
              emissiveIntensity: 0.06,
              fog: false,
            });
            
            
            if (node.name.includes('rockFlat')) {
              node.receiveShadow = false;
              
          }

            if (originalMat.aoMap) {
              node.material.aoMap = originalMat.aoMap;
              node.material.aoMapIntensity = 1.0;
            }
          }
        }
      }
    });

    scene.add(gltf.scene);
  },
  (xhr) => {
    console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
  },
  (error) => {
    console.error('An error occurred:', error);
  }
);
//   // Add light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

 createGround(scene);

  const particleSystem = new ParticleSystem(scene, 200);
const particleSystem1 = new ParticleSystem(scene, 200);
const defaultProps = new ParticleProps3D();
const defaultProps1 = new ParticleProps3D();

defaultProps.colorA.set(1, 0.05, 0.0);
defaultProps.colorB.set(1, 0.71, 0.008);

defaultProps1.colorA.set(0.08, 0.08, 0.08);
defaultProps1.colorB.set(0.5, 0.5, 0.5);

defaultProps.size = 0.3;
defaultProps.sizeVariation = 0.2;

defaultProps1.size = 0.3;
defaultProps1.sizeVariation = 0.2;

defaultProps.sizeFade = (lifeRatio) => {
  const start = defaultProps.size;
  const end = 0.01;
  return THREE.MathUtils.lerp(end / start, 1, lifeRatio);
};

defaultProps1.sizeFade = (lifeRatio) => {
  const start = 1.5;
  const end = 0.01;
  return THREE.MathUtils.lerp(start, end, lifeRatio);
};

defaultProps.alphaFade = (lifeRatio) => lifeRatio;
defaultProps.velocity.set(0, 0.5, 0);
defaultProps.velocityVariation.set(0, 1, 0);
defaultProps.particleEmitter = new ParticleEmitter(new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.2)));
defaultProps.particleEmitter.shape.position.set(0.02, 0.4, -0.12);
defaultProps.lifeTime = 1.0;
defaultProps.particleForce = new THREE.Vector3(0, 0.2, 0);

defaultProps1.alphaFade = (lifeRatio) => lifeRatio;
defaultProps1.velocity.set(0, 0.5, 0);
defaultProps1.velocityVariation.set(0, 1, 0);
defaultProps1.particleEmitter = new ParticleEmitter(new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.2)));
defaultProps1.particleEmitter.shape.position.set(-0.03, 0.45, -0.17);
defaultProps1.lifeTime = 1.0;
defaultProps1.particleForce = new THREE.Vector3(0, 0.6, 0);
  

const sphereRadius = 0.5;
const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true, visible: false });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 5, 0);
scene.add(sphere);
  let prevTime = performance.now();

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);
    stats.begin();

    const currentTime = performance.now();
  const delta = (currentTime - prevTime) * 0.001;
  prevTime = currentTime;
    
    shaderMaterial.uniforms.iTime.value = performance.now() * 0.001;
  shaderMaterial.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight, 1);
  raycaster.setFromCamera( pointer, camera );
  const intersects = raycaster.intersectObjects(scene.children, true);
  const fIntersects = intersects.filter(intersect => intersect.distance > 2);

  if (fIntersects.length > 0) {
    const ip = fIntersects[0].point;
    sphere.position.set(ip.x, ip.y, ip.z);
  } else {
    sphere.position.set(10, 10, 5);
  }


  renderer.autoClear = false;
  renderer.clear();
  renderer.render(scene, camera);
  particleSystem.emit(defaultProps);
  particleSystem1.emit(defaultProps1);

  updateParticleForces(sphere, particleSystem.particles, delta);
  updateParticleForces(sphere, particleSystem1.particles, delta);

  particleSystem.update(delta);
  particleSystem1.update(delta);

  stats.end();
  
  };
  animate();

  const cleanup = () => {
    cancelAnimationFrame(animationFrameId);
    renderer.dispose();
    if (mountRef.current) {
      mountRef.current.removeChild(renderer.domElement);
    }
  };

  return cleanup;
};
