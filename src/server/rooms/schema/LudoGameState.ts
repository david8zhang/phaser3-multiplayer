import { Schema, type, ArraySchema } from '@colyseus/schema'
import {
  IPieceState,
  IPlayerState,
  ILudoGameState,
} from '../../../types/ILudoGameState'

class PieceState extends Schema implements IPieceState {
  @type('number')
  x = 0

  @type('number')
  y = 0
}

class PlayerState extends Schema implements IPlayerState {
  // @type('string')
  // id: string

  @type([PieceState])
  piecesInYard: PieceState[]

  @type([PieceState])
  piecesOnBoard: PieceState[]

  constructor() {
    super()
    // this.id = id
    this.piecesInYard = new ArraySchema()
    this.piecesOnBoard = new ArraySchema()

    for (let i = 0; i < 4; i++) {
      this.piecesInYard.push(new PieceState())
    }
  }
}

export class LudoGameState extends Schema implements ILudoGameState {
  @type([PlayerState])
  playerStates: PlayerState[]

  @type('number')
  lastDiceValue = 0

  @type('number')
  numRoll = 0

  constructor() {
    super()
    this.playerStates = new ArraySchema()

    for (let i = 0; i < 4; i++) {
      this.playerStates.push(new PlayerState())
    }
  }
}
