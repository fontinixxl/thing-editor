import editable from 'thing-editor/src/editor/props-editor/editable';
import game from 'thing-editor/src/engine/game';
import Container from 'thing-editor/src/engine/lib/assets/src/basic/container.c';

export default class GameManager extends Container {

	@editable({ min: 0 })
	score = 0;

	@editable({ min: 0 })
	lives = 3;

	@editable({ min: 0, max: 10 })
	enemySpawnRate = 2.0; // seconds between enemy spawns

	@editable({ min: 0, max: 20 })
	difficultyIncrease = 1.1; // multiplier for difficulty every 30 seconds

	private lastEnemySpawn = 0;
	private gameStartTime = 0;
	private currentDifficulty = 1.0;

	init() {
		super.init();
		this.gameStartTime = game.time;
		this.score = 0;
		this.lives = 3;
		this.updateUI();
	}

	update() {
		super.update();

		// Spawn enemies
		if ((game.time - this.lastEnemySpawn) > (this.enemySpawnRate * 1000 / this.currentDifficulty)) {
			this.spawnEnemy();
			this.lastEnemySpawn = game.time;
		}

		// Increase difficulty over time
		const gameTime = (game.time - this.gameStartTime) / 1000;
		this.currentDifficulty = 1 + Math.floor(gameTime / 30) * (this.difficultyIncrease - 1);

		this.updateUI();
	}

	private spawnEnemy() {
		// Create an enemy instance
		const enemy = new (game.classes.Enemy as any)();
		enemy.image = 'textures/enemy.png';
		enemy.scale.set(0.6);
		enemy.speed = 100 * this.currentDifficulty;
		enemy.health = Math.floor(1 + this.currentDifficulty / 2);
		enemy.scoreValue = 10 * Math.floor(this.currentDifficulty);
		
		// Add to current scene
		const gameScene = game.currentScene;
		if (gameScene) {
			gameScene.addChild(enemy);
			console.log('👾 Spawning enemy with difficulty:', this.currentDifficulty);
		}
	}

	addScore(points: number) {
		this.score += points;
		this.updateUI();
	}

	loseLife() {
		this.lives--;
		this.updateUI();
		
		if (this.lives <= 0) {
			this.gameOver();
		}
	}

	private gameOver() {
		// Save final score for game over scene
		game.settings?.setItem('lastScore', this.score);
		
		// Transition to game over scene
		console.log('🎮 Game Over! Final Score:', this.score);
		game.showScene('gameover');
	}

	private updateUI() {
		// Update UI elements (score, lives)
		const scoreText = game.currentScene?.findChildByName('scoreText');
		const livesText = game.currentScene?.findChildByName('livesText');
		
		if (scoreText) {
			(scoreText as any).text = `Score: ${this.score}`;
		}
		
		if (livesText) {
			(livesText as any).text = `Lives: ${this.lives}`;
		}
	}

	// Factory methods for creating game objects
	createProjectile(x: number, y: number, fromPlayer: boolean = true) {
		// Create projectile instance
		const projectile = new (game.classes.Projectile as any)();
		projectile.image = 'textures/projectile.png';
		projectile.scale.set(0.3);
		projectile.x = x;
		projectile.y = y;
		projectile.speed = 500;
		projectile.damage = 1;
		projectile.fromPlayer = fromPlayer;
		
		// Add to current scene
		const gameScene = game.currentScene;
		if (gameScene) {
			gameScene.addChild(projectile);
		}
	}

	createExplosion(x: number, y: number) {
		// Will implement particle explosion effect
		console.log('Creating explosion at', x, y);
	}
}