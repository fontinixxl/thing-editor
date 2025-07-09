import game from 'thing-editor/src/engine/game';
import Scene from 'thing-editor/src/engine/lib/assets/src/basic/scene.c';

export default class SettingsScene extends Scene {

	onShow() {
		super.onShow();
		
		// Set up button event handlers
		const backButton = this.findChildByName('backButton');
		const soundTestButton = this.findChildByName('soundTestButton');
		const audioSlider = this.findChildByName('audioSlider');
		
		if (backButton) {
			(backButton as any).onClick = () => {
				game.showScene('menu');
			};
		}
		
		if (soundTestButton) {
			(soundTestButton as any).onClick = () => {
				this.testSound();
			};
		}

		// Load current audio settings
		this.loadSettings();
	}

	private testSound() {
		// Play a test sound (will implement when we add sound assets)
		console.log('Playing test sound...');
		
		// Show notification that sound was played
		game.showModal('Sound test played!', 'Audio Test').then(() => {
			// Modal closed
		});
	}

	private loadSettings() {
		// Load settings from local storage or game settings
		const audioSlider = this.findChildByName('audioSlider');
		if (audioSlider) {
			// Set slider value from saved settings
			(audioSlider as any).value = game.settings?.getItem('audioVolume', 0.8) || 0.8;
		}
	}

	private saveSettings() {
		// Save current settings
		const audioSlider = this.findChildByName('audioSlider');
		if (audioSlider) {
			const volume = (audioSlider as any).value || 0.8;
			game.settings?.setItem('audioVolume', volume);
		}
	}

	onHide() {
		super.onHide();
		this.saveSettings();
	}
}