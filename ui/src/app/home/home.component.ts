import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeWhile } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService, UserRoles } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  constructor(private auth: AuthService, private route: ActivatedRoute, private router: Router) { }

  isLoading = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        this.isLoading = true;
        this.auth.authorize(code).subscribe(res => {
          if (res.user) {
            const isMentor = res.user.roles.indexOf(UserRoles.mentor) !== -1;
            if (isMentor) {
              this.router.navigate(['mentor'])
            } else {
              this.router.navigate(['student'])
            }
          }
          this.isLoading = false;
        })
      }
    })
  }

  login() {
    this.isLoading = true;
    window.open(environment.discordLoginUrl, '_self')
  }
}
