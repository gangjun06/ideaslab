import { useMemo, useState } from 'react'
import type { NextPage } from 'next'
import { LightBulbIcon } from '@heroicons/react/24/outline'
import { CalendarTooltipProps } from '@nivo/calendar'
import classNames from 'classnames'
import { Tooltip, TooltipWrapper } from 'react-tooltip'

import { Select } from '~/components/form'
import { useResponsiveSize } from '~/hooks/useWindowe'
import { SettingLayout } from '~/layouts'
import { trpc } from '~/lib/trpc'

const StatisticsPage: NextPage = () => {
  return (
    <SettingLayout title="통계" guard="authOnly">
      <div className="space-y-4">
        <GuildActivity />
        <hr />
        <VoiceChat />
      </div>
    </SettingLayout>
  )
}

const ValueCard = ({
  name,
  value,
  className,
  footer,
}: {
  name: string
  value: string
  className?: string
  footer?: string
}) => (
  <div className={classNames('card px-4 py-3 flex items-center', className)}>
    <div className="flex flex-col">
      <div className="text-sm text-description-color">{name}</div>
      <div className="">{value}</div>
      {footer && <div className="text-xs text-description-color mt-1">{footer}</div>}
    </div>
  </div>
)

const GuildActivity = () => {
  return (
    <div className="grid grid-flow-row grid-cols-2 gap-4">
      <ValueCard
        className="border-t-blue-500 dark:border-t-blue-600 border-t-4"
        name="아이디어스 랩 가입일"
        value="2022. 01. 23. (D+N일)"
      />
      <ValueCard
        className="border-t-primary-500 dark:border-t-primary-600 border-t-4"
        name="아이디어스 랩과 함께한지"
        value="N일"
      />
    </div>
  )
}

const formatMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const minutesLeft = minutes % 60
  if (hours === 0) return `${minutesLeft}분`
  if (minutesLeft === 0) return `${hours}시간`
  return `${hours}시간 ${minutesLeft}분`
}

const CustomTooltip = (data: CalendarTooltipProps) => {
  if (data.value === undefined) return null
  return (
    <span style={{ color: data.color, backgroundColor: 'black', padding: '10px' }}>
      {data.day} : {data.value}
    </span>
  )
}

const VoiceChat = () => {
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const responsiveSize = useResponsiveSize()

  const { data, isLoading } = trpc.statistics.voiceLog.useQuery({
    startYear: year,
    startMonth: 1,
    endYear: year,
    endMonth: 12,
  })

  const formatedData = useMemo(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    const isLeapYear =
      (date.getFullYear() % 4 == 0 && date.getFullYear() % 100 != 0) ||
      date.getFullYear() % 400 == 0

    const dataMap: Record<string, number> =
      data?.reduce(
        (prev, { sum, time }) => ({
          ...prev,
          [`${time.getMonth()}${time.getDate()}`]: Math.floor(sum / 60),
        }),
        {},
      ) ?? {}

    const list = []
    const dayList = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    for (let i = 0; i < 12; i++) {
      date.setMonth(i)
      date.setDate(1)

      const monthList: (null | { dateStr: string; sum: number })[] = []
      monthList.push(...new Array(date.getDay()).fill(null))

      for (let j = 0; j < dayList[i]; j++) {
        const item = dataMap[`${i}${j + 1}`]
        const dateStr = Intl.DateTimeFormat('ko', {
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        }).format(new Date(`${year}-${i + 1}-${j + 1}`))

        if (item) monthList.push({ dateStr, sum: item })
        else monthList.push({ dateStr, sum: 0 })
      }
      list.push(monthList)
    }
    return list
  }, [data, year])

  return (
    <>
      <div className="flex card px-4 py-2 border-l-yellow-500 dark:border-l-yellow-600 border-l-4">
        <LightBulbIcon width={24} height={24} /> 아이디어스 랩 웹사이트 공개일인 2023년 1월 14일
        이후의 기록만 표시됩니다.
      </div>
      <div className="grid grid-flow-row grid-cols-2 gap-4">
        <ValueCard name="총 통화방 사용시간" value="N시간 M분" />
        <ValueCard name="오늘 통화방 사용시간" value="N시간 M분" />
      </div>
      <div className="card p-4">
        <div className="flex justify-between items-center">
          <div className="text-lg text-title-color">통화방 사용 통계</div>
          <div className="w-32">
            <Select
              options={[{ label: '2023년', value: 2023 }]}
              value={year}
              onChange={(value) => {
                setYear(value as number)
              }}
            />
          </div>
        </div>
        <div className="mt-2">
          <Tooltip id="calendar-tooltip" className="tooltip" />
          <div className="grid grid-cols-3 sm:grid-cols-4 grid-flow-row gap-5 w-full px-4">
            {formatedData.map((monthData, month) => (
              <div key={month} className="flex flex-col gap-y-1 items-center justify-center w-full">
                <div
                  className={classNames('text-subtitle-color text-sm', month % 6 === 0 && 'ml-3')}
                >
                  {month + 1}월
                </div>
                <div className="flex flex-row gap-x-1 items-center justify-center">
                  <div
                    className="grid grid-flow-col gap-1"
                    style={{ gridTemplateRows: 'repeat(7, minmax(0, 1fr))' }}
                  >
                    {(responsiveSize === 'xs' ? month % 3 === 0 : month % 4 === 0) && (
                      <>
                        {['', '월', '', '수', '', '금', ''].map((item, index) => (
                          <div className="h-4 text-sm text-description-color pr-1" key={index}>
                            {item}
                          </div>
                        ))}
                      </>
                    )}
                    {monthData.map((data, index) => {
                      if (data === null)
                        return <div key={index} className="rounded-sm h-4 w-4"></div>
                      const { sum, dateStr } = data
                      return (
                        <TooltipWrapper
                          tooltipId="calendar-tooltip"
                          html={`<b>${dateStr}</b>${sum > 0 ? ` ${formatMinutes(sum)}` : ''}`}
                          key={index}
                        >
                          <div
                            className={classNames('rounded-sm h-4 w-4', {
                              'bg-gray-200 dark:bg-gray-700': sum < 1,
                              'bg-primary-100 dark:bg-primary-900': sum >= 1 && sum < 10,
                              'bg-primary-200 dark:bg-primary-800': sum >= 10 && sum < 30,
                              'bg-primary-300 dark:bg-primary-700': sum >= 30 && sum < 60,
                              'bg-primary-400 dark:bg-primary-600': sum >= 60 && sum < 120,
                              'bg-primary-500 dark:bg-primary-500': sum >= 120 && sum < 180,
                              'bg-primary-600 dark:bg-primary-400': sum >= 180 && sum < 300,
                              'bg-primary-700 dark:bg-primary-300': sum >= 300,
                            })}
                          />
                        </TooltipWrapper>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default StatisticsPage
