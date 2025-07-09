import editable from 'thing-editor/src/editor/props-editor/editable';
import game from 'thing-editor/src/engine/game';
import DSprite from 'thing-editor/src/engine/lib/assets/src/basic/d-sprite.c';

export default class Enemy extends DSprite {

	@editable({ min: 0, max: 500 })
	speed = 100;

	@editable({ min: 1, max: 100 })
	health = 1;

	@editable({ min: 1, max: 1000 })
	scoreValue = 10;

	private direction = 1; // 1 for down, can be modified for different movement patterns

	init() {
		super.init();
		// Start at random X position at top of screen
		this.x = Math.random() * (game.W - 64) + 32;
		this.y = -32;
		
		// Random tint for variety
		this.tint = Math.random() * 0xFFFFFF;
	}

	update() {
		super.update();

		const dt = game.time / 1000;
		
		// Move down the screen
		this.y += this.speed * dt * this.direction;

		// Simple horizontal movement pattern
		this.x += Math.sin(this.y * 0.01) * 50 * dt;

		// Remove if off screen
		if (this.y > game.H + 50) {
			this.destroy();
		}

		// Keep within horizontal bounds
		if (this.x < 32) this.x = 32;
		if (this.x > game.W - 32) this.x = game.W - 32;
	}

	takeDamage(damage: number = 1) {
		this.health -= damage;
		
		// Flash effect when hit
		this.alpha = 0.5;
		setTimeout(() => {
			if (this.parent) {
				this.alpha = 1.0;
			}
		}, 100);

		if (this.health <= 0) {
			// Add score to game manager
			const gameScene = game.currentScene;
			const gameManager = gameScene?.findChildByName('gameManager') as any;
			if (gameManager) {
				gameManager.addScore(this.scoreValue);
			}
			
			this.destroy();
			console.log(`💀 Enemy destroyed! Score: ${this.scoreValue}`);
		}
	}

	destroy() {
		// Create explosion effect
		const gameScene = game.currentScene;
		if (gameScene) {
			// Import and create explosion effect
			console.log('💥 Creating explosion at', this.x, this.y);
			// ExplosionEffect.createAt(this.x, this.y, gameScene);
		}
		
		this.remove();
	}

	// Check collision with other objects
	checkCollision(other: DSprite): boolean {
		const dx = this.x - other.x;
		const dy = this.y - other.y;
		const distance = Math.sqrt(dx * dx + dy * dy);
		return distance < 40; // Simple circular collision
	}
}