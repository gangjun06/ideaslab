import type { NextPage } from 'next'
import { SettingLayout } from '~/layouts'
import { useUser } from '~/hooks/useAuth'
import { Form, Input } from '~/components/form'
import { authUpdateProfileValidator } from '~/../../../packages/validator/src'
import { useForm } from '~/hooks/useForm'

const ProfileSetting: NextPage = () => {
  const profile = useUser()

  const form = useForm(authUpdateProfileValidator, {
    defaultValues: {
      name: profile?.name,
      handle: profile?.userId,
    },
  })
  const { registerForm } = form

  return (
    <SettingLayout title="프로필 설정" guard="authOnly">
      <Form form={form} className="pt-4 md:pt-0 md:col-span-9 flex flex-col gap-y-4">
        <Input
          label="디스코드 유저 정보"
          disabled={true}
          value={`${profile?.username}#${profile?.discriminator}`}
        />
        <Input label="닉네임" {...registerForm('name')} />
        <Input label="핸들" prefix="https://ideaslab.kr/@" {...registerForm('handle')} />
      </Form>
    </SettingLayout>
  )
}

export default ProfileSetting
