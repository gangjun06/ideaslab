import type { NextPage } from 'next'
import { SettingLayout } from '~/layouts'
import { useUser } from '~/hooks/useAuth'
import { Input } from '~/components/form'

const ProfileSetting: NextPage = () => {
  const profile = useUser()

  return (
    <SettingLayout title="프로필 설정" guard="authOnly">
      <div className="pt-4 md:pt-0 md:col-span-9 flex flex-col gap-y-4">
        <Input
          label="디스코드 유저 정보"
          disabled={true}
          value={`${profile?.username}#${profile?.discriminator}`}
        />
        <Input label="닉네임" value={profile?.name} />
        <Input label="핸들" prefix="https://ideaslab.kr/@" value={profile?.userId} />
      </div>
    </SettingLayout>
  )
}

export default ProfileSetting
