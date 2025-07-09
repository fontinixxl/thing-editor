import game from 'thing-editor/src/engine/game';
import Scene from 'thing-editor/src/engine/lib/assets/src/basic/scene.c';

export default class GameScene extends Scene {

	onShow() {
		super.onShow();
		
		// Set up pause button
		const pauseButton = this.findChildByName('pauseButton');
		if (pauseButton) {
			(pauseButton as any).onClick = () => {
				this.pauseGame();
			};
		}

		// Set up keyboard listener for escape key
		window.addEventListener('keydown', this.onKeyDown.bind(this));
	}

	onHide() {
		super.onHide();
		window.removeEventListener('keydown', this.onKeyDown.bind(this));
	}

	private onKeyDown(e: KeyboardEvent) {
		if (e.code === 'Escape') {
			this.pauseGame();
		}
	}

	private pauseGame() {
		// Show a modal dialog for pause menu
		game.showModal('pause-menu');
	}

	onMouseDown(mouse: typeof game.mouse, ev: PointerEvent) {
		super.onMouseDown(mouse, ev);
		
		// Handle game-specific mouse events
		console.log('Game scene clicked at:', mouse.x, mouse.y);
	}
}