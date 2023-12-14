import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  pages = [
    { title:'Inicio', url:'/main/home', icon: 'home-outline'},
    { title:'Perfil', url:'/main/profile', icon: 'person-outline'},
    { title:'Ordenes', url:'/main/orders', icon: 'restaurant-outline'},
  ]

  profile: any;

  customerService = inject(CustomerService);
  utilsService = inject(UtilsService);
  router = inject(Router);
  currentPath: string = '';


  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event?.url) {
        this.currentPath = event.url;
      }
    });

    this.profile = this.utilsService.getFromLocalStorage('user');
    this.profile = JSON.parse(this.profile);
  }

  signOut() {
    this.utilsService.signOut();
  }

}
