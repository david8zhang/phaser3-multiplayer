import 'regenerator-runtime/runtime'
import Phaser from 'phaser'
import * as Colyseus from 'colyseus.js'
import { ILudoGameState } from '../../types/ILudoGameState'

const pieceOffsets = [
  { x: 250, y: 156 },
  { x: 166, y: 156 },
  { x: 250, y: 250 },
  { x: 166, y: 250 },
]

export default class Game extends Phaser.Scene {
  private client!: Colyseus.Client

  constructor() {
    super('hello-world')
  }

  init() {
    this.client = new Colyseus.Client('ws://localhost:2567')
  }

  preload() {
    this.load.image('board', 'assets/board.png')
    this.load.image('blue-piece', 'assets/pieces/piece-blue.png')
    this.load.image('green-piece', 'assets/pieces/piece-green.png')
    this.load.image('red-piece', 'assets/pieces/piece-red.png')
    this.load.image('yellow-piece', 'assets/pieces/piece-yellow.png')
  }

  async create() {
    const { width, height } = this.scale
    const centerX = width * 0.5
    const centerY = height * 0.5
    const board = this.add.image(centerX, centerY, 'board')
    board.setDisplaySize(width, height)

    const room = await this.client.joinOrCreate<ILudoGameState>('ludo')

    room.onStateChange((state) => {
      state.playerStates.forEach((playerState, playerIndex) => {
        playerState.piecesInYard.forEach((piece, pieceIndex) => {
          const offset = pieceOffsets[pieceIndex]
          switch (playerIndex) {
            case 0:
              this.add.image(
                centerX - offset.x,
                centerY + offset.y,
                'blue-piece'
              )
              break
            case 1:
              this.add.image(
                centerX - offset.x,
                centerY - offset.y,
                'red-piece'
              )
            case 2:
              this.add.image(
                centerX + offset.x,
                centerY - offset.y,
                'green-piece'
              )
            case 3:
              this.add.image(
                centerX + offset.x,
                centerY + offset.y,
                'yellow-piece'
              )
            default:
              break
          }
        })
      })
    })
  }
}
