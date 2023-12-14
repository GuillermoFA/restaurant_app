import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit, OnDestroy {
  usersData: any = [];
  constructor(private users: UsersService, private router: Router ) { }
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};



  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };
    this.showUsers();

  }
  showUsers(){
    this.users.getUsers().subscribe((data) => {
      this.usersData = data;
      for (let i = 0; i < this.usersData.length; i++) {
        if (this.usersData[i].isActive == true){
          this.usersData[i].isActiveString = "Habilitado";
        }else{
          this.usersData[i].isActiveString = "Deshabilitado";
        }
      }
      console.log(this.usersData);
      this.dtTrigger.next(data);
    });

  }
  disableUser(id: any){
    this.users.disableUser(id).subscribe((data) => { // Ruta no definida y atributo no definido
      console.log(data);

    });
    window.location.reload();
  }
  enableUser(id: any){
    this.users.enableUser(id).subscribe((data) => {
      console.log(data);

    });
    window.location.reload();
  }
  deleteUser(id: any){
    Swal.fire({
      title: `¿Está seguro que desea eliminar a este usuario?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',

    }).then((result) => {
      if (result.isConfirmed) {
        this.users.deleteUser(id).subscribe((data) => {
          console.log(data);

        });
        Swal.fire({
          title: `Usuario eliminado exitosamente`,
          icon: 'success',
          confirmButtonText: 'OK',

        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        })
      }else{
        window.location.reload();
      }
    })

  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();

  }

}