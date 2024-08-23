import ErrorManager from '../base/error-manager'
import { Event } from '../base/event'

export default new Event('error', async (client, error) => {
  const errorManager = new ErrorManager(client)

  errorManager.report(error, {
    isSend: false,
  })
})
