import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService, User } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit {
  rootPath: string;

  constructor(public auth: AuthService, private sanitizer: DomSanitizer, private router: Router) {
  }

  ngOnInit(): void {
    this.rootPath = this.router.url.split('/')[1];
  }

  sanitizedImg(user: User) {
    if (user.avatarURL) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(user.avatarURL);
    }
    return '../../../assets/discord-placeholder.png'
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
