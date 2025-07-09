import editable from 'thing-editor/src/editor/props-editor/editable';
import game from 'thing-editor/src/engine/game';
import DSprite from 'thing-editor/src/engine/lib/assets/src/basic/d-sprite.c';

export default class Player extends DSprite {

	@editable({ min: 0, max: 1000 })
	speed = 300;

	@editable({ min: 0, max: 10 })
	fireRate = 0.2; // seconds between shots

	private lastFireTime = 0;
	private keys: { [key: string]: boolean } = {};

	init() {
		super.init();
		this.x = game.W / 2;
		this.y = game.H - 100;
		
		// Set up keyboard input
		window.addEventListener('keydown', this.onKeyDown.bind(this));
		window.addEventListener('keyup', this.onKeyUp.bind(this));
	}

	private onKeyDown(e: KeyboardEvent) {
		this.keys[e.code] = true;
	}

	private onKeyUp(e: KeyboardEvent) {
		this.keys[e.code] = false;
	}

	update() {
		super.update();

		const dt = game.time / 1000; // Convert to seconds
		
		// Movement
		let moveX = 0;
		let moveY = 0;

		if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveX -= 1;
		if (this.keys['KeyD'] || this.keys['ArrowRight']) moveX += 1;
		if (this.keys['KeyW'] || this.keys['ArrowUp']) moveY -= 1;
		if (this.keys['KeyS'] || this.keys['ArrowDown']) moveY += 1;

		// Apply movement
		this.x += moveX * this.speed * dt;
		this.y += moveY * this.speed * dt;

		// Keep player within screen bounds
		this.x = Math.max(32, Math.min(game.W - 32, this.x));
		this.y = Math.max(32, Math.min(game.H - 32, this.y));

		// Shooting
		if (this.keys['Space'] && (game.time - this.lastFireTime) > (this.fireRate * 1000)) {
			this.shoot();
			this.lastFireTime = game.time;
		}
	}

	private shoot() {
		// Find the game scene and create a projectile
		const gameScene = game.currentScene;
		if (gameScene && gameScene.name === 'game') {
			// Create projectile using the custom factory method
			const gameManager = gameScene.findChildByName('gameManager') as any;
			if (gameManager) {
				gameManager.createProjectile(this.x, this.y - 20, true);
				
				// Play sound effect (placeholder)
				console.log('🔫 Player shooting!');
			}
		}
	}

	onRemove() {
		// Clean up event listeners
		window.removeEventListener('keydown', this.onKeyDown.bind(this));
		window.removeEventListener('keyup', this.onKeyUp.bind(this));
		super.onRemove();
	}
}