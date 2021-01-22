import Phaser from 'phaser'

import Game from './scenes/Game'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 700,
  height: 700,
  physics: {
    default: 'arcade',
  },
  scene: [Game],
}

export default new Phaser.Game(config)
