import {
  RectangleStackIcon,
  UserCircleIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, ReactNode, useMemo } from "react";
import { UserRole } from "~/types/user";
import { MainLayout } from "./main";

type NavFieldType = {
  url: string;
  name: string;
  icon: (props: React.ComponentProps<"svg">) => JSX.Element;
  description: string;
};

type NavType = {
  title: string;
  fields: NavFieldType[];
  adminOnly?: boolean;
};

const navList: NavType[] = [
  {
    title: "설정",
    fields: [
      {
        url: "/settings/profile",
        name: "프로필",
        icon: UserCircleIcon,
        description: "개인 프로필을 설정합니다",
      },
      {
        url: "/settings/account",
        name: "계정",
        icon: CogIcon,
        description: "계정을 관리합니다",
      },
    ],
  },
  {
    title: "서버 소유자 설정",
    adminOnly: true,
    fields: [
      {
        url: "/settings/owner",
        name: "기본 설정",
        description: "각종 권한에 관해 설정합니다",
        icon: RectangleStackIcon,
      },
    ],
  },
  {
    title: "서버 관리자 설정",
    adminOnly: true,
    fields: [
      {
        url: "/settings/manager",
        name: "기본 설정",
        description: "각종 권한에 관해 설정합니다",
        icon: RectangleStackIcon,
      },
    ],
  },
];

export type props = {
  children: ReactNode;
};

export const SettingLayout = ({ children }: props) => {
  const { pathname } = useRouter();
  const { data, status } = useSession();

  const curPage = useMemo(() => {
    return navList
      .reduce((prev, cur) => prev.concat(cur.fields), [] as NavFieldType[])
      .find((item) => pathname === `${item.url}`);
  }, [pathname]);

  if (!data || status !== "authenticated") return <></>;
  const { image, name, role } = data.user;

  return (
    <MainLayout>
      <div className="mb-4 flex items-center">
        <Image
          src={image || ""}
          className="rounded-full"
          alt="profile"
          width={64}
          height={64}
        />
        <div className="ml-4 flex flex-col">
          <div className="flex items-center gap-3 text-xl font-bold text-gray-700">
            <div className="">
              {name}
              {role === UserRole.Admin ? " [소유자]" : ""}
            </div>
            {/* <span className="mr-0.5 h-3 w-3 rotate-45 transform cursor-default border-t border-r border-gray-500" /> */}
            <div className="mb-1 font-normal text-gray-400">/</div>
            <div>{curPage?.name}</div>
          </div>
          <div className="text-gray-500">{curPage?.description}</div>
        </div>
      </div>
      <div className="grid grid-flow-col gap-x-12">
        <div className="col-span-3 flex flex-col gap-x-1 gap-y-2 tracking-wide">
          {navList
            .filter(
              ({ adminOnly }) =>
                !adminOnly ||
                role === UserRole.Admin ||
                role === UserRole.Manager
            )
            .map(({ title, fields }) => (
              <div key={title}>
                <div className="text-lg font-bold text-gray-600">{title}</div>
                {fields.map(({ icon: Icon, name, url }) => (
                  <Link href={url} passHref key={url}>
                    <a
                      className={`${
                        pathname === url
                          ? "bg-gray-200 font-bold"
                          : "hover:bg-gray-100"
                      } flex items-center gap-x-3 rounded-lg px-2 py-2`}
                    >
                      <div className="text-xl">
                        <Icon width={20} height={20} />
                      </div>
                      <div>{name}</div>
                    </a>
                  </Link>
                ))}
              </div>
            ))}
        </div>
        <div className="col-span-9">{children}</div>
      </div>
    </MainLayout>
  );
};
