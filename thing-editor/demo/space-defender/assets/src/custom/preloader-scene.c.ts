import game from 'thing-editor/src/engine/game';
import Scene from 'thing-editor/src/engine/lib/assets/src/basic/scene.c';

export default class PreloaderScene extends Scene {

	private loadingProgress = 0;

	onShow() {
		super.onShow();
		
		// Start the loading simulation
		this.simulateLoading();
	}

	update() {
		super.update();
		
		// Update loading bar
		const loadingBar = this.findChildByName('loadingBar');
		if (loadingBar) {
			(loadingBar as any).value = this.loadingProgress;
		}

		// Update loading text
		const loadingText = this.findChildByName('loadingText');
		if (loadingText) {
			const dots = '.'.repeat((Math.floor(game.time / 500) % 4));
			(loadingText as any).text = `Loading Space Defender${dots}`;
		}

		// Transition to menu when loading is complete
		if (this.loadingProgress >= 1.0) {
			this.transitionToMenu();
		}
	}

	private simulateLoading() {
		// Simulate progressive loading
		const startTime = game.time;
		const loadingDuration = 3000; // 3 seconds

		const updateProgress = () => {
			const elapsed = game.time - startTime;
			this.loadingProgress = Math.min(elapsed / loadingDuration, 1.0);
			
			if (this.loadingProgress < 1.0) {
				setTimeout(updateProgress, 50);
			}
		};

		updateProgress();
	}

	private transitionToMenu() {
		// Add a small delay before transitioning
		setTimeout(() => {
			game.showScene('menu');
		}, 500);
	}
}