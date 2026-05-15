import Phaser from 'phaser';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
  }

  create() {
    // Fundo HUD superior (descido um pouco)
    this.add.rectangle(0, 15, this.cameras.main.width, 50, 0x000000, 0.6).setOrigin(0);

    this.scoreText = this.add.text(20, 25, 'Score: 0', { 
        fontFamily: 'Pirata One', 
        fontSize: '28px', 
        fill: '#ffffff' 
    });
    
    this.manaText = this.add.text(this.cameras.main.width - 150, 25, 'Mana: 100%', { 
        fontFamily: 'Pirata One', 
        fontSize: '28px', 
        fill: '#9370DB' 
    });

    this.livesText = this.add.text(this.cameras.main.width / 2, 25, 'Vidas: 3', {
        fontFamily: 'Pirata One',
        fontSize: '28px',
        fill: '#ffaa00'
    }).setOrigin(0.5, 0);

    const gameScene = this.scene.get('GameScene');

    // Update listeners
    gameScene.events.on('updateLives', (lives) => {
        this.livesText.setText('Vidas: ' + lives);
    });
    gameScene.events.on('updateScore', (score) => {
      this.scoreText.setText('Score: ' + score);
      // Efeito de pulso no score
      this.tweens.add({
        targets: this.scoreText,
        scaleX: 1.2,
        scaleY: 1.2,
        yoyo: true,
        duration: 100
      });
    });

    gameScene.events.on('updateMana', (mana) => {
      this.manaText.setText('Mana: ' + Math.floor(mana) + '%');
      if (mana < 20) {
        this.manaText.setFill('#ff0000');
      } else {
        this.manaText.setFill('#9370DB');
      }
    });
  }
}
