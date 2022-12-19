import type { NextPage } from 'next'
import { SettingLayout } from '~/layouts'
import { useUser } from '~/hooks/useAuth'
import { Input } from '~/components/form'
import { useForm } from '~/hooks/useForm'

const GallerySetting: NextPage = () => {
  const profile = useUser()
  //   const form = useForm()

  return (
    <SettingLayout title="갤러리 설정" guard="adminOnly">
      <div className="pt-4 md:pt-0 md:col-span-9 flex flex-col gap-y-4"></div>
    </SettingLayout>
  )
}

export default GallerySetting
