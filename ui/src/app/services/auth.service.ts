import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map, Observable, of, tap } from 'rxjs';

export interface User {
  discordID: string,
  username: string,
  avatarURL: string,
  roles: UserRoles[]
}

export enum UserRoles {
  student = 'STUDENT',
  mentor = 'MENTOR'
}

const userMock = {"user":{"discordID":"275340328939028482","username":"gerimantasp","avatarURL":"https://cdn.discordapp.com/avatars/275340328939028482/a4ec2e5470872744766cb745325d8472.png","roles":[UserRoles.mentor]}}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user$: Observable<User> | null = null;

  constructor(
    private http: HttpClient
  ) { }

  authorize(code: string) {
    return this.http.get(`http://localhost:3000/auth/discord-login?code=${code}`);
  }

  getCurrentUser() {
    if (!this.user$) {
      return this.http.get<{user: User}>('http://localhost:3000/auth/user').pipe(map(e => e.user), tap(res => {
        if (res) {
          this.user$ = of(res);
        }
      }));
    }
    return this.user$;
  }

  logout() {
    this.user$ = null;
  }

  fakePath() {
    return this.http.get<any>('http://localhost:3000/test/lol');
  }
}
