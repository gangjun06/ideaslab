import type { NextPage } from 'next'
import Image from 'next/image'
import { MainLayout } from '~/layouts'
import MainImage from '~/assets/main-image.svg'
import Typed from 'react-typed'
import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { Step } from '~/components/common/step'
import { useStep } from '~/hooks/useStep'
import { Button } from '~/components/common'

const ProfileSetting: NextPage = () => {
  return (
    <MainLayout title="프로필 설정" showTitle tinyContainer guard="authOnly">
      <div></div>
    </MainLayout>
  )
}

export default ProfileSetting
