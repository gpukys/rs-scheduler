import { Environment } from "./environment.base";

export const environment: Environment = {
  production: true,
  apiRoot: 'http://localhost:3000/api/',
  discordLoginUrl: 'https://discord.com/api/oauth2/authorize?client_id=963348770651783198&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code&scope=identify%20guilds%20guilds.members.read'
};
