import BotClient from './client.js'

export default class BaseManager {
  public client: BotClient

  constructor(client: BotClient) {
    this.client = client
  }
}
