import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.selectedDragon = 'dragon_fire';

    // Fundo sombrio com Fog Caótica
    this.add.tileSprite(0, 0, width, height, 'riverBg').setOrigin(0).setTint(0x555555);
    const fog = this.add.tileSprite(0, 0, width, height, 'fog').setOrigin(0).setAlpha(0.6);
    
    // Dragões voando no fundo (Chaos)
    this.bgDragons = this.add.group();
    const dragonTypes = ['dragon_fire', 'dragon_ice', 'dragon_acid'];
    for(let i=0; i<6; i++) {
        let x = Phaser.Math.Between(0, width);
        let y = Phaser.Math.Between(0, height);
        let type = Phaser.Math.RND.pick(dragonTypes);
        let d = this.add.sprite(x, y, type).setAlpha(0.3).setScale(Phaser.Math.FloatBetween(0.5, 1.2));
        d.speedY = Phaser.Math.Between(-150, -400);
        this.bgDragons.add(d);
    }

    this.events.on('update', (time, delta) => {
      fog.tilePositionY -= 3;
      fog.tilePositionX += 0.5;
      
      this.bgDragons.getChildren().forEach(d => {
          d.y += d.speedY * (delta/1000);
          if (d.y < -50) {
              d.y = height + 50;
              d.x = Phaser.Math.Between(0, width);
          }
      });
    });

    this.add.text(width / 2, height / 4, 'DRAGON RAID', {
      fontFamily: 'Pirata One', fontSize: '72px', color: '#ff2222', stroke: '#000000', strokeThickness: 10, shadow: { blur: 20, color: '#ff0000', fill: true }
    }).setOrigin(0.5);

    const selectText = this.add.text(width / 2, height / 2 - 30, 'ESCOLHA SEU DRAGÃO', {
      fontFamily: 'Pirata One', fontSize: '32px', color: '#dddddd'
    }).setOrigin(0.5);

    // Botões de Seleção
    const fireBtn = this.add.sprite(width / 2 - 80, height / 2 + 30, 'dragon_fire').setInteractive().setScale(1.5);
    const iceBtn = this.add.sprite(width / 2, height / 2 + 30, 'dragon_ice').setInteractive().setScale(1.5);
    const acidBtn = this.add.sprite(width / 2 + 80, height / 2 + 30, 'dragon_acid').setInteractive().setScale(1.5);

    // Efeito de Hover/Seleção
    const highlight = this.add.graphics();
    const drawHighlight = (x, y) => {
        highlight.clear();
        highlight.lineStyle(3, 0xffffff, 1);
        highlight.strokeRect(x - 22, y - 22, 44, 44); // highlight ao redor da sprite 32x32 escalada
    };
    drawHighlight(fireBtn.x, fireBtn.y);

    fireBtn.on('pointerdown', () => { 
        this.selectedDragon = 'dragon_fire'; 
        drawHighlight(fireBtn.x, fireBtn.y); 
        this.cameras.main.shake(100, 0.01);
    });
    iceBtn.on('pointerdown', () => { 
        this.selectedDragon = 'dragon_ice'; 
        drawHighlight(iceBtn.x, iceBtn.y); 
        this.cameras.main.shake(100, 0.01);
    });
    acidBtn.on('pointerdown', () => { 
        this.selectedDragon = 'dragon_acid'; 
        drawHighlight(acidBtn.x, acidBtn.y); 
        this.cameras.main.shake(100, 0.01);
    });

    // Animações dos dragões
    this.tweens.add({ targets: [fireBtn, iceBtn, acidBtn], y: '+=10', duration: 1000, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 });

    const startText = this.add.text(width / 2, height - 100, 'PRESS SPACE TO RAID', {
      fontFamily: 'Pirata One', fontSize: '36px', color: '#ffffff'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: startText, alpha: 0.1, duration: 600, ease: 'Sine.easeInOut', yoyo: true, repeat: -1
    });

    this.input.keyboard.once('keydown-SPACE', () => {
      this.cameras.main.shake(300, 0.05);
      this.cameras.main.flash(500, 255, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.start('GameScene', { dragonType: this.selectedDragon });
      });
    });
  }
}
