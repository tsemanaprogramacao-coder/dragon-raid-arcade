import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture = 'dragon_fire') {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.speed = 300;
    
    // Configurações de corpo físico
    this.body.setSize(24, 24);
    
    // Controles
    this.cursors = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });
    
    this.lastFired = 0;
  }

  update(time, delta) {
    this.setVelocityX(0);

    // Movimentação Lateral
    if (this.cursors.left.isDown) {
      this.setVelocityX(-this.speed);
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(this.speed);
    }

    // Movimentação Vertical (River Raid Style)
    let targetY = this.scene.cameras.main.height - 150; // Posição padrão (baixo)
    this.scene.targetScrollMultiplier = 1;

    if (this.cursors.up.isDown) {
      targetY = this.scene.cameras.main.height - 350; // Sobe um pouco
      this.scene.targetScrollMultiplier = 1.8; // Reduzido de 2.5 para 1.8 (mais controlável)
    } else if (this.cursors.down.isDown) {
      targetY = this.scene.cameras.main.height - 50; // Desce bastante
      this.scene.targetScrollMultiplier = 0.6; // Desacelera o cenário
    }

    // Movimento suave para a posição alvo no eixo Y
    this.y += (targetY - this.y) * 0.05;
    
    // Anula a gravidade/velocidade Y gerada por colisões
    this.setVelocityY(0);

    // Atirar (Mais caótico: cooldown menor)
    if (this.cursors.space.isDown && time > this.lastFired) {
      this.shoot();
      this.lastFired = time + 150; 
    }
  }

  shoot() {
    this.scene.fireProjectile(this.x, this.y - 16);
  }
}
