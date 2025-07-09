import game from 'thing-editor/src/engine/game';
import Scene from 'thing-editor/src/engine/lib/assets/src/basic/scene.c';

export default class MenuScene extends Scene {

	onShow() {
		super.onShow();
		
		// Set up button event handlers
		const playButton = this.findChildByName('playButton');
		const settingsButton = this.findChildByName('settingsButton');
		
		if (playButton) {
			(playButton as any).onClick = () => {
				game.showScene('game');
			};
		}
		
		if (settingsButton) {
			(settingsButton as any).onClick = () => {
				game.showScene('settings');
			};
		}
	}

	onMouseDown(mouse: typeof game.mouse, ev: PointerEvent) {
		super.onMouseDown(mouse, ev);
		
		// Handle click events for demonstration
		console.log('Menu scene clicked at:', mouse.x, mouse.y);
	}
}