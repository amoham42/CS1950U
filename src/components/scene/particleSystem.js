import * as THREE from 'three';
import { Noise } from 'noisejs';

var noise = new Noise();

function normalize(v) {
    const length = Math.hypot(v[0], v[1], v[2]) || 1e-8;
    return [v[0] / length, v[1] / length, v[2] / length];
  }
  
  function cross(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];
  }


export class ParticleEmitter {
    constructor(shape, size) {
        this.shape = shape;
        this.size = size;
    }

    getRandomPoint() {
        const randHeight = THREE.MathUtils.randFloat(0, this.shape.geometry.parameters.height);
const ratio = (this.shape.geometry.parameters.radius / this.shape.geometry.parameters.height) * randHeight;
const r = ratio * Math.sqrt(THREE.MathUtils.randFloat(0, 1));
const theta = THREE.MathUtils.randFloat(0, 1) * 2 * Math.PI;

const x = this.shape.position.x + r * Math.cos(theta);
const y = this.shape.position.y + randHeight * -1;   // if you want negative
const z = this.shape.position.z + r * Math.sin(theta);

return new THREE.Vector3(x, y, z);
    }
};

class ParticleNoise {
    constructor(type, scale, variation, randomnessScale, randomnessRotation, randomnessMass) {
        this.type = type;
        this.scale = scale;
        this.variation = variation;

        this.randomnessScale = randomnessScale;
        this.randomnessRotation = randomnessRotation;
        this.randomnessMass = randomnessMass;
    }

    computeCurl(x, y, z){

        var eps = 1e-4;
      
        //Find rate of change in X
        var n1 = noise.simplex3(x + eps, y, z); 
        var n2 = noise.simplex3(x - eps, y, z); 
        var a = (n1 - n2)/(2 * eps);
      
        //Find rate of change in Y
        n1 = noise.simplex3(x, y + eps, z); 
        n2 = noise.simplex3(x, y - eps, z); 
        var b = (n1 - n2)/(2 * eps);
      
        //Find rate of change in Z
        n1 = noise.simplex3(x, y, z + eps); 
        n2 = noise.simplex3(x, y, z - eps); 
        var c = (n1 - n2)/(2 * eps);
      
        var noiseGrad0 = [a, b, c];
      
        x += 10000.5;
        y += 10000.5;
        z += 10000.5;
      
        //Find rate of change in X
        n1 = noise.simplex3(x + eps, y, z); 
        n2 = noise.simplex3(x - eps, y, z); 
        a = (n1 - n2)/(2 * eps);
      
        //Find rate of change in Y
        n1 = noise.simplex3(x, y + eps, z); 
        n2 = noise.simplex3(x, y - eps, z); 
        b = (n1 - n2)/(2 * eps);
      
        //Find rate of change in Z
        n1 = noise.simplex3(x, y, z + eps); 
        n2 = noise.simplex3(x, y, z - eps); 
        c = (n1 - n2)/(2 * eps);
      
        var noiseGrad1 = [a, b, c];
      
        noiseGrad1 = normalize(noiseGrad1);
        noiseGrad1 = normalize(noiseGrad1);
        var curl = cross(noiseGrad0, noiseGrad1);
      
        return normalize(curl);
      }
}

export class ParticleProps3D {
    constructor() {
        this.position = new THREE.Vector3(1, 0, 1);
        this.rotation = new THREE.Vector3(0, 0, 0);
        this.colorA = new THREE.Color();
        this.colorB = new THREE.Color();
        this.size = 16;
        this.birthRate = 50;
        this.lifeTime = 1.0;
        this.alphaFade = null;
        this.sizeFade = null;
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.particleEmitter = new ParticleEmitter(
            new THREE.Mesh(new THREE.PlaneGeometry(1, 1)),  
            new THREE.Vector3(1, 1, 1)
        );

        this.particleForce = new THREE.Vector3(0, 0, 0);
        this.particleNoise = new ParticleNoise(null, 1, 1, 1, 0, 0);

        this.velocityVariation = new THREE.Vector3(0, 0, 0);
        this.sizeVariation = 0.5;
        
        this.image = new THREE.Sprite(
            new THREE.SpriteMaterial(
                {
                    map: new THREE.TextureLoader().load('pt_dust.png'),
                    color: 0xffffff,
                }
            )
        );
    }
}

class Particle3D {
    constructor() {
      this.active = false;
      this.age = 0;
      this.lifeTime = 1.0;
  
      this.velocity = new THREE.Vector3();
      this.force = new THREE.Vector3();
      this.noise = null;
  
      this.colorA = new THREE.Color();
      this.colorB = new THREE.Color();
  
      this.size = 1;
      this.alphaFade = null;
      this.sizeFade = null;
      this.rotationSpeed = new THREE.Vector3();
      this.mesh = null; 
    }
  }

export class ParticleSystem {
    constructor(scene, poolSize = 200) {
        this.scene = scene;
        this.poolSize = poolSize;
        this.poolIndex = poolSize - 1;
        this.particles = new Array(poolSize);
        this.time = new Date();
        for (let i = 0; i < poolSize; i++) {
            this.particles[i] = new Particle3D();
        }

        try {
          noise.seed(Math.random());
        }
        catch(err) {
          console.log(err.message);
        }
    }

    emit(props3D) {
        const particle = this.particles[this.poolIndex];
        particle.active = true;
        particle.age = 0;
        particle.lifeTime = props3D.lifeTime;
    
        particle.colorA.copy(props3D.colorA);
        particle.colorB.copy(props3D.colorB);
    
        particle.size = props3D.size + props3D.sizeVariation * (Math.random() - 0.5);
    
        particle.velocity.copy(props3D.velocity);
        particle.velocity.x += props3D.velocityVariation.x * (Math.random() - 0.5);
        particle.velocity.y += props3D.velocityVariation.y * (Math.random() - 0.5);
        particle.velocity.z += props3D.velocityVariation.z * (Math.random() - 0.5);
    
        particle.force.copy(props3D.particleForce);
        particle.noise = props3D.particleNoise;
        particle.alphaFade = props3D.alphaFade; 
        particle.sizeFade = props3D.sizeFade; 
        particle.rotationSpeed.copy(props3D.rotation);

        particle.mesh = new THREE.Sprite(props3D.image.material.clone());
        particle.mesh.position.copy(props3D.particleEmitter.getRandomPoint());
        particle.mesh.material.color.copy(particle.colorA);
        particle.mesh.material.opacity = 1.0;
        particle.mesh.scale.set(particle.size);
        particle.mesh.visible = true;
        
        this.scene.add(particle.mesh);
        this.poolIndex = (this.poolIndex - 1 + this.poolSize) % this.poolSize;
      }
    
      update(delta) {
        for (const p of this.particles) {
          if (!p.active) continue;

          p.age += delta;
          if (p.age >= p.lifeTime) {
            p.active = false;
            this.scene.remove(p.mesh);
            p.mesh.visible = false;
            continue;
          }
    
          const lifeRatio = 1.0 - p.age / p.lifeTime;
          p.velocity.addScaledVector(p.force, delta);
          if (p.noise) {
       
            const variationFactor = 1 + p.noise.variation * (Math.random() - 0.5);
            let massFactor = 1 + p.noise.randomnessMass * (Math.random() - 0.5);
            if (massFactor < 0.1) massFactor = 0.1;

            const curlVecArr = p.noise.computeCurl(
            p.mesh.position.x * p.noise.scale,
            p.mesh.position.y * p.noise.scale,
            p.mesh.position.z * p.noise.scale
            );

            const curlVec = new THREE.Vector3(curlVecArr[0], curlVecArr[1], curlVecArr[2]);
            curlVec.multiplyScalar(p.noise.randomnessScale * variationFactor);
            p.velocity.addScaledVector(curlVec, delta / massFactor);
            p.mesh.material.rotation += p.noise.randomnessRotation * delta * variationFactor;
          }

          p.mesh.position.addScaledVector(p.velocity, delta);

          p.mesh.material.color.r = p.colorB.r + (p.colorA.r - p.colorB.r) * lifeRatio;
          p.mesh.material.color.g = p.colorB.g + (p.colorA.g - p.colorB.g) * lifeRatio;
          p.mesh.material.color.b = p.colorB.b + (p.colorA.b - p.colorB.b) * lifeRatio;
    
          if (p.alphaFade) {
            p.mesh.material.opacity = p.alphaFade(lifeRatio);
          } else {
            p.mesh.material.opacity = lifeRatio;
          }
    
          let finalSize = p.size;
          if (p.sizeFade) {
            finalSize *= p.sizeFade(lifeRatio);
          } else {
            finalSize *= lifeRatio;
          }
          p.mesh.scale.set(finalSize, finalSize, finalSize);
          p.mesh.material.rotation += p.rotationSpeed.z * delta;
        }
      }
}