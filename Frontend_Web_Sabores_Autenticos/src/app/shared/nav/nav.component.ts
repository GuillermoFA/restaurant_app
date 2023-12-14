import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/auth/login.service';
import { Subject, takeUntil } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { UsersService } from 'src/app/services/users/users.service';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {
  userLoginOn: boolean = false;
  private unsubscribe$ = new Subject<void>();
  constructor(private loginService: LoginService, private cookieService: CookieService, private userApiServe: UsersService) { }

  ngOnInit(): void {
    this.loginService.currentUserLoginOn
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (userLoginOn) => {
          this.userLoginOn = userLoginOn;
        }
    });
    this.loginService.currentUserLoginOn.subscribe((userLoginOn) => {
      this.userLoginOn = userLoginOn;
    });
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onClickOut(): void {
    this.cookieService.deleteAll();
    localStorage.removeItem('userData');
    this.userApiServe.logout();
  }

  isSticky: boolean = false;

  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isSticky = scrollPosition > 100; // Ajusta el valor según tu preferencia
  }

}
