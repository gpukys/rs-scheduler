import { Role } from "@/models"

export function isMentor(session: any): boolean {
  return session?.user?.roles?.some(role => [Role.MENTOR, Role.MODERATOR].indexOf(role) >= 0)
}