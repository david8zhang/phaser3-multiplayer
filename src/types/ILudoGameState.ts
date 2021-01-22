export interface IPieceState {
  x: number
  y: number
}

export interface IPlayerState {
  piecesInYard: IPieceState[]
  piecesOnBoard: IPieceState[]
}

export interface ILudoGameState {
  playerStates: IPlayerState[]
}
