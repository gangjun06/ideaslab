const rtf = new Intl.RelativeTimeFormat('ko', { style: 'short', numeric: 'auto' })
const dtf = new Intl.DateTimeFormat('ko', { dateStyle: 'full', timeStyle: 'short' })
const dtfDateShort = new Intl.DateTimeFormat('ko', { dateStyle: 'short' })

export const relativeTimeFormat = (date: Date) => {
  const now = new Date()

  const differenceMinutes = (now.getTime() - date.getTime()) / (1000 * 60)

  if (differenceMinutes < 1) {
    return '방금 전'
  }

  if (differenceMinutes < 60) {
    return rtf.format(-Math.floor(differenceMinutes), 'minutes')
  }

  const differenceHours = differenceMinutes / 60
  if (differenceHours < 24) {
    return rtf.format(-Math.floor(differenceHours), 'hours')
  }

  const differenceDay = differenceHours / 24
  if (differenceDay < 31) {
    return rtf.format(-Math.floor(differenceDay), 'days')
  }

  const differenceMonth = differenceDay / 30.4
  if (differenceMonth < 12) {
    return rtf.format(-Math.floor(differenceMonth), 'month')
  }

  const differenceYear = differenceMonth / 12
  return rtf.format(-Math.floor(differenceYear), 'years')
}

export const fullTimeFormat = (date: Date) => {
  return dtf.format(date)
}

export const dateShortFormat = (date: Date) => {
  return dtfDateShort.format(date)
}

const dtfTimeShort = new Intl.DateTimeFormat('ko', { hour: 'numeric', minute: 'numeric' })
export const timeShortFormat = (date: Date) => {
  return dtfTimeShort.format(date)
}
