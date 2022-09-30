import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Button } from "~/components/common/Button";
import { Form, Input } from "~/components/form";
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
            <Button type="submit" primary>
              저장하기
            </Button>
            <Button type="submit">저장하기</Button>
          </>
        )}
      </Form>
    </SettingLayout>
  );
};

export default OwnerSettingPage;
