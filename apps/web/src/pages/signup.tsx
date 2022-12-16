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
import { Button, ButtonLink, GripVerticalIcon } from '~/components/common'
import classNames from 'classnames'
import { Input, Select } from '~/components/form'
import { Textarea } from '~/components/form/textarea'
import { FormBlock } from '~/components/form/form-block'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { Control, useFieldArray } from 'react-hook-form'
import React from 'react'
import { serverRule } from '~/assets/rule'

const Signup: NextPage = () => {
  const { step, handleStep, stepAble } = useStep(4)

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
        <Content step={step} />
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

const Content = ({ step }: { step: number }) => {
  switch (step) {
    case 1:
      return (
        <div className="mx-auto px-4 text-center md:px-10 lg:px-32 xl:max-w-3xl h-full items-center flex flex-col justify-center flex-grow">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold leading-none sm:text-5xl">
              <span className="dark:text-green-400">아이디어스랩</span>에<br /> 오신것을 환영합니다!
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
            {serverRule.split('\n').map((line, i) => (
              <span key={i} className={classNames(line.match(/^[0-9]+/) && 'font-bold')}>
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
      return (
        <div className="flex flex-col gap-y-4">
          <div>자기소개를 남겨주세요!</div>
          <Input
            label="닉네임"
            description="아이디어스랩에서 사용하게 될 닉네임이에요. 알파벳, 한글, 숫자, 특수문자를 사용할 수 있어요"
          />
          <Input
            label="핸들"
            description="URL에서 사용될 id에요. https://ideaslab.kr/@id 와 같이 사용되어요. 언제든 변경할 수 있어요."
          />
          <Select
            label="가입경로"
            description="어떻게 아이디어스랩에 가입하게 되셨나요?"
            options={[
              { label: '디스보드', value: '디스보드' },
              { label: '지인 추천', value: '지인 추천' },
              { label: '인터넷 검색', value: '인터넷 검색' },
              { label: '기타', value: '기타' },
            ]}
          />
          <Textarea
            label="자기소개"
            description="간단하게 소개 문구를 입력해주세요!"
            placeholder="예시) 안녕하세요! 게임개발을 하고있는 ??라고 합니다."
          />
          <FormBlock
            label="링크"
            description="작업링크 / SNS 들을 연결할 수 있어요. 6개까지 입력 가능해요."
          >
            <div></div>
          </FormBlock>
        </div>
      )
    case 5:
      return (
        <div className="mx-auto flex flex-col items-center px-4 py-16 text-center md:py-32 md:px-10 lg:px-32 xl:max-w-3xl">
          <h1 className="text-4xl font-bold leading-none sm:text-5xl">마지막 단계!</h1>
          <p className="px-8 mt-8 mb-12 text-lg">자동 가입을 방지하기 위해, 캡차를 인증해주세요.</p>
        </div>
      )
    case 6:
      return <div>모든 가입 과정이 완료되었어요.</div>
    default:
      return <div>단계를 찾지 못하였어요</div>
  }
}

const FieldArray = ({ control }: { control: Control<any> }) => {
  const { fields, append, move } = useFieldArray({
    control,
    name: 'categories',
  })

  const items = fields.map((item, index) => (
    <Draggable key={item.id} index={index} draggableId={item.id}>
      {(provided, snapshot) => (
        <div
          className={classNames(
            'flex items-center border border-gray-300 px-2 py-2 mb-2 shadow-sm',
            { 'shadow-lg': snapshot.isDragging },
          )}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div
            {...provided.dragHandleProps}
            className="flex items-center justify-center h-full text-gray0700 px-4"
          >
            <GripVerticalIcon width={18} height={18} />
          </div>
          <div>
            <div>hello</div>
          </div>
        </div>
      )}
    </Draggable>
  ))

  return (
    <DragDropContext
      onDragEnd={({ source, destination }) => move(source.index, destination?.index || 0)}
    >
      <Droppable droppableId="list" direction="vertical">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <div onClick={() => append(0)}>Add</div>
    </DragDropContext>
  )
}
