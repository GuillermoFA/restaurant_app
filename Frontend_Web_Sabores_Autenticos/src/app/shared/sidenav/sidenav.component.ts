import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
   constructor(private router: Router) { }

  waitingOrders(){
    this.router.navigate(['/pedidos/en-espera']);
  }

  onOrders() {
    this.router.navigate(['/pedidos/en-progreso']);
  }
  orderHistory() {
    this.router.navigate(['/pedidos/historial']);
  }

  showUsers(){
    this.router.navigate(['/usuarios/clientes']);
    const adminsCtn = document.getElementById('adminsTableDiv');
    const usersCtn = document.getElementById('usersTableDiv');
    if (adminsCtn != null && usersCtn != null) {
      adminsCtn.style.display = 'none';
      usersCtn.style.display = 'block';
    }else{
      console.log('users is null');
    }
}
  showAdmins(){
    this.router.navigate(['/usuarios/admins']);
    const adminsCtn = document.getElementById('adminsTableDiv');
    const usersCtn = document.getElementById('usersTableDiv');
    if (adminsCtn != null && usersCtn != null) {
      usersCtn.style.display = 'none';
      adminsCtn.style.display = 'block';
   }else{
      console.log('adminsCtn is null');
    }
  }

}
