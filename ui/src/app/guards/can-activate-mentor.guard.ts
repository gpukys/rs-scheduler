import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { AuthService, UserRoles } from '../services/auth.service';

@Injectable({providedIn: 'root'})
export class MentorGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  canActivate() {
    return this.auth.getCurrentUser().pipe(tap(e => console.log('wat', e)), map(e => !!e && e.roles.indexOf(UserRoles.mentor) !== -1), tap(e => !e && this.router.navigate([''])));
  }
}