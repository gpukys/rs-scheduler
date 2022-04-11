import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  constructor(private auth: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['code']) {
        this.auth.authorize(params['code']).subscribe(res => {
          console.log('auth/discord-login', res);
        })
      }
    })
  }

  login() {
    window.open('https://discord.com/api/oauth2/authorize?client_id=961538488086446112&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=code&scope=identify%20guilds%20guilds.members.read', '_self')
  }

  request() {
    this.auth.getCurrentUser().subscribe(res => console.log('auth/user', res));
  }

}
