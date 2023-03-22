import * as CANNON from "cannon-es";
import Experience from "webgl/Experience.js";
import { lerp } from "three/src/math/MathUtils.js";
import fragmentShader from "./fragmentShader.frag";
import vertexShader from "./vertexShader.vert";
import { Vector3, BoxGeometry, Mesh, ShaderMaterial } from "three";
import InputManager from "utils/InputManager.js";

export default class Cube {
  constructor(_position = new Vector3(0, 2, 0)) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.physicsWorld = this.experience.physicsWorld;
    this.camera = this.experience.camera;

    this.position = _position;

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
    this.setPhysics();
    this.setControls();
  }

  setGeometry() {
    this.geometry = new BoxGeometry(1, 1, 1);
  }

  setMaterial() {
    this.material = new ShaderMaterial({
      fragmentShader,
      vertexShader,
    });
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.copy(this.position);
    // this.camera.follow(this.mesh);
    this.scene.add(this.mesh);
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

  setControls() {
    this.controls = {
      up: false,
      down: false,
      left: false,
      right: false,
      space: false,
    };
    InputManager.on("up", (value) => {
      this.controls.up = value;
    });
    InputManager.on("down", (value) => {
      this.controls.down = value;
    });
    InputManager.on("left", (value) => {
      this.controls.left = value;
    });
    InputManager.on("right", (value) => {
      this.controls.right = value;
    });
    InputManager.on("space", (value) => {
      this.controls.space = value;
    });
  }

  move() {
    if (this.controls.up) {
      this.physicsBody.velocity.z = -0.5;
    }
    if (this.controls.down) {
      this.physicsBody.velocity.z = 0.5;
    }
    if (this.controls.left) {
      this.physicsBody.velocity.x = -0.5;
    }
    if (this.controls.right) {
      this.physicsBody.velocity.x = 0.5;
    }
  }

  expand() {
    if (this.controls.space) {
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
