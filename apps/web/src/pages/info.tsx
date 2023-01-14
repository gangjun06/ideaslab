import { ReactMarkdown } from 'react-markdown/lib/react-markdown'

import { MainLayout } from '~/layouts'
import { trpc } from '~/utils'

const InfoPage = () => {
  const { data: info } = trpc.info.serviceInfo.useQuery(undefined, {
    trpc: { ssr: true },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return (
    <MainLayout
      title="아이디어스랩 정보"
      description="아이디어스랩에 관련된 정보입니다"
      showTitle
      tinyContainer
    >
      <ReactMarkdown className="markdown">{info ?? ''}</ReactMarkdown>
    </MainLayout>
  )
}

export default InfoPage
