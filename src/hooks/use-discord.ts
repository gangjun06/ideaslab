import useSWR from "swr";
import { DiscordRolesURL } from "~/pages/api/url";
import { fetcher } from "~/utils/api";

export const useDiscordRoles = () => {
  return useSWR(DiscordRolesURL(), fetcher);
};
