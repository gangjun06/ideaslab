import { useMemo, useState } from 'react'
import type { NextPage } from 'next'
import { LightBulbIcon } from '@heroicons/react/24/outline'
import { CalendarDatum, CalendarTooltipProps, ResponsiveCalendar } from '@nivo/calendar'
import classNames from 'classnames'

import { Select } from '~/components/form'
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
  const [start, setStart] = useState<string>('2023-1')

  const { startYear, startMonth } = useMemo(() => {
    const splited = start.split('-')
    return { startYear: parseInt(splited[0]), startMonth: parseInt(splited[1]) }
  }, [start])

  const { data, isLoading } = trpc.statistics.voiceLog.useQuery({
    startYear,
    startMonth,
    endYear: 2023,
    endMonth: 12,
  })

  const datum: CalendarDatum[] = useMemo(() => {
    return (
      data?.map(({ sum, time }) => ({
        day: `${time.getFullYear()}-${String(time.getMonth() + 1).padStart(
          2,
          '0',
        )}-${time.getDate()}`,
        value: Math.floor(sum / 60),
      })) ?? []
    )
  }, [data])

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
          <Select
            options={[
              { label: '2023년 1월', value: '2023-1' },
              { label: '2023년 2월', value: '2023-2' },
            ]}
            value={start}
            onChange={(value) => {
              setStart(value as string)
            }}
          />
        </div>
        <div className="mt-2 h-44">
          <ResponsiveCalendar
            data={datum}
            tooltip={CustomTooltip}
            from="2023-01-01"
            to="2023-12-31"
            emptyColor="#eeeeee"
            colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            yearLegend={() => ''}
            monthBorderWidth={2}
            yearSpacing={30}
            maxValue={300}
            monthBorderColor="#ffffff"
            dayBorderColor="#ffffff"
            valueFormat={(value) => formatMinutes(value)}
            monthLegend={(_year, _month, date) =>
              Intl.DateTimeFormat('ko', { month: 'long' }).format(date)
            }
            legendFormat={(value) => formatMinutes(value)}
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                translateY: 0,
                itemCount: 4,
                itemWidth: 30,
                itemHeight: 36,
                itemsSpacing: 70,
                itemDirection: 'right-to-left',
                data: [{ id: 60, label: '1시간' }],
              },
            ]}
          />
        </div>
      </div>
    </>
  )
}

export default StatisticsPage
