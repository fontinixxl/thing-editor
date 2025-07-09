import editable from 'thing-editor/src/editor/props-editor/editable';
import game from 'thing-editor/src/engine/game';
import DSprite from 'thing-editor/src/engine/lib/assets/src/basic/d-sprite.c';

export default class Projectile extends DSprite {

	@editable({ min: 0, max: 1000 })
	speed = 500;

	@editable({ min: 1, max: 100 })
	damage = 1;

	@editable()
	fromPlayer = true;

	private direction = 1; // 1 for up (player projectile), -1 for down (enemy projectile)

	init() {
		super.init();
		this.direction = this.fromPlayer ? -1 : 1; // Player shoots up, enemies shoot down
		
		// Scale down projectiles
		this.scale.set(0.3);
		
		// Different colors for player vs enemy projectiles
		this.tint = this.fromPlayer ? 0x00FF00 : 0xFF0000;
	}

	update() {
		super.update();

		const dt = game.time / 1000;
		
		// Move in the specified direction
		this.y += this.speed * dt * this.direction;

		// Remove if off screen
		if (this.y < -50 || this.y > game.H + 50) {
			this.remove();
		}

		// Check collisions with appropriate targets
		this.checkCollisions();
	}

	private checkCollisions() {
		const gameScene = game.currentScene;
		if (!gameScene) return;

		// Get all children of the game scene
		const allObjects = gameScene.children;

		for (const obj of allObjects) {
			if (this.fromPlayer) {
				// Player projectile - check collision with enemies
				if (obj.constructor.name === 'Enemy') {
					if (this.checkCollision(obj as any)) {
						(obj as any).takeDamage(this.damage);
						this.remove();
						break;
					}
				}
			} else {
				// Enemy projectile - check collision with player
				if (obj.constructor.name === 'Player') {
					if (this.checkCollision(obj as any)) {
						// Player takes damage (implement later)
						console.log('Player hit!');
						this.remove();
						break;
					}
				}
			}
		}
	}

	// Check collision with other objects
	private checkCollision(other: any): boolean {
		const dx = this.x - other.x;
		const dy = this.y - other.y;
		const distance = Math.sqrt(dx * dx + dy * dy);
		return distance < 30; // Simple circular collision
	}
}