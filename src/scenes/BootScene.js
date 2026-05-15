import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    const dragonShape = [
      "          333           ",
      "         35253          ",
      "        3312133         ",
      "  333    33233    333   ",
      " 322333   323   333223  ",
      " 32442233 323 33224423  ",
      "32444442231213224444423 ",
      "34433444423232444433443 ",
      "343  3444412144443  343 ",
      "33   3444432344443   33 ",
      "     3444432344443      ",
      "    344443121344443     ",
      "    34443 323 34443     ",
      "    3443  323  3443     ",
      "     33   323   33      ",
      "          313           ",
      "          323           ",
      "          3233          ",
      "          31333         ",
      "           3353         ",
      "             353        ",
      "              3         ",
      "                        "
    ];

    const wyvernShape = [
      "          353           ",
      "         31213          ",
      "  33     31513     33   ",
      " 32233    323    33223  ",
      " 3442233 33233 3322443  ",
      "34444422331513322444443 ",
      "34444444223232244444443 ",
      "34444444421512444444443 ",
      "34433444443234444433443 ",
      "343  3344415144433  343 ",
      "33     344323443     33 ",
      "        3415143         ",
      "         33233          ",
      "          353           ",
      "         33233          ",
      "         31513          ",
      "         33233          ",
      "           353          ",
      "           313          ",
      "            353         ",
      "            313         ",
      "             353        ",
      "              3         "
    ];

    const serpentShape = [
      "          333           ",
      "         32523          ",
      "        3312133         ",
      "       353323353        ",
      "        3 323 3         ",
      "         31213          ",
      "     33  33233  33      ",
      "    32233 323 33223     ",
      "    344223121322443     ",
      "     3344332334433      ",
      "       33 323 33        ",
      "         31213          ",
      "         33233          ",
      "        31213           ",
      "       33233            ",
      "      31213             ",
      "      33233  33         ",
      "     31213 33223        ",
      "      3233322443        ",
      "       32133443         ",
      "        321333          ",
      "         3213           ",
      "          3213          ",
      "           3353         "
    ];

    this.createPixelArt('dragon_fire', dragonShape, {
      '1': 0x660000, '2': 0xbb0000, '3': 0x220000, '4': 0xaa4400, '5': 0xffcc00
    }, 2);
    
    this.createPixelArt('dragon_ice', wyvernShape, {
      '1': 0x003366, '2': 0x0066bb, '3': 0x000033, '4': 0x66ccff, '5': 0xffffff
    }, 2);
    
    this.createPixelArt('dragon_acid', serpentShape, {
      '1': 0x004400, '2': 0x338800, '3': 0x001100, '4': 0x88ff00, '5': 0xccff00
    }, 2);

    const vikingPalette = {
      '1': 0x3d2314, '2': 0x5c3a21, '3': 0x8a5a31, '4': 0x222222, '5': 0x990000
    };
    const vikingShape = [
      "                                ",
      "               11               ",
      "              1221              ",
      "              1221              ",
      "             122221             ",
      "            12233221            ",
      "           1223333221           ",
      "          122333333221          ",
      "          123333333321          ",
      "         12333333333321         ",
      "         12333333333321         ",
      "        1233333333333321        ",
      "       142333333333333241       ",
      "       152333333333333251       ",
      "       142333333333333241       ",
      "       152333333333333251       ",
      "       142333333333333241       ",
      "       152333333333333251       ",
      "       142333333333333241       ",
      "        1233333333333321        ",
      "         12333333333321         ",
      "         12333333333321         ",
      "          123333333321          ",
      "          122333333221          ",
      "           1223333221           ",
      "            12233221            ",
      "             122221             ",
      "              1221              ",
      "               11               ",
      "                                ",
      "                                ",
      "                                "
    ];
    this.createPixelArt('viking_ship', vikingShape, vikingPalette, 2);

    const griffinPalette = {
      '1': 0x4a2a11, '2': 0x8a5a31, '3': 0x888888, '4': 0xffffff, '5': 0xffcc00, '6': 0x111111
    };
    const griffinUp = [
      "            66666               ",
      "           6444446              ",
      "          644644446             ",
      "          644444446             ",
      "         64444444446            ",
      "         644444455556           ",
      "        6444444445556           ",
      " 666    622222222446    666     ",
      "64446  6222111122226  64446     ",
      "644446 6211111111226 644446     ",
      " 6444466211111111226644446      ",
      "  64444621111111122644446       ",
      "  64444421111111122444446       ",
      "   644442111111112244446        ",
      "    6444211111111224446         ",
      "    6444211111111224446         ",
      "     64421111111122446          ",
      "     64421111111122446          ",
      "      642111111112246           ",
      "       6211111111226            ",
      "       6211111111226            ",
      "       655111111556             ",
      "        6661111666              ",
      "          611116                ",
      "          611116                ",
      "           6116                 ",
      "           6116                 ",
      "            66                  ",
      "                                ",
      "                                ",
      "                                ",
      "                                "
    ];
    const griffinDown = [
      "            66666               ",
      "           6444446              ",
      "          644644446             ",
      "          644444446             ",
      "         64444444446            ",
      "         644444455556           ",
      "        6444444445556           ",
      "        622222222446            ",
      "       6222111122226            ",
      "    6666211111111226666         ",
      "   644462111111112264446        ",
      "  64444621111111122644446       ",
      " 6444444211111111224444446      ",
      "644444442111111112244444446     ",
      "644444442111111112244444446     ",
      " 6666666211111111226666666      ",
      "        611111111226            ",
      "        611111111226            ",
      "        611111111226            ",
      "       6211111111226            ",
      "       6211111111226            ",
      "       655111111556             ",
      "        6661111666              ",
      "          611116                ",
      "          611116                ",
      "           6116                 ",
      "           6116                 ",
      "            66                  ",
      "                                ",
      "                                ",
      "                                ",
      "                                "
    ];
    this.createPixelArt('griffin_1', griffinUp, griffinPalette, 2);
    this.createPixelArt('griffin_2', griffinDown, griffinPalette, 2);

    const harpyPalette = {
      '1': 0x8a5a31, '2': 0x5c3a21, '3': 0x3d2314, '4': 0xffffff, '5': 0xffcc00, '6': 0x222222
    };
    const harpyShape = [
      "          66666          ",
      "         6444446         ",
      "        644644446        ",
      "       64444444446       ",
      "      644444455556       ",
      "     6444444445556       ",
      "    62222222224446       ",
      "   622211112222446       ",
      "  6211111111222446       ",
      " 62111111111122246       ",
      " 62111111111122246       ",
      "  6211111111222446       ",
      "   622211112222446       ",
      "    62222222224446       ",
      "     6444444445556       ",
      "      644444455556       ",
      "       64444444446       ",
      "        644644446        ",
      "         6444446         ",
      "          66666          ",
      "           666           ",
      "            6            "
    ];
    this.createPixelArt('harpy', harpyShape, harpyPalette, 2);

    const terrG = this.add.graphics();
    terrG.fillStyle(0x2a1a10, 1);
    terrG.fillRect(0, 0, 64, 64);
    for (let i = 0; i < 400; i++) {
      let x = Phaser.Math.Between(0, 63);
      let y = Phaser.Math.Between(0, 63);
      let rand = Math.random();
      if (rand < 0.5) {
        terrG.fillStyle(Math.random() > 0.5 ? 0x2c3e1f : 0x1e2b15, 1);
        terrG.fillRect(x, y, Phaser.Math.Between(2, 6), Phaser.Math.Between(2, 6));
      } else if (rand < 0.8) {
        terrG.fillStyle(Math.random() > 0.5 ? 0x666666 : 0x444444, 1);
        let s = Phaser.Math.Between(3, 8);
        terrG.fillRect(x, y, s, s);
        terrG.fillStyle(0x888888, 1);
        terrG.fillRect(x, y, 2, 2);
      } else {
        terrG.fillStyle(0x3c2a21, 1);
        terrG.fillRect(x, y, 4, 4);
      }
    }
    terrG.generateTexture('obstacle', 64, 64);
    terrG.destroy();

    const gateG = this.add.graphics();
    gateG.fillStyle(0x222222, 1);
    gateG.fillRect(0, 0, 64, 64);
    for (let y = 0; y < 64; y += 16) {
      let offset = (y % 32 === 0) ? 0 : -16;
      for (let x = offset; x < 64; x += 32) {
        gateG.fillStyle(0x444444, 1);
        gateG.fillRect(x + 1, y + 1, 30, 14);
        gateG.fillStyle(0x666666, 1);
        gateG.fillRect(x + 1, y + 1, 30, 2);
        gateG.fillRect(x + 1, y + 1, 2, 14);
        gateG.fillStyle(0x333333, 1);
        gateG.fillRect(x + 1, y + 13, 30, 2);
      }
    }
    
    // Wooden Door (Centro)
    gateG.fillStyle(0x5c3a21, 1);
    gateG.fillRect(16, 20, 32, 44);
    gateG.fillStyle(0x3d2314, 1);
    gateG.fillRect(16, 20, 2, 44);
    gateG.fillRect(31, 20, 2, 44);
    gateG.fillRect(46, 20, 2, 44);
    
    // Red Towers (Pontas)
    gateG.fillStyle(0xaa0000, 1);
    gateG.fillTriangle(0, 20, 8, 0, 16, 20);
    gateG.fillTriangle(48, 20, 56, 0, 64, 20);

    for (let i = 0; i < 40; i++) {
        gateG.fillStyle(0x2c3e1f, 0.8);
        gateG.fillRect(Phaser.Math.Between(0, 64), Phaser.Math.Between(0, 64), Phaser.Math.Between(4, 10), Phaser.Math.Between(4, 10));
    }
    gateG.generateTexture('gate', 64, 64);
    gateG.destroy();

    this.createPixelArt('mana', [
      "  11  ",
      " 1221 ",
      "123321",
      "123321",
      " 1221 ",
      "  11  "
    ], {
      '1': 0x4B0082, 
      '2': 0x9370DB, 
      '3': 0xE6E6FA  
    }, 4);

    this.createPixelArt('fireball', [
      " 11 ",
      "1221",
      "1331",
      " 11 "
    ], {
      '1': 0x881100,
      '2': 0xFF4400,
      '3': 0xFFFF00
    }, 4);

    const riverG = this.add.graphics();
    riverG.fillStyle(0x0a1525, 1); 
    riverG.fillRect(0, 0, 128, 128); 
    for (let i = 0; i < 80; i++) {
        riverG.fillStyle(Math.random() > 0.5 ? 0x102035 : 0x1a3045, Math.random() * 0.6 + 0.2);
        riverG.fillRoundedRect(Phaser.Math.Between(0, 128), Phaser.Math.Between(0, 128), Phaser.Math.Between(10, 40), Phaser.Math.Between(2, 6), 2);
    }
    riverG.generateTexture('riverBg', 128, 128);
    riverG.destroy();

    const fogG = this.add.graphics();
    fogG.fillStyle(0x222233, 0.4);
    fogG.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 40; i++) {
        fogG.fillStyle(0x333344, Math.random() * 0.3);
        fogG.fillCircle(Phaser.Math.Between(0, 128), Phaser.Math.Between(0, 128), Phaser.Math.Between(10, 30));
    }
    fogG.generateTexture('fog', 128, 128);
    fogG.destroy();

    const partG = this.add.graphics();
    partG.fillStyle(0xff8800, 1);
    partG.fillCircle(4, 4, 4);
    partG.generateTexture('spark', 8, 8);
    partG.clear();
    partG.fillStyle(0xaa0000, 1);
    partG.fillCircle(4, 4, 4);
    partG.generateTexture('blood', 8, 8);
    partG.destroy();

    let loadingText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Invocando Trevas...', { fontFamily: 'Pirata One', fontSize: '40px', fill: '#bb0000' });
    loadingText.setOrigin(0.5, 0.5);
  }

  createPixelArt(key, data, palette, pixelSize = 2) {
    const width = data[0].length * pixelSize;
    const height = data.length * pixelSize;
    
    const graphics = this.add.graphics();
    
    for (let y = 0; y < data.length; y++) {
      for (let x = 0; x < data[y].length; x++) {
        const char = data[y][x];
        if (char !== ' ') {
          graphics.fillStyle(palette[char], 1);
          graphics.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
      }
    }
    
    graphics.generateTexture(key, width, height);
    graphics.destroy();
  }

  create() {
    this.anims.create({
      key: 'griffin_fly',
      frames: [
        { key: 'griffin_1' },
        { key: 'griffin_2' }
      ],
      frameRate: 10,
      repeat: -1
    });

    this.scene.start('MenuScene');
  }
}
