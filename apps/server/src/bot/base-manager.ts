import BotClient from './client'

export default class BaseManager {
  public client: BotClient

  constructor(client: BotClient) {
    this.client = client
  }
}
