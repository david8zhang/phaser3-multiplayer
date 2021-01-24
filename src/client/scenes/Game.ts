import 'regenerator-runtime/runtime'
import Phaser from 'phaser'
import * as Colyseus from 'colyseus.js'
import { ILudoGameState } from '../../types/ILudoGameState'
import StateMachine from '../../shared/statemachine/StateMachine'
import { ClientMessage } from '../../types/ClientMessage'
import { ServerMessage } from '../../types/ServerMessage'

const pieceOffsets = [
  { x: 250, y: 156 },
  { x: 166, y: 156 },
  { x: 250, y: 250 },
  { x: 166, y: 250 },
]

const dicePositions = [
  { x: 40, y: 660 },
  { x: 660, y: 660 },
  { x: 40, y: 40 },
  { x: 660, y: 40 },
]

export default class Game extends Phaser.Scene {
  private client!: Colyseus.Client
  private stateMachine!: StateMachine

  private diceRollAnimationAccumulator = 0
  private dice!: Phaser.GameObjects.Sprite

  private room!: Colyseus.Room<ILudoGameState>

  constructor() {
    super('hello-world')
  }

  init() {
    this.client = new Colyseus.Client('ws://localhost:2567')
    this.stateMachine = new StateMachine(this, 'game')
    this.stateMachine
      .addState('idle')
      .addState('dice-roll', {
        onEnter: this.handleDiceRollEnter,
        onUpdate: this.handleDiceRollUpdate,
      })
      .addState('dice-roll-finish', {
        onEnter: this.handleDiceRollFinishEnter,
      })
      .setState('idle')
  }

  preload() {
    this.load.image('board', 'assets/board.png')
    this.load.image('blue-piece', 'assets/pieces/piece-blue.png')
    this.load.image('green-piece', 'assets/pieces/piece-green.png')
    this.load.image('red-piece', 'assets/pieces/piece-red.png')
    this.load.image('yellow-piece', 'assets/pieces/piece-yellow.png')

    for (let i = 1; i <= 6; i++) {
      this.load.image(`dice-image-${i}`, `assets/dice/dieRed_border${i}.png`)
    }
  }

  async create() {
    const { width, height } = this.scale
    const centerX = width * 0.5
    const centerY = height * 0.5
    const board = this.add.image(centerX, centerY, 'board')
    board.setDisplaySize(width, height)

    this.room = await this.client.joinOrCreate<ILudoGameState>('ludo')

    this.room.onStateChange.once((state) => {
      this.handleInitialState(state, centerX, centerY)
    })

    this.dice = this.add.sprite(
      dicePositions[0].x,
      dicePositions[0].y,
      'dice-image-4'
    )

    this.input.keyboard.on('keyup-SPACE', (evt) => {
      this.stateMachine.setState('dice-roll')
    })
  }

  update(t: number, dt: number) {
    this.stateMachine.update(dt)
  }

  private handleDiceRollEnter() {
    this.room.send(ClientMessage.DiceRoll)

    const value = Phaser.Math.Between(1, 6)
    this.dice.setTexture(`dice-image-${value}`)
    this.room.state.onChange = (changes) => {
      changes.forEach((change) => {
        if (change.field !== 'lastDiceValue') {
          return
        }
        this.room.state.onChange = undefined
        this.time.delayedCall(500, () => {
          this.stateMachine.setState('dice-roll-finish')
        })
      })
    }
  }

  private handleDiceRollUpdate(dt: number) {
    this.diceRollAnimationAccumulator += dt
    if (this.diceRollAnimationAccumulator >= 100) {
      const value = Phaser.Math.Between(1, 6)
      this.dice.setTexture(`dice-image-${value}`)
      this.diceRollAnimationAccumulator = 0
    }
  }

  private handleDiceRollFinishEnter() {
    this.dice.setTexture(`dice-image-${this.room.state.lastDiceValue}`)
  }

  private handleInitialState(
    state: ILudoGameState,
    centerX: number,
    centerY: number
  ) {
    state.playerStates.forEach((playerState, playerIndex) => {
      playerState.piecesInYard.forEach((piece, pieceIndex) => {
        const offset = pieceOffsets[pieceIndex]
        switch (playerIndex) {
          case 0:
            this.add.image(centerX - offset.x, centerY + offset.y, 'blue-piece')
            break
          case 1:
            this.add.image(centerX - offset.x, centerY - offset.y, 'red-piece')
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
  }
}
