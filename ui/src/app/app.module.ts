import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { UnauthorizedInterceptor } from './interceptors/unauthorized.interceptor';
import { MatModule } from './mat.module';
import { SharedModule } from './shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatModule,
    SharedModule
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: function(router: Router, authService: AuthService) {
        return new UnauthorizedInterceptor(router, authService);
      },
      multi: true,
      deps: [Router, AuthService]
   },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
