//@ts-nocheck
import { Client } from 'discord.js'

let discord: Client

const newClient = async () => {
  const client = new Client({
    intents: [130815],
  })
  discord = client
  global.discord = client

  client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`)
  })

  await client.login(process.env.BOT_TOKEN)
  const guilds = await client.guilds.fetch(process.env.SERVER_ID)
}

;(async () => {
  if (typeof window === 'undefined') {
    if (process.env.NODE_ENV === 'production') {
      await newClient()
    } else {
      if (!global.discord) {
        await newClient()
      }
      discord = global.discord
    }
  }
})()

export default discord
