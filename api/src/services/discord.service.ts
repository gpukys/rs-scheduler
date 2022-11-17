import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from "@/config";
import { AccessToken, DiscordUser } from "@/models";
import e from "express";
import fetch from "node-fetch";


class DiscordService {

    apiURL = 'https://discord.com/api/v10/';

    async getAccessToken(code: string): Promise<AccessToken> {
      const DiscordOauth2 = require("discord-oauth2");
      const oauth = new DiscordOauth2();
      
      try {
        const response = await oauth.tokenRequest({
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          code,
          scope: "identify guilds guilds.members.read",
          grantType: "authorization_code",
          redirectUri: REDIRECT_URI,
        })
        const { access_token: token, token_type: type } = response;
        return  { token, type };
      }
      catch(e) {
        console.log('error', e)
        return null;
      }
    }

    async getMemberRolesInGuild(guildId: string, accessToken: AccessToken): Promise<string[]> {
        const response = await fetch(`${this.apiURL}/users/@me/guilds/${guildId}/member`, { 
            headers: {
                authorization: `${accessToken.type} ${accessToken.token}`,
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.roles;
        } else {
            return null;
        }

    }

    async getUser(accessToken: AccessToken): Promise<DiscordUser> {
        const response = await fetch(`${this.apiURL}/users/@me`, { 
            headers: {
                authorization: `${accessToken.type} ${accessToken.token}`,
            }
        });

        const data = await response.json();

        return {
            discordID: data.id,
            username: data.username,
            avatarURL: data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png` : null,
            roles: [],
            color: null
        };
    }
}

export default DiscordService;