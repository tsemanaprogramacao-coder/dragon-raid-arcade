import Phaser from 'phaser';
import Player from '../entities/Player.js';
import Projectile from '../entities/Projectile.js';
import Enemy from '../entities/Enemy.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  init(data) {
    this.selectedDragon = data.dragonType || 'dragon_fire';
    this.checkpointScore = data.checkpointScore || 0;
    this.lives = data.lives !== undefined ? data.lives : 3;
  }

  create() {
    this.score = this.checkpointScore;
    this.mana = 100;
    this.baseScrollSpeed = 150; 
    this.scrollMultiplier = 1;
    this.targetScrollMultiplier = 1;
    this.spawnTimer = 0;

    this.riverBg = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'riverBg');
    this.riverBg.setOrigin(0, 0);

    this.particles = this.add.particles('spark');
    this.bloodParticles = this.add.particles('blood');

    this.projectiles = this.physics.add.group({
      classType: Projectile,
      runChildUpdate: true,
      maxSize: 50
    });

    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
      maxSize: 100
    });

    this.manaCrystals = this.physics.add.group();

    this.banks = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });
    
    this.gates = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    this.riverCenter = this.cameras.main.width / 2;
    this.riverWidth = 450;

    // Pré-gerar as margens para a tela inteira começar preenchida
    for (let y = this.cameras.main.height; y >= -128; y -= 64) {
      this.spawnBankRow(y);
    }
    this.nextBankSpawnY = -128;

    this.player = new Player(this, this.cameras.main.width / 2, this.cameras.main.height - 150, this.selectedDragon);
    // Diminuindo a hitbox (caixa de colisão) do dragão para ser mais permissivo e não dar game over injusto
    this.player.body.setSize(14, 14);
    this.player.body.setOffset(17, 17); // Sprite aumentou para 48x48

    this.fog = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'fog');
    this.fog.setOrigin(0, 0);
    this.fog.setAlpha(0.5);
    this.fog.setBlendMode(Phaser.BlendModes.ADD);

    // Overlap para tiro perfurante
    this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);
    
    // Collider do tiro nas paredes e portões (somem)
    this.physics.add.collider(this.projectiles, this.banks, this.hitBank, null, this);
    this.physics.add.collider(this.projectiles, this.gates, this.hitGate, null, this);
    
    // Player morre se encostar em tudo
    this.physics.add.overlap(this.player, this.enemies, this.hitPlayer, null, this);
    this.physics.add.collider(this.player, this.banks, this.hitPlayer, null, this); 
    this.physics.add.collider(this.player, this.gates, this.hitPlayer, null, this); 
    
    // Inimigos são destruídos ao bater na margem (evita que invadam a terra)
    this.physics.add.overlap(this.enemies, this.banks, this.enemyHitBank, null, this);

    this.physics.add.overlap(this.player, this.manaCrystals, this.collectMana, null, this);

    this.scene.launch('UIScene');
    
    // Transmite as vidas iniciais para a UI
    this.time.delayedCall(100, () => {
      this.events.emit('updateLives', this.lives);
    });
  }

  update(time, delta) {
    if (!this.player.active) return;

    this.player.update(time, delta);
    
    this.scrollMultiplier += (this.targetScrollMultiplier - this.scrollMultiplier) * 0.1;
    
    const currentScrollSpeed = this.baseScrollSpeed * this.scrollMultiplier;
    const currentScrollDelta = currentScrollSpeed * (delta / 1000);

    this.riverBg.tilePositionY -= currentScrollDelta;
    this.fog.tilePositionY -= currentScrollDelta * 1.5;
    this.fog.tilePositionX += 0.5;

    this.banks.getChildren().forEach(bank => {
      bank.body.setVelocityY(currentScrollSpeed);
      if (bank.y > this.cameras.main.height + 64) {
        bank.destroy();
      }
    });

    this.gates.getChildren().forEach(gate => {
      gate.body.setVelocityY(currentScrollSpeed);
      if (gate.y > this.cameras.main.height + 64) {
        gate.destroy();
      }
    });

    this.manaCrystals.getChildren().forEach(crystal => {
      crystal.setVelocityY(currentScrollSpeed);
      if (crystal.y > this.cameras.main.height + 64) {
        crystal.destroy();
      }
    });

    this.enemies.getChildren().forEach(enemy => {
      enemy.setVelocityY(currentScrollSpeed + enemy.baseSpeedY);
      if (enemy.baseSpeedX) {
        enemy.setVelocityX(enemy.baseSpeedX);
      }
    });

    // Gerar Margens continuamente (blocos de 64x64 agora)
    while (this.nextBankSpawnY > -128) {
      this.spawnBankRow(this.nextBankSpawnY);
      this.nextBankSpawnY -= 64;
    }
    this.nextBankSpawnY += currentScrollDelta;

    this.mana -= delta * 0.0035; // Reduzido de 0.005 para o jogador não morrer tão rápido
    if (this.mana <= 0) {
      this.mana = 0;
      this.gameOver();
    }
    this.events.emit('updateMana', this.mana);

    if (time > this.spawnTimer) {
      this.spawnRandomEntity();
      this.spawnTimer = time + Phaser.Math.Between(450, 1100);
    }

    this.baseScrollSpeed += 0.02;
  }

  spawnBankRow(yPos) {
    this.riverCenter += (Math.random() - 0.5) * 80;
    this.riverCenter = Phaser.Math.Clamp(this.riverCenter, 200, this.cameras.main.width - 200);
    
    this.riverWidth += (Math.random() - 0.5) * 60;
    this.riverWidth = Phaser.Math.Clamp(this.riverWidth, 350, 600);

    const leftEdge = Math.floor(this.riverCenter - this.riverWidth / 2);
    const rightEdge = Math.floor(this.riverCenter + this.riverWidth / 2);

    if (leftEdge > 0) {
      let leftBank = this.add.tileSprite(0, yPos, leftEdge, 64, 'obstacle').setOrigin(0, 0.5);
      this.physics.add.existing(leftBank);
      leftBank.body.setImmovable(true);
      leftBank.setTint(0x999999); 
      this.banks.add(leftBank);
    }

    let rightBankWidth = Math.floor(this.cameras.main.width - rightEdge);
    if (rightBankWidth > 0) {
      let rightBank = this.add.tileSprite(rightEdge, yPos, rightBankWidth, 64, 'obstacle').setOrigin(0, 0.5);
      this.physics.add.existing(rightBank);
      rightBank.body.setImmovable(true);
      rightBank.setTint(0x999999);
      this.banks.add(rightBank);
    }

    // Spawn Portão (Ponte do River Raid) - 1% de chance por row
    if (Phaser.Math.Between(0, 100) < 1 && this.riverWidth < 450) {
      let gateWidth = rightEdge - leftEdge;
      if (gateWidth > 50) {
        let gate = this.add.tileSprite(leftEdge, yPos, gateWidth, 64, 'gate').setOrigin(0, 0.5);
        this.physics.add.existing(gate);
        gate.body.setImmovable(true);
        gate.hp = 5; 
        gate.typeScore = 500;
        this.gates.add(gate);
      }
    }
  }

  fireProjectile(x, y) {
    const projectile = this.projectiles.get();
    if (projectile) {
      projectile.fire(x, y);
      
      const emitter = this.add.particles(0, 0, 'spark', {
        speed: { min: -50, max: 50 },
        scale: { start: 1, end: 0 },
        blendMode: 'ADD',
        lifespan: 150
      });
      emitter.startFollow(projectile);
      this.time.delayedCall(800, () => {
        emitter.stop();
        this.time.delayedCall(500, () => emitter.destroy());
      });
    }
  }

  spawnRandomEntity() {
    const leftBound = this.riverCenter - this.riverWidth/2 + 30;
    const rightBound = this.riverCenter + this.riverWidth/2 - 30;
    const spawnX = (leftBound < rightBound) ? Phaser.Math.Between(leftBound, rightBound) : this.riverCenter;

    const rand = Phaser.Math.Between(0, 100);

    if (rand < 15) { // Moderadamente raro (meio termo entre 10 e 25)
      let crystal = this.manaCrystals.create(spawnX, -32, 'mana');
      let targetX = Phaser.Math.Clamp(spawnX + Phaser.Math.Between(-30, 30), leftBound, rightBound);
      this.tweens.add({ targets: crystal, x: targetX, duration: 2000, yoyo: true, repeat: -1 });
    } else if (rand < 55) {
      let enemy = this.enemies.get();
      if (enemy) {
        enemy.setTexture('viking_ship');
        enemy.hp = 1;
        enemy.typeScore = 100;
        
        let moveType = Phaser.Math.Between(0, 1);
        if (moveType === 0) {
            // Reto (descendo o rio)
            enemy.baseSpeedY = 20; 
            enemy.baseSpeedX = 0;
            enemy.spawn(spawnX, -32);
            enemy.setRotation(Math.PI); // Aponta pra baixo
        } else {
            // De lado (bloqueando)
            enemy.baseSpeedY = 20; 
            enemy.baseSpeedX = Phaser.Math.Between(0, 1) ? 30 : -30;
            enemy.spawn(spawnX, -32);
            enemy.setRotation(enemy.baseSpeedX > 0 ? Math.PI/2 : -Math.PI/2); // Aponta para a direção do movimento
        }
      }
    } else if (rand < 85) {
      let enemy = this.enemies.get();
      if (enemy) {
        enemy.setTexture('harpy');
        enemy.hp = 1;
        enemy.typeScore = 150;
        enemy.baseSpeedY = 100;
        enemy.baseSpeedX = 0;
        enemy.spawn(spawnX, -32);
        enemy.setRotation(Math.PI); // Harpias olhando pra baixo
        
        let targetX = Phaser.Math.Clamp(spawnX + Phaser.Math.Between(-60, 60), leftBound, rightBound);
        this.tweens.add({ targets: enemy, x: targetX, duration: 600, yoyo: true, repeat: -1 });
      }
    } else {
      let enemy = this.enemies.get();
      if (enemy) {
        enemy.setTexture('griffin_1');
        enemy.play('griffin_fly');
        enemy.hp = 2; 
        enemy.typeScore = 300;
        
        let moveType = Phaser.Math.Between(0, 1);
        if (moveType === 0) {
            // Reto
            enemy.baseSpeedY = 150;
            enemy.baseSpeedX = 0;
            enemy.spawn(spawnX, -48);
            enemy.setRotation(Math.PI); // Aponta pra baixo
        } else {
            // Diagonal
            enemy.baseSpeedY = 150;
            enemy.baseSpeedX = Phaser.Math.Between(0, 1) ? 150 : -150;
            enemy.spawn(spawnX, -48);
            
            let angle = Math.atan2(enemy.baseSpeedY, enemy.baseSpeedX);
            enemy.setRotation(angle + Math.PI/2); // Alinha o sprite UP (+90 deg na matemática do canvas)
        }
      }
    }
  }

  enemyHitBank(enemy, bank) {
    // Se o inimigo encostar na parede (ex: o rio curvou e pegou ele), ele morre silenciosamente.
    enemy.disableBody(true, true);
    
    // Pequeno efeito de poeira pra mostrar que ele bateu na margem
    const emitter = this.add.particles(enemy.x, enemy.y, 'spark', {
        speed: { min: -30, max: 30 }, scale: { start: 0.5, end: 0 }, lifespan: 200, blendMode: 'ADD', emitting: false
    });
    emitter.explode(5);
    this.time.delayedCall(500, () => emitter.destroy());
  }

  hitBank(projectile, bank) {
    projectile.disableBody(true, true);
    const emitter = this.add.particles(projectile.x, projectile.y, 'spark', {
        speed: { min: -50, max: 50 }, scale: { start: 1, end: 0 }, lifespan: 200, blendMode: 'ADD', emitting: false
    });
    emitter.explode(10);
    this.time.delayedCall(1000, () => emitter.destroy());
  }

  hitGate(projectile, gate) {
    projectile.disableBody(true, true);
    gate.hp -= 1;
    
    // Efeito de impacto no portão
    const emitter = this.add.particles(projectile.x, projectile.y, 'spark', {
        speed: { min: -100, max: 100 }, scale: { start: 1, end: 0 }, lifespan: 200, blendMode: 'ADD', emitting: false
    });
    emitter.explode(20);
    this.time.delayedCall(1000, () => emitter.destroy());

    // Pisca branco ao tomar dano
    gate.setTint(0xff8888);
    this.time.delayedCall(100, () => gate.clearTint());

    if (gate.hp <= 0) {
        this.addScore(gate.typeScore);
        this.checkpointScore = this.score;
        
        let cpText = this.add.text(this.cameras.main.width/2, this.cameras.main.height/2, 'CHECKPOINT', {
            fontFamily: 'Pirata One', fontSize: '64px', fill: '#00ff00', stroke: '#000000', strokeThickness: 8
        }).setOrigin(0.5);
        this.tweens.add({ targets: cpText, y: '-=100', alpha: 0, duration: 2000, onComplete: () => cpText.destroy() });
        
        this.cameras.main.shake(200, 0.02);
        this.cameras.main.flash(200, 255, 200, 0);
        
        // Destroços do portão
        const expl = this.add.particles(gate.x + gate.width/2, gate.y, 'spark', {
            speed: { min: -300, max: 300 }, scale: { start: 3, end: 0 }, lifespan: 800, emitting: false
        });
        expl.explode(50);
        this.time.delayedCall(1500, () => expl.destroy());
        
        gate.destroy();
    }
  }

  hitEnemy(projectile, enemy) {
    // Tiro clássico: desativa o projétil no impacto
    projectile.disableBody(true, true);
    enemy.takeDamage(1);

    if (enemy.hp <= 0) {
      const emitter = this.add.particles(enemy.x, enemy.y, 'blood', {
        speed: { min: -100, max: 100 }, scale: { start: 1, end: 0 }, lifespan: 400, blendMode: 'ADD', emitting: false
      });
      emitter.explode(15);
      this.time.delayedCall(1000, () => emitter.destroy());
      
      if (enemy.typeScore === 300) {
        this.cameras.main.shake(100, 0.01);
      }
    }
  }

  hitPlayer(player, target) {
    const emitter = this.add.particles(player.x, player.y, 'blood', {
      speed: { min: -200, max: 200 }, scale: { start: 2, end: 0 }, lifespan: 600, emitting: false
    });
    emitter.explode(40);
    this.cameras.main.shake(400, 0.05);

    this.gameOver();
  }

  collectMana(player, crystal) {
    crystal.destroy();
    this.mana = Phaser.Math.Clamp(this.mana + 25, 0, 100);
    this.addScore(50);
    this.cameras.main.flash(100, 147, 112, 219);
  }

  addScore(amount) {
    this.score += amount;
    this.events.emit('updateScore', this.score);
  }

  gameOver() {
    this.player.setActive(false);
    this.player.setVisible(false);
    this.player.body.stop();
    
    this.lives -= 1;
    this.events.emit('updateLives', this.lives);
    
    this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.7).setOrigin(0);
    
    if (this.lives > 0) {
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'VOCÊ MORREU!', { 
            fontFamily: 'Pirata One', fontSize: '64px', fill: '#ffaa00' 
        }).setOrigin(0.5);
        
        this.time.delayedCall(3000, () => {
          this.scene.stop('UIScene');
          this.scene.start('GameScene', { dragonType: this.selectedDragon, checkpointScore: this.checkpointScore, lives: this.lives });
        });
    } else {
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'GAME OVER', { 
            fontFamily: 'Pirata One', fontSize: '64px', fill: '#ff0000' 
        }).setOrigin(0.5);
        
        this.time.delayedCall(3000, () => {
          this.scene.stop('UIScene');
          this.scene.start('MenuScene');
        });
    }
  }
}
