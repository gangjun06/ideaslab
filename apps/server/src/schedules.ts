import { scheduleJob } from 'node-schedule'

import { alertToNotVerifiedUser } from './service/auth'
import { saveMessageCounts } from './service/message-log'
import { pointService } from './service/point'

/*
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
*/

export const setupSchedule = () => {
  // At 1 minutes past the hour
  scheduleJob('1 * * * *', async () => {
    await saveMessageCounts()
  })

  // Every 10 minutes
  scheduleJob('*/10 * * * *', async () => {
    await alertToNotVerifiedUser()
  })

  scheduleJob('0 21 * * *', async () => {
    await pointService.eventWeek1()
  })
}
