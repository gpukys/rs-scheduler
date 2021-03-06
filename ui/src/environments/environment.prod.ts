import { Environment } from "./environment.base";

export const environment: Environment = {
  production: true,
  apiRoot: 'https://rs-scheduler.herokuapp.com/api/',
  discordLoginUrl: 'https://discord.com/api/oauth2/authorize?client_id=962002878573191198&redirect_uri=https%3A%2F%2Frs-scheduler.herokuapp.com%2F&response_type=code&scope=identify%20guilds%20guilds.members.read'
};
