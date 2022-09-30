import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { SettingLayout } from "~/layouts";
import { UserRole } from "~/types/user";

const OwnerSettingPage = () => {
  const { data, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const role = data?.user.role;
    if (
      status === "authenticated" &&
      role !== UserRole.Admin &&
      role !== UserRole.Manager
    ) {
      router.push("/");
    }
  }, [data, router, status]);

  return (
    <SettingLayout>
      <div className="w-56">
        <label
          htmlFor="test"
          className="block text-sm font-medium text-gray-700"
        >
          Test
        </label>
        <input
          type="text"
          name="test"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>
    </SettingLayout>
  );
};

export default OwnerSettingPage;
