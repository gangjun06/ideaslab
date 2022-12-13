import useSWR from "swr";
import { RolesLoaderData } from "~/pages/api/discord/roles.api";
import { DiscordRolesURL } from "~/pages/api/url";
import { fetcher } from "~/utils/api";

export const useDiscordRoles = () => {
  return useSWR<RolesLoaderData>(DiscordRolesURL(), fetcher);
};
