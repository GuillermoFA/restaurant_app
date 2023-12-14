import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/auth/login.service';
import { User } from 'src/app/services/auth/user';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit , OnDestroy{

  userLoginOn:boolean = false;
  userData?:User;
  private unsubcribe$ = new Subject<void>();
   // userLoginOn - false = not logged in, true = logged in.
  constructor(private loginService:LoginService, private router:Router) { }

  ngOnInit(): void {
    if(this.loginService.isUserLoggedIn()){
      this.userLoginOn = true;
      this.userData = this.loginService.getCurrentUserData();
    }

    this.loginService.currentUserLoginOn
    .pipe(takeUntil(this.unsubcribe$)).subscribe({
      next:(userLoginOn => {
        this.userLoginOn = userLoginOn;
      })
    });

    this.loginService.currentUserData
      .pipe(takeUntil(this.unsubcribe$))
      .subscribe({
        next: (userData) => {
          this.userData = userData;
        }
    });

    this.loginService.userLogoutEvent.subscribe(()=> {
      this.router.navigateByUrl('iniciar-sesion');
      this.userLoginOn = false;
    })


  }

  ngOnDestroy(): void {
    this.unsubcribe$.next();
    this.unsubcribe$.complete();
  }

}
