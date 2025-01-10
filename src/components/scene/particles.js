import * as THREE from 'three';

let scene, camera, renderer, clock;
let particleMesh, particleMaterial;
const PARTICLE_COUNT = 500;

export function init() {
  // Scene & Camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 80);
  camera.position.z = -5;

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Clock
  clock = new THREE.Clock();

  // Particles Geometry
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = new Float32Array(PARTICLE_COUNT * 3);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    // Random initial positions near bottom
    positions[i3 + 0] = (Math.random() - 0.5) * 20;
    positions[i3 + 1] = Math.random() * 5 - 25.0; // lower Y
    positions[i3 + 2] = (Math.random() - 0.5) * 20;
    // Upward velocities with slight swirl
    velocities[i3 + 0] = (Math.random() - 0.5) * 0.2;
    velocities[i3 + 1] = 1.0 + Math.random() * 0.5; // strong upward
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.2;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

  // Particle Material (Shader)
  const vertexShader = `
    attribute vec3 velocity;
    uniform float uTime;
    uniform float uDelta;
    varying float vLife;

    void main() {
      // Calculate new position
      vec3 newPos = position + velocity * uDelta * 60.0;
      
      // Fire swirl
      newPos.x += sin(uTime + position.z * 0.2) * 0.1;
      newPos.z += cos(uTime + position.x * 0.2) * 0.1;
      
      // Reset if too high (respawn)
      if (newPos.y > 25.0) {
        newPos.x = (fract(sin(dot(position.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 20.0;
        newPos.y = -25.0;
        newPos.z = (fract(sin(dot(position.yz, vec2(93.9898, 18.233))) * 43758.5453) - 0.5) * 20.0;
      }

      // Pass life factor for fade
      float range = 50.0; 
      // Map y from [-25..25] to [0..1] for color/fade
      vLife = clamp((newPos.y + 25.0) / range, 0.0, 1.0);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
      gl_PointSize = 10.0; 
    }
  `;

  const fragmentShader = `
    precision mediump float;
    varying float vLife;

    void main() {
      // Basic radial fade
      float dist = distance(gl_PointCoord, vec2(0.5));
      if (dist > 0.5) discard;

      // Fire color gradient: near bottom = red, near top = yellow
      vec3 fireColor = mix(vec3(1.0, 0.0, 0.0), // red
                           vec3(1.0, 1.0, 0.0), // yellow
                           vLife);

      // Fade edges
      float alpha = 1.0 - dist * 2.0;
      gl_FragColor = vec4(fireColor, alpha);
    }
  `;

  particleMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthTest: true,
    uniforms: {
      uTime: { value: 0 },
      uDelta: { value: 0 }
    }
  });

  // Mesh
  particleMesh = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleMesh);

  // Resize
  window.addEventListener('resize', onWindowResize);
  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  particleMaterial.uniforms.uTime.value += delta;
  particleMaterial.uniforms.uDelta.value = delta;
  renderer.render(scene, camera);
}
