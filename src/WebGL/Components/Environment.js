import Experience from '../Experience.js'
import { DirectionalLight, Mesh, MeshStandardMaterial, SRGBColorSpace } from 'three'
import addObjectDebug from 'utils/addObjectDebug.js'

export default class Environment {
	constructor() {
		this.experience = new Experience()
		this.scene = this.experience.scene
		this.resources = this.experience.resources
		this.debug = this.experience.debug

		// Debug
		if (this.debug.active) {
			this.environmentDebugFolder = this.debug.ui.addFolder({
				title: 'environment',
				expanded: false,
			})
		}

		this.setSunLight()
		this.setEnvironmentMap()
	}

	setSunLight() {
		this.sunLight = new DirectionalLight('#ffffff', 1)
		this.sunLight.name = 'sunLight'
		this.scene.add(this.sunLight)

		// Debug
		if (this.debug.active) {
			const debugFolder = addObjectDebug(this.environmentDebugFolder, this.sunLight)

			debugFolder.addBinding(this.sunLight, 'intensity', {
				min: 0,
				max: 10,
				step: 0.001,
				label: 'intensity',
			})
		}
	}

	setEnvironmentMap() {
		this.environmentMap = {}
		this.environmentMap.intensity = 1
		this.environmentMap.texture = this.resources.items.environmentMapTexture
		this.environmentMap.texture.colorSpace = SRGBColorSpace

		this.scene.environment = this.environmentMap.texture

		this.environmentMap.updateMaterials = () => {
			this.scene.traverse((child) => {
				if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
					child.material.envMap = this.environmentMap.texture
					child.material.envMapIntensity = this.environmentMap.intensity
					child.material.needsUpdate = true
				}
			})
		}
		this.environmentMap.updateMaterials()

		// Debug
		if (this.debug.active) {
			this.environmentDebugFolder
				.addBinding(this.environmentMap, 'intensity', {
					min: 0,
					max: 4,
					step: 0.001,
					label: 'envMapIntensity',
				})
				.on('change', this.environmentMap.updateMaterials)
		}
	}
}
