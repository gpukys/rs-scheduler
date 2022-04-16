import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatModule } from '../mat.module';
import { AuthService } from '../services/auth.service';
import { SharedModule } from '../shared.module';
import { NavbarComponent } from './navbar.component';


@NgModule({
  imports: [MatModule, RouterModule, SharedModule],
  exports: [NavbarComponent],
  declarations: [NavbarComponent],
  providers: [AuthService],
})
export class NavBarModule { }
