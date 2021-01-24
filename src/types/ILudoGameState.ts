import { Schema } from '@colyseus/schema'

export interface IPieceState {
  x: number
  y: number
}

export interface IPlayerState extends Schema {
  piecesInYard: IPieceState[]
  piecesOnBoard: IPieceState[]
}

export interface ILudoGameState extends Schema {
  playerStates: IPlayerState[]
  lastDiceValue: number
}
