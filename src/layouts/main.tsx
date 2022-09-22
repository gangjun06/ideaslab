import React, { ReactNode } from "react";
import Link from "next/link";
import classNames from "classnames";
import { signIn, useSession } from "next-auth/react";
import { UserMenu } from "~/components/common";

type props = {
  children: ReactNode;
};

const NavItem = ({
  name,
  href,
  isActive,
}: {
  name: string;
  href: string;
  isActive: boolean;
}) => {
  return (
    <Link passHref href={href}>
      <a
        className={classNames(
          "py-1 px-4 rounded transition-colors",
          isActive
            ? "bg-primary-300/50 text-primary-600"
            : "hover:bg-primary-300/40 hover:text-primary-500"
        )}
      >
        {name}
      </a>
    </Link>
  );
};

export const MainLayout = ({ children }: props) => {
  const session = useSession();

  return (
    <>
      <nav className="px-4 py-3 shadow sticky bg-white">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div className="font-bold">아이디어스랩</div>
          <div className="flex gap-x-4 items-center">
            <NavItem name="홈" href="/" isActive={true} />
            <NavItem name="프로필" href="/profile" isActive={false} />
            <NavItem name="갤러리" href="/gallery" isActive={false} />
          </div>
          {session.data ? (
            <UserMenu />
          ) : (
            <button
              className="py-1 px-4 rounded transition-colors hover:bg-primary-300/40 hover:text-primary-500"
              onClick={() => {
                signIn("discord");
              }}
            >
              로그인
            </button>
          )}
        </div>
      </nav>
      <div className="container mx-auto py-4 h-full px-2">{children}</div>
    </>
  );
};
