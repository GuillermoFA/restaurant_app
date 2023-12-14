import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilsService } from '../services/utils.service';
import { CustomerService } from '../services/customer.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  customerService = inject(CustomerService);
  utilsService = inject(UtilsService);
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      let user = localStorage.getItem('user');


      return new Promise((resolve) => {
        if (!user) {
          resolve(true);
        }
        else {
          this.utilsService.routerLink('/main/home');
          resolve(false);
        }
      });
  }
  
}
