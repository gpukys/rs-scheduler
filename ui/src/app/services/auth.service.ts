import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, iif, map, mergeMap, Observable, of, shareReplay, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

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

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly apiPrefix = environment.apiRoot;
  private user$: BehaviorSubject<User | null>  = new BehaviorSubject<User | null>(null);

  constructor(
    private http: HttpClient
  ) { }

  authorize(code: string): Observable<{user: User}> {
    return this.http.get<{user: User}>(`${this.apiPrefix}auth/discord-login?code=${code}`).pipe(tap(res => this.user$.next(res.user)));
  }

  getCurrentUser(): BehaviorSubject<User | null> {
    if (!this.user$.value) {
      this.http.get<{user: User}>(`${this.apiPrefix}auth/user`).subscribe(res => this.user$.next(res.user))
    }
    return this.user$;
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiPrefix}auth/logout`, {}).pipe(tap(() => this.user$.next(null)))
  }

  fakePath() {
    return this.http.get<any>('http://localhost:3000/test/lol');
  }
}
