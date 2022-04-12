import { Role } from "./role.enum";

export interface DiscordUser {
    discordID: string;
    username: string;
    avatarURL: string;
    roles: Role[];
    color: string;
}