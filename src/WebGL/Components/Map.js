import Experience from '../Experience.js'
import AnimationController from 'utils/AnimationController.js'
import addObjectDebug from 'utils/addObjectDebug.js'
import * as CANNON from 'cannon-es'
import { threeToCannon, ShapeType } from 'three-to-cannon'
import { Quaternion } from 'three'

export default class Map {
	constructor() {
		this.experience = new Experience()

		this.resource = this.experience.resources.items.mapModel

		this.setModel()
		this.setAnimation()
		this.setPhysics()
		if (this.experience.debug.active) this.setDebug()
	}

	setModel() {
		this.model = this.resource.scene
		this.experience.scene.add(this.model)
	}

	setAnimation() {
		this.animation = new AnimationController({
			model: this.resource.scene,
			animations: this.resource.animations,
		})
		this.animation.fadeAnimation(this.animation.animations[0].name, { loop: true, yoyo: true })
	}

	setPhysics() {
		this.dynamicBodies = []
		const movingMeshes = []
		const staticBody = new CANNON.Body({
			mass: 0,
		})
		this.experience.physicsWorld.addBody(staticBody)
		this.model.traverse((child) => {
			if (child.isMesh) {
				const shapeResult = threeToCannon(child, {
					type: ShapeType.BOX,
				})

				const shapeQuaternion = new Quaternion()
				if (shapeResult.orientation) shapeQuaternion.copy(shapeResult.orientation)
				const combinedPosition = shapeResult.offset.vadd(child.position)
				const combinedQuaternion = shapeQuaternion.multiply(child.quaternion)

				if (child.name.toLowerCase().includes('moving')) {
					if (movingMeshes.includes(child.parent)) return
					movingMeshes.push(child.parent)
					const movingBody = new CANNON.Body({
						mass: 0,
						type: CANNON.Body.KINEMATIC,
					})
					movingBody.addShape(shapeResult.shape, combinedPosition, combinedQuaternion)
					movingBody.name = 'moving'
					this.dynamicBodies.push({ body: movingBody, mesh: child.parent })
					this.experience.physicsWorld.addBody(movingBody)
				} else {
					staticBody.addShape(shapeResult.shape, combinedPosition, combinedQuaternion)
				}
			}
		})
	}

	update() {
		this.animation.update(this.experience.time.delta * 0.001)
		this.dynamicBodies.forEach(({ body, mesh }) => {
			if (!this.bodyPreviousPosition) body.position.copy(mesh.position)
			const velocityX = mesh.position.x - this.bodyPreviousPosition?.x
			this.bodyPreviousPosition = mesh.position.clone()
			if (velocityX) {
				body.velocity.x = velocityX * 20
			}
		})
	}

	setDebug() {
		const debugFolder = addObjectDebug(this.experience.debug.ui, this.model, { title: 'map' })
		this.animation.setDebug(debugFolder)
	}
}
