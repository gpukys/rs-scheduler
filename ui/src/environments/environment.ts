import { Environment } from "./environment.base";
import 'zone.js/plugins/zone-error';

export const environment: Environment = {
  production: false,
  apiRoot: 'http://localhost:3000/api/',
  discordLoginUrl: 'https://discord.com/api/oauth2/authorize?client_id=961538488086446112&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=code&scope=identify%20guilds%20guilds.members.read'
};

