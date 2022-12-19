import type { NextPage } from 'next'
import { MainLayout } from '../layouts'
import { Fragment, memo } from 'react'
import { Step, StepContent, StepContentProps, StepWrapper } from '~/components/common/step'
import { useStep } from '~/hooks/useStep'
import { Button, ButtonLink, GripVerticalIcon } from '~/components/common'
import classNames from 'classnames'
import { Form, FormFieldBuilder, Input, Select } from '~/components/form'
import { Textarea } from '~/components/form/textarea'
import { FormBlock } from '~/components/form/form-block'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { Control, useFieldArray, UseFormRegister } from 'react-hook-form'
import React from 'react'
import { serverRule } from '~/assets/rule'
import { useForm } from '~/hooks/useForm'
import { authSignUpValidator, z } from '@ideaslab/validator'
import { useUser } from '~/hooks/useAuth'
import { TrashIcon } from '@heroicons/react/20/solid'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { useCurrentTheme } from '~/hooks/useTheme'
import { trpc } from '~/lib/trpc'
import { toast } from 'react-hot-toast'

const Signup: NextPage = () => {
  return (
    <MainLayout title="회원가입 하기" showTitle tinyContainer>
      <StepWrapper>
        {/* <StepContent>{StepList}</StepContent> */}
        <div className="card px-4 py-4 mt-8 flex flex-col justify-between sm:min-h-[700px]">
          <StepContent displayOn={1}>{Intro}</StepContent>
          <StepContent displayOn={2}>{Policy}</StepContent>
          <StepContent displayOn={3}>{Rule}</StepContent>
          <StepContent displayOn={4}>{SignupForm}</StepContent>
          <StepContent displayOn={5}>{Complete}</StepContent>
        </div>
      </StepWrapper>
    </MainLayout>
  )
}

export default Signup

const StepList = ({ step }: StepContentProps) => (
  <Step
    className="mt-2"
    currentStep={step}
    list={[
      '1. 아이디어스 랩에 오신것을 환영합니다!',
      '2. 약관동의',
      '3. 이용 규칙',
      '4. 자기소개 입력',
      '6. 가입완료',
    ]}
  />
)

const Intro = ({ next }: StepContentProps) => {
  const userData = useUser()
  return (
    <>
      <div className="mx-auto px-4 text-center md:px-10 lg:px-32 xl:max-w-3xl h-full flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold leading-none sm:text-5xl">
            {userData?.username}님, <br />
            <span className="dark:text-green-400">아이디어스랩</span>에<br /> 오신것을 환영합니다!
          </h1>
          <p className="px-8 mt-8 mb-12 text-lg">
            오래 걸리지 않아요! 간단하게 질문에 대답해주세요.
          </p>
        </div>
      </div>
      <div className="flex justify-between w-full mt-4">
        <div></div>
        <Button variant="primary" onClick={next}>
          시작하기
        </Button>
      </div>
    </>
  )
}

const Policy = ({ prev, next }: StepContentProps) => (
  <>
    <div className="w-full">
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
    <div className="flex justify-between w-full mt-4">
      <Button variant="default" onClick={prev}>
        뒤로가기
      </Button>
      <Button variant="primary" onClick={next}>
        동의하고 계속하기
      </Button>
    </div>
  </>
)

const Rule = ({ prev, next }: StepContentProps) => (
  <>
    <div className="w-full">
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
    <div className="flex justify-between w-full mt-4">
      <Button variant="default" onClick={prev}>
        뒤로가기
      </Button>
      <Button variant="primary" onClick={next}>
        동의하고 계속하기
      </Button>
    </div>
  </>
)

const Complete = ({ next }: StepContentProps) => <div>가입 끝</div>

const SignupForm = ({ prev, next }: StepContentProps) => {
  const userData = useUser()
  const theme = useCurrentTheme()

  const submit = trpc.auth.signup.useMutation({
    onSuccess: () => {
      toast.success('성공적으로 회원가입을 완료하였어요.')
    },
    onError: () => {
      toast.error('가입중 문제가 발생하였어요.')
    },
  })

  const form = useForm(authSignUpValidator, {
    onSubmit: async (data) => {
      await submit.mutateAsync(data)
    },
    onInvalid: (errors) => {
      if (Object.keys(errors).length === 1 && errors.captcha) {
        toast.error('캡챠를 확인해주세요.')
      }
    },
    defaultValues: {
      handle: userData?.userId,
      name: userData?.name,
      registerFrom: '디스보드',
    },
  })

  const {
    registerForm,
    control,
    setValue,
    watch,
    formState: { errors },
  } = form

  return (
    <Form form={form} className="flex-1 flex flex-col justify-between">
      <div className="h-full flex-1 flex flex-col gap-y-4 w-full">
        <div>자기소개를 남겨주세요!</div>
        <Input
          label="닉네임"
          description="아이디어스랩에서 사용하게 될 닉네임이에요. 알파벳, 한글, 숫자, 특수문자를 사용할 수 있어요"
          {...registerForm('name')}
        />
        <Input
          label="핸들"
          description="URL에서 사용될 id에요. 언제든 변경할 수 있어요. 알파벳, 숫자만 사용 가능합니다"
          prefix="https://ideaslab.kr/@"
          {...registerForm('handle')}
        />
        <FormFieldBuilder name="registerFrom">
          {({ field: { name, onChange }, error }) => (
            <Select
              label="가입경로"
              description="어떻게 아이디어스랩에 가입하게 되셨나요?"
              name={name}
              error={error}
              onChange={onChange}
              options={[
                { label: '디스보드', value: '디스보드' },
                { label: '지인 추천', value: '지인 추천' },
                { label: '인터넷 검색', value: '인터넷 검색' },
                { label: '기타', value: '기타' },
              ]}
            />
          )}
        </FormFieldBuilder>

        <Textarea
          label="자기소개"
          description="간단하게 소개 문구를 입력해주세요!"
          placeholder="예시) 안녕하세요! 게임개발을 하고있는 ??라고 합니다."
          {...registerForm('introduce')}
        />
        <FieldArray
          control={control}
          register={registerForm}
          error={errors?.links?.message ?? ''}
        />

        {Object.keys(errors).filter((key) => key !== 'captcha').length === 0 && (
          <FormBlock
            label="캡챠"
            description="자동 가입을 방지하기 위해 클릭해주세요."
            error={watch('captcha') === '' ? '캡챠를 클릭해 주세요.' : ''}
          >
            {process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY && (
              <HCaptcha
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY}
                theme={theme}
                languageOverride="ko"
                onVerify={(token) => {
                  setValue('captcha', token)
                }}
              />
            )}
          </FormBlock>
        )}
      </div>
      <div className="flex justify-between w-full mt-4">
        <Button variant="default" onClick={prev}>
          뒤로가기
        </Button>
        <Button variant="primary" type="submit">
          가입하기
        </Button>
      </div>
    </Form>
  )
}

const FieldArray = ({
  control,
  register,
  error,
}: {
  control: Control<z.TypeOf<typeof authSignUpValidator>>
  register: UseFormRegister<z.TypeOf<typeof authSignUpValidator>>
  error: string
}) => {
  const { fields, append, move, remove } = useFieldArray({
    control,
    name: 'links',
  })

  const items = fields.map((item, index) => (
    <Draggable key={item.id} index={index} draggableId={item.id}>
      {(provided, snapshot) => (
        <div
          className={classNames('flex items-center card px-2 py-2 mb-2', {
            'shadow-lg': snapshot.isDragging,
          })}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div
            {...provided.dragHandleProps}
            className="flex items-center justify-center h-full px-2"
          >
            <GripVerticalIcon width={18} height={18} />
          </div>
          <div className="flex w-full justify-between gap-x-2 pr-2">
            <Input
              labelClassName="w-full"
              className="w-full"
              placeholder="트위터"
              {...register(`links.${index}.name`)}
            />
            <Input
              labelClassName="w-full"
              className="w-full"
              placeholder="https://twitter.com/......"
              {...register(`links.${index}.url`)}
            />
          </div>
          <Button variant="subtle" className="mr-2" forIcon onClick={() => remove(index)}>
            <TrashIcon width={18} height={18} />
          </Button>
        </div>
      )}
    </Draggable>
  ))

  return (
    <FormBlock
      label="링크"
      description="작업링크 / SNS 들을 연결할 수 있어요. 6개까지 입력 가능해요."
      right={
        <Button variant="primary" onClick={() => append({ name: '', url: '' })}>
          추가
        </Button>
      }
      error={error}
    >
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
      </DragDropContext>
    </FormBlock>
  )
}
