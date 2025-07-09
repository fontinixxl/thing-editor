import game from 'thing-editor/src/engine/game';
import Scene from 'thing-editor/src/engine/lib/assets/src/basic/scene.c';

export default class GameOverScene extends Scene {

	private finalScore = 0;
	private highScore = 0;

	onShow() {
		super.onShow();
		
		// Get final score from game manager or game state
		this.finalScore = this.getFinalScore();
		this.highScore = this.getHighScore();
		
		// Update score displays
		this.updateScoreDisplay();
		
		// Set up button event handlers
		const playAgainButton = this.findChildByName('playAgainButton');
		const menuButton = this.findChildByName('menuButton');
		
		if (playAgainButton) {
			(playAgainButton as any).onClick = () => {
				game.showScene('game');
			};
		}
		
		if (menuButton) {
			(menuButton as any).onClick = () => {
				game.showScene('menu');
			};
		}

		// Check if this is a new high score
		if (this.finalScore > this.highScore) {
			this.celebrateHighScore();
		}
	}

	private getFinalScore(): number {
		// Try to get score from previous game session
		// In a real implementation, this would come from the GameManager
		return game.settings?.getItem('lastScore', 0) || 0;
	}

	private getHighScore(): number {
		return game.settings?.getItem('highScore', 0) || 0;
	}

	private updateScoreDisplay() {
		const finalScoreText = this.findChildByName('finalScore');
		const highScoreText = this.findChildByName('highScore');
		
		if (finalScoreText) {
			(finalScoreText as any).text = `Final Score: ${this.finalScore}`;
		}
		
		if (highScoreText) {
			const displayScore = Math.max(this.finalScore, this.highScore);
			(highScoreText as any).text = `High Score: ${displayScore}`;
		}

		// Save new high score if achieved
		if (this.finalScore > this.highScore) {
			game.settings?.setItem('highScore', this.finalScore);
		}
	}

	private celebrateHighScore() {
		// Show congratulations modal
		game.showModal('🎉 NEW HIGH SCORE! 🎉', 'Congratulations!').then(() => {
			// Could add particle effects or other celebration
			console.log('High score celebration finished');
		});
	}
}