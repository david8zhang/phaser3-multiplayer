import { Room, Client } from 'colyseus'
import { LudoGameState } from './schema/LudoGameState'

export class LudoGame extends Room {
  onCreate(options: any) {
    this.setState(new LudoGameState())

    this.onMessage('keydown', (client, message) => {
      this.broadcast('keydown', message, {
        except: client,
      })
    })
  }

  onJoin(client: Client, options: any) {}

  onLeave(client: Client, consented: boolean) {}

  onDispose() {}
}
