import type { NextPage } from 'next'
import Image from 'next/image'
import { MainLayout } from '../layouts'
import MainImage from '~/assets/main-image.svg'
import Typed from 'react-typed'
import { Fragment, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { Step } from '~/components/common/step'
import { useStep } from '~/hooks/useStep'
import { Button, ButtonLink } from '~/components/common'
import classNames from 'classnames'

const rule = `1. 상대방을 **존중**을 바탕으로 **음성과 챗**을 사용해주세요

2. 대화 중 **불편한 사항**이 생겼을 경우 당사자와 **'개인' 디엠**으로 이야기하거나 **관리진**에게 이야기 해주세요.

3. 다음과 같은 글은 **!무통보 삭제**될 수 있어요.
-18금이다 싶은 폭력적인 묘사나 선정적인 묘사
-정치적이나, 자살 등의 민감한 주제
-채널 성격에 안맞는 게시물
-겔러리 내에 미완성 되었거나 타인의 작품

4. 저희 서버는 연구원간의 **친목을 지지**하나, 이는 모든 연구원들과의 친목을 의미하고 **!과도한 친목에 대해서는 지양**해요. 과도한 친목은 아래의 기준으로 명시해요.
 - 음슴체
 - 통화방에 본인포함 3명 이상 있을때 사용되는 반말
 - 서로간의 교류가 아닌 이성적인 만남 및 친분을 목적으로 하는 상대가 불쾌할 수 있는 의도가 다분한 접근
 - 특정인을 과도한 맨션이나 관심을 주는 행동
 - 특정인과 더 친하다 하여 무리를 형성하는 것

5. 타인의 작품을 **!무단도용하면 밴**입니다. 2차 창작이나 모작은 **출처를 명시**해 주세요.

6. **!비매너 행위는 경고 혹은 밴**으로 이어질 수 있어요. 저희 서버는 비매너를 아래와 같이 정의하고 있어요.
-동의 없는 반말 및 음슴체
-타인 배척
-자살, 정치적 발언 등의 민감한 주제
-타인 작품에 대한 비방
-타인 비방
-동의 없는 피드백
-지나친 신상요구
-작업 방해
-과한 욕설
-서버 위화감 조성
-타인의 말을 계속 끊으려는 시도
-타인 동의 없이 통화방에서 트위치, 아프리카 등으로 외부 방송송출
-그 외 관리자 판단되는 비매너 행위

7. 끝없이 무거울 것 같은 우울감에 대한 이야기는 저희 서버에서 권장하지 않는 방향으로 하지만, 상담을 '들어주고' 싶은 사람이 있다면 개인DM으로 대화를 이어가도 돼요.

8. **크랙**을 권하거나 옹호하는 발언은 **!하지 마세요**.

9. 돈으로 인한 사고를 방지하기 위해 아래와 같은 **!항목을 금지**해요.
-금품 갈취
-구걸
-무분별한 광고
-열정페이 요구
-관리자 동의 없는 무료나눔
-불법으로 의심되는 거래
(자세한 건 아래의 커미션 규칙을 확인해주세요)

10. **피드백**을 해줄 때는 아래와 같은 내용을 **지켜**주세요. 
-피드백은 요청할 때만 해주시고 서로 예의를 지켜주세요.
-피드백의 목적은 작품에 대한 발전이에요. 비난과 헷갈리지 마세요.

11. **!스팸은 절대로 금지**되었어요.
-상대가 원하지 않았는데 주는 타 서버 링크 및 홍보물
-무단으로 하는 커미션 요청
-인원 늘리기용으로 하는 서버 연합 요청

12. **부계정은 오케이**에요. 다만 들어오실때 누구의 **부계인지를 명시**해 주시고 부계로 인한 여론 조작은 하지 마세요. 또한 부계정이 밴이면 본계정도 밴입니다. 

13. 경고 누적으로 인한 **신고자**를 찾거나 **보복**을 하는 행위는 무조건 **!차단** 조치입니다.

14. 규칙의 **!허점을 악용**하거나 **!관리진을 시험**하지 마세요.

15. 그 외에 관리자가 판단하에 **!문제가 되는 행동들도 제재**합니다.

---> 규칙 어길 시에는 1,2차 경고 3차 밴이지만 특이사항으로 밴을 받을 수도 있습니다.

※자세한 사항은 관리자에게 문의하세요※`

const Signup: NextPage = () => {
  const router = useRouter()
  const { step, handleStep, stepAble } = useStep(4)

  const content = useMemo(() => {
    switch (step) {
      case 1:
        return (
          <div className="mx-auto px-4 text-center md:px-10 lg:px-32 xl:max-w-3xl h-full items-center flex flex-col justify-center">
            <div className="flex flex-col items-center">
              <h1 className="text-4xl font-bold leading-none sm:text-5xl">
                <span className="dark:text-green-400">아이디어스랩</span>에<br /> 오신것을
                환영합니다!
              </h1>
              <p className="px-8 mt-8 mb-12 text-lg">
                오래 걸리지 않아요! 간단하게 질문에 대답해주세요.
              </p>
            </div>
          </div>
        )
      case 2:
        return (
          <div>
            <div>아이디어스랩 서버를 이용하기 위해서는 약관 동의가 필요해요</div>
            <div className="flex justify-between mt-2 items-center">
              <div className="text-3xl font-bold mt-4 mb-2">이용약관</div>
              <ButtonLink href="#">전문 보기</ButtonLink>
            </div>
            <div className="w-full px-1.5 py-1 bg-gray-100 dark:bg-gray-800 border-base-color border-2 rounded-lg mx-1">
              1. Lorem ipsum... <br />
              2. Lorem ipsum... <br />
              3. Lorem ipsum... <br />
              4. Lorem ipsum... <br />
            </div>
            <div className="flex justify-between mt-2 items-center">
              <div className="text-3xl font-bold mt-4 mb-2">개인정보 처리방침</div>
              <ButtonLink href="#">전문 보기</ButtonLink>
            </div>
            <div className="w-full px-1.5 py-1 bg-gray-100 dark:bg-gray-800 border-base-color border-2 rounded-lg mx-1">
              1. Lorem ipsum... <br />
              2. Lorem ipsum... <br />
              3. Lorem ipsum... <br />
              4. Lorem ipsum... <br />
            </div>
          </div>
        )
      case 3:
        return (
          <div>
            <div>디스코드 서버를 이용하면서, 아래 내용은 반드시 지켜주세요!</div>
            <div className="flex justify-between mt-2 items-center">
              <div className="text-3xl font-bold mt-4 mb-2">서버 규칙</div>
            </div>
            <div className="w-full px-1.5 py-1 bg-gray-100 dark:bg-gray-800 border-base-color border-2 rounded-lg mx-1">
              {rule.split('\n').map((line, i) => (
                <span key={i} className={classNames(!isNaN(line.charAt(0) as any) && 'font-bold')}>
                  {line.split('**').map((text, i) => {
                    if (i % 2 === 0) return <Fragment key={i}>{text}</Fragment>
                    if (text.startsWith('!')) {
                      return (
                        <span className="font-bold title-highlight-red" key={i}>
                          {text.substring(1)}
                        </span>
                      )
                    }
                    return (
                      <span className="font-bold title-highlight" key={i}>
                        {text}
                      </span>
                    )
                  })}
                  <br />
                </span>
              ))}
            </div>
          </div>
        )
      case 4:
        return <div>자기소개를 남겨주세요!</div>
      case 5:
        return (
          <div className="mx-auto flex flex-col items-center px-4 py-16 text-center md:py-32 md:px-10 lg:px-32 xl:max-w-3xl">
            <h1 className="text-4xl font-bold leading-none sm:text-5xl">마지막 단계!</h1>
            <p className="px-8 mt-8 mb-12 text-lg">
              자동 가입을 방지하기 위해, 캡차를 인증해주세요.
            </p>
          </div>
        )
      case 6:
        return <div>모든 가입 과정이 완료되었어요.</div>
    }
  }, [step])

  return (
    <MainLayout title="회원가입 하기" showTitle tinyContainer>
      <Step
        className="mt-2"
        currentStep={step}
        list={[
          '1. 아이디어스 랩에 오신것을 환영합니다!',
          '2. 약관동의',
          '3. 이용 규칙',
          '4. 자기소개 입력',
          '5. 삐릭, 삐리릭?',
          '6. 가입완료',
        ]}
      />
      <div className="card px-4 py-4 mt-8 flex flex-col justify-between sm:min-h-[700px]">
        <div className="h-full">{content}</div>
        <div className="flex justify-between w-full mt-4">
          {stepAble.prev ? (
            <Button variant="default" onClick={handleStep.prev}>
              이전 단계
            </Button>
          ) : (
            <div></div>
          )}
          <Button variant="primary" onClick={handleStep.next}>
            {step === 1 ? '시작하기' : step === 2 ? '약관에 동의합니다' : '다음 단계'}
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}

export default Signup
