import * as CANNON from 'cannon-es'
import Experience from 'webgl/Experience.js'
import { lerp } from 'three/src/math/MathUtils.js'
import { Vector3, BoxGeometry, Mesh, MeshBasicMaterial } from 'three'
import InputManager from 'utils/InputManager.js'

export default class Cube {
	constructor(_position = new Vector3(0, 2, 0)) {
		this.experience = new Experience()
		this.scene = this.experience.scene
		this.physicsWorld = this.experience.physicsWorld
		this.camera = this.experience.camera

		this.position = _position

		this.setGeometry()
		this.setMaterial()
		this.setMesh()
		this.setPhysics()
		this.setControls()
	}

	setGeometry() {
		this.geometry = new BoxGeometry()
	}

	setMaterial() {
		this.material = new MeshBasicMaterial({
			color: 0xff0000,
		})
		this.faceMaterial = new MeshBasicMaterial({
			color: 0x0000ff,
		})
	}

	setMesh() {
		this.mesh = new Mesh(this.geometry, [
			this.material,
			this.material,
			this.material,
			this.material,
			this.material,
			this.faceMaterial,
		])
		this.mesh.position.copy(this.position)
		this.mesh.name = 'playerCube'
		this.scene.add(this.mesh)
	}

	setPhysics() {
		this.physicsShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
		this.physicsBody = new CANNON.Body({
			mass: 1,
			shape: this.physicsShape,
			name: 'playerCube',
			position: new CANNON.Vec3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z),
			quaternion: new CANNON.Quaternion(
				this.mesh.quaternion.x,
				this.mesh.quaternion.y,
				this.mesh.quaternion.z,
				this.mesh.quaternion.w
			),
		})
		this.physicsBody.addEventListener('collide', (event) => {
			this.moveWith = null
			if (event.body.name === 'moving') {
				this.moveWith = event.body
			}
			if (event.body.name === 'reset') {
				this.physicsBody.position.copy(this.position)
			}
		})
		this.physicsWorld.addBody(this.physicsBody)
	}

	setControls() {
		this.controls = {
			up: false,
			down: false,
			left: false,
			right: false,
			space: false,
		}
		InputManager.on('up', (value) => {
			this.controls.up = value
		})
		InputManager.on('down', (value) => {
			this.controls.down = value
		})
		InputManager.on('left', (value) => {
			this.controls.left = value
		})
		InputManager.on('right', (value) => {
			this.controls.right = value
		})
		InputManager.on('space', (value) => {
			this.controls.space = value
		})
	}

	move() {
		const speed = 2
		if (this.controls.up) {
			this.physicsBody.velocity.z = -speed
		}
		if (this.controls.down) {
			this.physicsBody.velocity.z = speed
		}
		if (this.controls.left) {
			this.physicsBody.velocity.x = -speed
		}
		if (this.controls.right) {
			this.physicsBody.velocity.x = speed
		}
		if (this.moveWith) {
			this.physicsBody.velocity.addScaledVector(1, this.moveWith.velocity)
		}
	}

	expand() {
		const interpolationFactor = 1 - Math.pow(0.0000000000000001, this.experience.time.delta * 0.001)

		if (this.controls.space) {
			this.mesh.scale.y = lerp(this.mesh.scale.y, 2, interpolationFactor)
			this.physicsShape.halfExtents.y = lerp(this.physicsShape.halfExtents.y, 1, interpolationFactor)
		} else {
			this.mesh.scale.y = lerp(this.mesh.scale.y, 1, interpolationFactor)
			this.physicsShape.halfExtents.y = lerp(this.physicsShape.halfExtents.y, 0.5, interpolationFactor)
		}
		this.physicsShape.updateConvexPolyhedronRepresentation()
	}

	update() {
		this.mesh.position.copy(this.physicsBody.position)
		this.mesh.quaternion.copy(this.physicsBody.quaternion)

		this.move()
		this.expand()

		this.camera.sceneCamera.position.copy(this.mesh.position.clone().add(new Vector3(0, 5, 10)))
		this.camera.sceneCamera.lookAt(this.mesh.position)
	}
}
