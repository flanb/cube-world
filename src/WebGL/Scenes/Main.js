import Experience from '../Experience.js'
import Reset from 'components/Reset.js'
import Cube from 'components/Cube/Cube.js'
import Environment from 'components/Environment.js'
import Map from 'components/Map.js'

export default class Main {
	constructor() {
		this.experience = new Experience()
		this.scene = this.experience.scene
		this.resources = this.experience.resources

		// Wait for resources
		this.resources.on('ready', () => {
			// Setup
			this.environment = new Environment()
			this.reset = new Reset()
			this.cube = new Cube()
			this.map = new Map()
		})
	}

	update() {
		if (this.cube) this.cube.update()
		if (this.map) this.map.update()
	}
}
