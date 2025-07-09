import editable from 'thing-editor/src/editor/props-editor/editable';
import game from 'thing-editor/src/engine/game';
import Container from 'thing-editor/src/engine/lib/assets/src/basic/container.c';
import DSprite from 'thing-editor/src/engine/lib/assets/src/basic/d-sprite.c';

interface Particle {
	sprite: DSprite;
	vx: number;
	vy: number;
	life: number;
	maxLife: number;
}

export default class ExplosionEffect extends Container {

	@editable({ min: 5, max: 50 })
	particleCount = 15;

	@editable({ min: 0.1, max: 5.0 })
	duration = 1.5;

	@editable()
	particleTexture = 'textures/star.png';

	private particles: Particle[] = [];
	private startTime = 0;

	init() {
		super.init();
		this.startTime = game.time;
		this.createParticles();
	}

	private createParticles() {
		for (let i = 0; i < this.particleCount; i++) {
			const sprite = new DSprite();
			sprite.image = this.particleTexture;
			sprite.scale.set(0.3);
			sprite.x = 0;
			sprite.y = 0;
			sprite.tint = Math.random() * 0xFFFFFF;
			
			this.addChild(sprite);

			const particle: Particle = {
				sprite,
				vx: (Math.random() - 0.5) * 300,
				vy: (Math.random() - 0.5) * 300,
				life: this.duration * 1000,
				maxLife: this.duration * 1000
			};

			this.particles.push(particle);
		}
	}

	update() {
		super.update();

		const dt = game.time / 1000;
		let aliveCount = 0;

		for (const particle of this.particles) {
			if (particle.life > 0) {
				// Update position
				particle.sprite.x += particle.vx * dt;
				particle.sprite.y += particle.vy * dt;

				// Update life
				particle.life -= game.time - this.startTime;
				
				// Update visual properties
				const lifeRatio = particle.life / particle.maxLife;
				particle.sprite.alpha = lifeRatio;
				particle.sprite.scale.set(0.3 * lifeRatio);

				// Add gravity effect
				particle.vy += 150 * dt;

				aliveCount++;
			} else {
				particle.sprite.visible = false;
			}
		}

		// Remove effect when all particles are dead
		if (aliveCount === 0) {
			this.remove();
		}
	}

	// Static factory method to create explosion at specific location
	static createAt(x: number, y: number, parent: Container): ExplosionEffect {
		const explosion = new ExplosionEffect();
		explosion.x = x;
		explosion.y = y;
		parent.addChild(explosion);
		return explosion;
	}
}