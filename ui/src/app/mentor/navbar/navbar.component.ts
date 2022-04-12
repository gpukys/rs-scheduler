import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user$: BehaviorSubject<User | null>;

  constructor(private auth: AuthService, private sanitizer: DomSanitizer, private router: Router) {
    this.user$ = auth.getCurrentUser();
  }

  ngOnInit(): void {
  }

  sanitizedImg(user: User) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(user.avatarURL);
  }

  login() {
    window.open(environment.discordLoginUrl, '_self')
  }

  logout() {
    this.auth.logout().subscribe(res => {
      this.router.navigate(['home'])
    });
  }

}
