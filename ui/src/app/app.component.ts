import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService, User, UserRoles } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {
    this.auth.getCurrentUser().subscribe(res => {
      if (res) {
        const isMentor = res.roles.indexOf(UserRoles.mentor) !== -1;
        const location = window.location.href;
        if (isMentor && !location.includes('mentor')) {
          this.router.navigate(['mentor'])
        } else if (!isMentor && !location.includes('student')) {
          this.router.navigate(['student'])
        }
      }
    })
  }
}
