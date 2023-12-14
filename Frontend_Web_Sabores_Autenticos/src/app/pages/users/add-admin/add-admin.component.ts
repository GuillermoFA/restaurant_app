import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users/users.service';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrl: './add-admin.component.css'
})
export class AddAdminComponent {
  Name: string ='' ;
  Role: string = 'admin';
  Rut: string = '';
  Email: string = '';
  Password: string = '';
  message: string = '';
  form: FormGroup;
  constructor(private users: UsersService,private router: Router) {
    this.form = new FormGroup({
      Name: new FormControl(),
      Role: new FormControl(this.Role),
      Rut: new FormControl(),
      Email: new FormControl(),
      Password: new FormControl()
    });
  }

  async onSubmit() {


    const alert = document.getElementById('alert');
    if(alert!=null){
      console.log(this.form.value);
      this.users.addAdmin(this.form.value).subscribe
    ((data) => {

      Swal.fire({
        title: `Admniistrador ${this.form.value.Name} creado exitosamente`,
        icon: 'success',
        confirmButtonText: 'OK',

      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/usuarios']);
        }
      })

    },(error) => {

      if(error.error.errors){
        this.message = 'Todos los campos son requeridos';
      }else{
        this.message = error.error.Error;

      }
      alert.style.display = 'block';

      }



      );
    }

  }




}
