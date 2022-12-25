import Experience from "../Experience.js";
import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import * as CANNON from "cannon-es";
export default class Platforms {
  constructor(
    _platformsOptions = [
      {
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
    ]
  ) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.physicsWorld = this.experience.physicsWorld;

    this.platforms = _platformsOptions;

    this.setMaterial();
    this.setGeometry();
    this.setMesh();
    this.setPhysics();
  }

  setMaterial() {
    this.material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
    });
  }

  setGeometry() {
    const platformsGeometry = [];
    this.platforms.forEach((platform) => {
      const platformGeometry = new THREE.BoxGeometry(
        platform.scale.x,
        platform.scale.y,
        platform.scale.z
      );
      platformGeometry.translate(
        platform.position.x,
        platform.position.y,
        platform.position.z
      );
      platformsGeometry.push(platformGeometry);
    });

    this.geometry =
      BufferGeometryUtils.mergeBufferGeometries(platformsGeometry);
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  setPhysics() {
    this.platforms.forEach((platform) => {
      const platformPhysicsShape = new CANNON.Box(
        new CANNON.Vec3(
          platform.scale.x * 0.5,
          platform.scale.y * 0.5,
          platform.scale.z * 0.5
        )
      );
      const platformPhysicsBody = new CANNON.Body({
        mass: 0,
        shape: platformPhysicsShape,
        position: new CANNON.Vec3(
          platform.position.x,
          platform.position.y,
          platform.position.z
        ),
      });
      this.physicsWorld.addBody(platformPhysicsBody);
    });
  }
}
