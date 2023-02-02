import { scheduleJob } from 'node-schedule'

import { saveMessageCounts } from './service/message-log'

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
}
