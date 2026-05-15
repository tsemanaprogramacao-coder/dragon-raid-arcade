import Phaser from 'phaser';

export default class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'fireball');
  }

  fire(x, y) {
    this.enableBody(true, x, y, true, true);
    this.setVelocityY(-700); // Tiro bem mais rápido e visível
  }

  update(time, delta) {
    if (this.active && this.y <= -32) {
      this.disableBody(true, true);
    }
  }
}
