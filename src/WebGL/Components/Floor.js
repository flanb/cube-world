import Experience from "webgl/Experience.js";
import * as CANNON from "cannon-es";
import {
  CircleGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  RepeatWrapping,
  sRGBEncoding,
} from "three";

export default class Floor {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.setGeometry();
    // this.setTextures();
    this.setMaterial();
    this.setMesh();
    this.setPhysics();
  }

  setGeometry() {
    this.geometry = new PlaneGeometry(10, 10);
  }

  setTextures() {
    this.textures = {};

    this.textures.color = this.resources.items.grassColorTexture;
    this.textures.color.encoding = sRGBEncoding;
    this.textures.color.repeat.set(1.5, 1.5);
    this.textures.color.wrapS = RepeatWrapping;
    this.textures.color.wrapT = RepeatWrapping;

    this.textures.normal = this.resources.items.grassNormalTexture;
    this.textures.normal.repeat.set(1.5, 1.5);
    this.textures.normal.wrapS = RepeatWrapping;
    this.textures.normal.wrapT = RepeatWrapping;
  }

  setMaterial() {
    this.material = new MeshBasicMaterial({
      color: 0x00ff00,
    });
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.receiveShadow = true;
    this.mesh.name = "floor";
    this.scene.add(this.mesh);
  }

  setPhysics() {
    this.physicsShape = new CANNON.Plane();
    this.physicsBody = new CANNON.Body({
      mass: 0,
      shape: this.physicsShape,
    });
    this.physicsBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI * 0.5
    );
    this.physicsBody.position.set(0, 0, 0);
    this.experience.physicsWorld.addBody(this.physicsBody);
  }
}
