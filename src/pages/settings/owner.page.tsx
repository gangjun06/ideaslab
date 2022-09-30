import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Button } from "~/components/common";
import { Form, Input, Select } from "~/components/form";
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
      <Form url=".">
        {({ registerForm }) => (
          <>
            <Input
              label="Test"
              {...registerForm("test", { required: true, customLabel: "Test" })}
            />
            <Select
              label="Roles"
              options={[
                { label: "Role1", value: "Role1" },
                { label: "Role2", value: "Role2" },
                { label: "Role3", value: "Role3" },
              ]}
            />
            <div className="flex flex-row-reverse">
              <Button type="submit" primary>
                저장하기
              </Button>
            </div>
          </>
        )}
      </Form>
    </SettingLayout>
  );
};

export default OwnerSettingPage;
