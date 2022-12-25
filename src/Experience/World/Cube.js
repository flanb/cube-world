import * as THREE from "three";
import * as CANNON from "cannon-es";
import Experience from "../Experience.js";
import { lerp } from "three/src/math/MathUtils.js";

export default class Cube {
  constructor(_position = new THREE.Vector3(0, 2, 0)) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.physicsWorld = this.experience.physicsWorld;
    this.controls = this.experience.controls;
    this.camera = this.experience.camera;

    this.position = _position;

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
    this.setRaycaster();
    this.setPhysics();
  }

  setGeometry() {
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
  }

  setMaterial() {
    this.material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.copy(this.position);
    this.camera.follow(this.mesh);
    this.scene.add(this.mesh);
  }

  setRaycaster() {
    const raycaster = new THREE.Raycaster(
      this.mesh.position,
      new THREE.Vector3(0, -1, 0),
      0,
      1
    );
    this.intersects = raycaster.intersectObjects(this.scene.children);
  }

  setPhysics() {
    this.physicsShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    this.physicsBody = new CANNON.Body({
      mass: 1,
      shape: this.physicsShape,
      position: new CANNON.Vec3(
        this.mesh.position.x,
        this.mesh.position.y,
        this.mesh.position.z
      ),
      quaternion: new CANNON.Quaternion(
        this.mesh.quaternion.x,
        this.mesh.quaternion.y,
        this.mesh.quaternion.z,
        this.mesh.quaternion.w
      ),
    });
    this.physicsWorld.addBody(this.physicsBody);
  }

  move() {
    if (this.controls.keys.ArrowUp) {
      this.physicsBody.velocity.z = -0.5;
    }
    if (this.controls.keys.ArrowDown) {
      this.physicsBody.velocity.z = 0.5;
    }
    if (this.controls.keys.ArrowLeft) {
      this.physicsBody.velocity.x = -0.5;
    }
    if (this.controls.keys.ArrowRight) {
      this.physicsBody.velocity.x = 0.5;
    }
    if (this.controls.keys[" "] && this.intersects.length > 0) {
      this.physicsBody.velocity.y = 2;
    }
  }

  expand() {
    if (this.controls.keys.Shift) {
      this.mesh.scale.y = lerp(this.mesh.scale.y, 2, 0.25);
      this.physicsShape.halfExtents.y = lerp(
        this.physicsShape.halfExtents.y,
        1,
        0.25
      );
      this.physicsShape.updateConvexPolyhedronRepresentation();
      return;
    }
    this.mesh.scale.y = lerp(this.mesh.scale.y, 1, 0.25);
    this.physicsShape.halfExtents.y = lerp(
      this.physicsShape.halfExtents.y,
      0.5,
      0.25
    );
    this.physicsShape.updateConvexPolyhedronRepresentation();
  }

  update() {
    this.mesh.position.copy(this.physicsBody.position);
    this.mesh.quaternion.copy(this.physicsBody.quaternion);

    this.setRaycaster();
    this.move();
    this.expand();
  }

  destroy() {
    this.physicsWorld.removeBody(this.physicsBody);
    this.scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}
