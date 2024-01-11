import Experience from '../Experience.js'
import * as CANNON from 'cannon-es'

export default class Reset {
	constructor() {
		this.experience = new Experience()
		this.physicsWorld = this.experience.physicsWorld

		this.setPhysics()
	}

	setPhysics() {
		const shape = new CANNON.Plane()
		const physicsBody = new CANNON.Body({
			mass: 0,
			shape,
			position: new CANNON.Vec3(0, -5, 0),
			quaternion: new CANNON.Quaternion().setFromEuler(-Math.PI * 0.5, 0, 0),
		})
		physicsBody.name = 'reset'
		this.physicsWorld.addBody(physicsBody)
	}
}
