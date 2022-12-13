import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import discord from "~/lib/discord";
import { getSetting } from "~/models/setting";
import { UserRole } from "~/types/user";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      discriminator: string;
      accessToken: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.BOT_CLIENT_ID ?? "",
      clientSecret: process.env.BOT_SECRET ?? "",
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify",
      token: "https://discord.com/api/oauth2/token",
      userinfo: "https://discord.com/api/users/@me",

      profile(profile) {
        if (profile.avatar === null) {
          const defaultAvatarNumber = parseInt(profile.discriminator) % 5;
          profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
        } else {
          const format = profile.avatar.startsWith("a_") ? "gif" : "png";
          profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
        }

        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: profile.image_url,
          discriminator: profile.discriminator,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user: _user }) {
      const id = (token.sub as string) || "";
      session.user.accessToken = (token.accessToken as string) || "";
      session.user.id = id;
      const guild = await discord.guilds.fetch(process.env.SERVER_ID || "");

      if (guild.ownerId === id) {
        session.user.role = UserRole.Admin;
      } else {
        const managerRole = await getSetting("manager_role");
        const memberRoles = (await guild.members.fetch({ user: id })).roles;
        if (managerRole && memberRoles.cache.has(managerRole)) {
          session.user.role = UserRole.Manager;
        }
      }
      return session;
    },

    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
