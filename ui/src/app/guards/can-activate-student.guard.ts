import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, take, tap } from 'rxjs';
import { AuthService, UserRoles } from '../services/auth.service';

@Injectable({providedIn: 'root'})
export class StudentGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  canActivate() {
    return this.auth.user$.pipe(take(1), map(e => !!e && e.roles.indexOf(UserRoles.student) !== -1), tap(e => !e && this.router.navigate([''])));
  }
}