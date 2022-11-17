import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from "@/config";
import { AccessToken, DiscordUser } from "@/models";
import e from "express";
import fetch from "node-fetch";

class DiscordService {

    apiURL = 'https://discord.com/api/';

    async getAccessToken(code: string): Promise<AccessToken> {
        const body = new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code',
            scope: 'identify guilds guilds.members.read',
            code
        });

        console.log(body.toString())

        const response = await fetch(`${this.apiURL}oauth2/token`, { 
            method: 'POST', 
            body
        });

        if (response.ok) {
            const { access_token: token, token_type: type } = await response.json();
            return  { token, type };
        } else {
            console.log(response);
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