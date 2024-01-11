import Experience from './Experience.js'
import { World, Vec3 } from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'
import EventEmitter from 'utils/EventEmitter.js'
export default class PhysicsWorld extends EventEmitter {
	constructor() {
		super()
		this.experience = new Experience()
		this.time = this.experience.time
		this.debug = this.experience.debug
		this.scene = this.experience.scene

		this.gravity = new Vec3(0, -1, 0)

		this.setInstance()
		if (this.debug.active) this.setDebug()
	}

	setDebug() {
		this.debugFolder = this.debug.ui.addFolder({
			title: 'physicsWorld',
			expanded: false,
		})

		this.debugFolder
			.addBinding(this, 'gravity', {
				label: 'gravityX',
				min: -10,
				max: 10,
				step: 0.1,
			})
			.on('change', () => {
				this.instance.gravity.copy(this.gravity)
			})

		this.debugFolder
			.addButton({
				title: 'cannonDebuggerVisible',
			})
			.on('click', () => {
				if (!this.cannonDebugger) {
					this.cannonDebugger = new CannonDebugger(this.scene, this.instance, {
						onInit: (body, mesh) => {
							this.on('cannonDebuggerVisible', () => {
								mesh.visible = !mesh.visible
							})
						},
					})
				}
				this.trigger('cannonDebuggerVisible')
			})
	}

	setInstance() {
		this.instance = new World()
		this.instance.gravity.copy(this.gravity)
	}

	addBody(_body) {
		this.instance.addBody(_body)
	}

	update() {
		this.instance.step(1 / 60, this.time.delta, 3)
		if (this.cannonDebugger) this.cannonDebugger.update()
	}
}
