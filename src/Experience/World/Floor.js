import * as THREE from "three";
import * as CANNON from "cannon-es";
import Experience from "../Experience.js";

export default class Floor {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.physicsWorld = this.experience.physicsWorld;

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
    this.setPhysics();
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(10, 10, 1, 1);
  }

  setMaterial() {
    this.material = new THREE.MeshBasicMaterial({
      color: 0xfff,
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.scene.add(this.mesh);
  }

  setPhysics() {
    this.physicsShape = new CANNON.Plane();
    //size of the floor

    this.physicsBody = new CANNON.Body({
      mass: 0,
      shape: this.physicsShape,
      position: new CANNON.Vec3(
        this.mesh.position.x,
        this.mesh.position.y,
        this.mesh.position.z
      ),
    });
    this.physicsBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI * 0.5
    );
    this.physicsWorld.addBody(this.physicsBody);
  }

  update() {
    this.mesh.position.copy(this.physicsBody.position);
    this.mesh.quaternion.copy(this.physicsBody.quaternion);
  }
}
