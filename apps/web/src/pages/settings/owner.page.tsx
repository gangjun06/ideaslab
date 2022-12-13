import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Button } from "~/components/common";
import { Form, SelectField } from "~/components/form";
import { useDiscordRoles } from "~/hooks/use-discord";
import { SettingLayout } from "~/layouts";
import { UserRole } from "~/types/user";
import { RolesLoaderData } from "../api/discord/roles.api";
import { ownerSettingValidator } from "../api/setting/owner.schema";
import { SettingOwnerURL } from "../api/url";

const OwnerSettingPage = () => {
  const { data, status } = useSession();
  const router = useRouter();
  const { data: roles } = useDiscordRoles();

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
      <Form
        url={SettingOwnerURL()}
        schema={ownerSettingValidator}
        getInitialValues
      >
        {({ registerForm }) => (
          <>
            {roles?.list ? (
              <SelectField
                disabled={data?.user.role !== UserRole.Admin}
                name="managerRole"
                label="관리자 역할"
                options={roles.list.map(({ id, name }) => ({
                  label: name,
                  value: id,
                }))}
              />
            ) : (
              "로딩중"
            )}
            <Button
              type="submit"
              primary
              disabled={data?.user.role !== UserRole.Admin}
            >
              저장하기
            </Button>
          </>
        )}
      </Form>
    </SettingLayout>
  );
};

export default OwnerSettingPage;
