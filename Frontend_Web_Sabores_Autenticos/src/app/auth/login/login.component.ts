import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/auth/login.service';
import { LoginRequest } from 'src/app/services/auth/loginRequest';
import { CookieService } from 'ngx-cookie-service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  constructor(
    private router:Router,
    private loginService:LoginService,
    private cookieService: CookieService,
    private formBuilder: FormBuilder,
  ){}
  ngOnInit(): void {}

  loginForm=this.formBuilder.group({
    email: [
      '',
    [Validators.required, Validators.email]],
    password:[
      '',
    [Validators.required]],
  })
  loginError: string="";

  login(){
    if(this.loginForm.valid){
      const credentials = this.loginForm.value as LoginRequest;
      this.loginService.login(credentials).subscribe({
        next:(userData) => {
          console.log(userData);
          this.cookieService.set('token', userData.token);
          this.router.navigateByUrl('/catalogo');
          this.loginForm.reset();
        },
        error:(errorData) => {
          console.error(errorData);
          this.loginError=errorData;
          if (errorData instanceof HttpErrorResponse && errorData.status === 401) {
            this.loginError = 'Credenciales incorrectas.';
          }
          if (errorData instanceof HttpErrorResponse && errorData.status === 400) {
            this.loginError = 'Contraseña o Correo electrónico incorrectos.';
          }else {
            this.loginError = 'Credenciales incorrectas, intente nuevamente.';
          }
        },
        complete: () => {
          console.info("Login Completo")
        }
      })
    }
    else{
      this.loginForm.markAllAsTouched();
      console.log("Error en un campo");
    }
  }
  get email(){
    return this.loginForm.controls.email;
  }

  get password(){
    return this.loginForm.controls.password;
  }


}
