import Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, speedY, hp, typeScore) {
    super(scene, x, y, texture);
    this.speedY = speedY;
    this.hp = hp;
    this.typeScore = typeScore;
  }

  spawn(x, y) {
    this.enableBody(true, x, y, true, true);
    this.setVelocityY(this.speedY);
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    this.disableBody(true, true);
    this.scene.addScore(this.typeScore);
  }

  update(time, delta) {
    if (this.active && this.y > this.scene.cameras.main.height + 64) {
      this.disableBody(true, true);
    }
  }
}
