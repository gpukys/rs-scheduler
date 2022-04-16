import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, iif, map, mergeMap, Observable, of, retry, share, shareReplay, Subject, switchMap, take, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface User {
  discordID: string,
  username: string,
  avatarURL: string,
  roles: UserRoles[]
}

export enum UserRoles {
  student = 'STUDENT',
  mentor = 'MENTOR',
  moderator = 'MODERATOR'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly apiPrefix = environment.apiRoot;
  private httpFetchDone = false;
  private userStore$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  private userHttpFetch$: Observable<User | null> = this.http.get<{user: User}>(`${this.apiPrefix}auth/user`)
    .pipe(
      tap(e => {if (!e?.user) {this.router.navigate([])}}),
      tap(() => this.httpFetchDone = true),
      switchMap((user) => {
        this.userStore$.next(user.user);
        return this.userStore$;
      }),
      catchError(() => throwError(() => new Error("User authentication failed")))
    )
  readonly user$: Observable<User | null> = this.userStore$.pipe(
    switchMap((user) => {
      if (user || this.httpFetchDone) {
        return of(user);
      }
      this.httpFetchDone = true
      return this.userHttpFetch$
    }),
    catchError(() => {
      return of(null);
    })
  );

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  authorize(code: string): Observable<{user: User}> {
    return this.http.get<{user: User}>(`${this.apiPrefix}auth/discord-login?code=${code}`).pipe(tap(res => {this.userStore$.next(res.user); this.httpFetchDone = true}));
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiPrefix}auth/logout`, {}).pipe(tap(() => {this.userStore$.next(null); this.httpFetchDone = false;}))
  }

  isMentor(): Observable<boolean> {
    return this.user$.pipe(take(1), map(res => {
      return !!res && res.roles.some(role => [UserRoles.mentor, UserRoles.moderator].indexOf(role) >= 0)
    }))
  }
}
