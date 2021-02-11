import { Room, Client } from 'colyseus'
import { LudoGameState } from './schema/LudoGameState'
import { ClientMessage } from '../../types/ClientMessage'
import randomInt from '../../shared/math/random'
import { ServerMessage } from '../../types/ServerMessage'

export class LudoGame extends Room<LudoGameState> {
  onCreate(options: any) {
    this.setState(new LudoGameState())

    this.onMessage('keydown', (client, message) => {
      this.broadcast('keydown', message, {
        except: client,
      })
    })

    this.onMessage(ClientMessage.DiceRoll, (client) => {
      const value = randomInt(1, 7)
      this.state.lastDiceValue = value
      this.broadcast(ServerMessage.DiceRollResult, { value })
    })
  }

  onJoin(client: Client, options: any) {}

  onLeave(client: Client, consented: boolean) {}

  onDispose() {}
}
