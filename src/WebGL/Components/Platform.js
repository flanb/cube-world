import * as CANNON from "cannon-es";
import Experience from "webgl/Experience.js";
import { Vector3, BoxGeometry, Mesh, MeshBasicMaterial } from "three";

export default class Platform {
  constructor(_position = new Vector3(0, 3, 0), _scale = new Vector3(1, 1, 1)) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.physicsWorld = this.experience.physicsWorld;

    this.position = _position;
    this.scale = _scale;

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
    this.setPhysics();
  }

  setGeometry() {
    this.geometry = new BoxGeometry(this.scale.x, this.scale.y, this.scale.z);
  }

  setMaterial() {
    this.material = new MeshBasicMaterial({
      color: 0xff0000,
    });
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.copy(this.position);
    this.mesh.name = "Platform";
    this.scene.add(this.mesh);
  }

  setPhysics() {
    this.physicsShape = new CANNON.Box(
      new CANNON.Vec3(this.scale.x / 2, this.scale.y / 2, this.scale.z / 2)
    );
    this.physicsBody = new CANNON.Body({
      mass: 0,
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

  destroy() {
    this.physicsWorld.removeBody(this.physicsBody);
    this.scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}
