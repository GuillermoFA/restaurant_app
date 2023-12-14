import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = 'http://localhost:5145';

  utilsController = inject(UtilsService);
  
  constructor(private httpClient: HttpClient) { }

  // Registro de cliente
  async registerCustomer(customer: any) {
    const loadingRegister = await this.utilsController.loading();
    await loadingRegister.present();

    this.httpClient.post(`${this.apiUrl}/api/Account/register`, customer, { responseType: 'text' }).subscribe({
      next: (data:any) => {

      },
      error: (error) => {
        loadingRegister.dismiss();
        let valueError = JSON.parse(error.error)
        this.utilsController.presentToast({
          message: 'Ha ocurrido un error: ' + valueError.Error[0],
          duration: 2500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      },
      complete: () => {
        loadingRegister.dismiss();

        this.utilsController.presentToast({
          message: 'Registrado exitosamente',
          duration: 2500,
          color: 'success',
          position: 'middle',
          icon: 'alert-circle-outline'
        });

        this.utilsController.routerLink('/auth');
      }
    });
  }

  // Iniciar sesion cliente
  async loginCustomer(customer: any) {
    const loadingLogin = await this.utilsController.loading();
    await loadingLogin.present();

    this.httpClient.post(`${this.apiUrl}/api/Account/login?Email=${customer.Email}&Password=${customer.Password}`, customer).subscribe({
      next: (data:any) => {
        this.utilsController.saveInLocalStorage('user', data);
      },
      error: (error) => {
        loadingLogin.dismiss();

        this.utilsController.presentToast({
          message: 'El usuario o contraseña es incorrecto',
          duration: 2500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline'
        });

      },
      complete: () => {
        loadingLogin.dismiss();
        this.utilsController.presentToast({
          message: `Bienvenido a Sabores Autenticos, ${JSON.parse(localStorage.getItem('user') || '{}').name}`,
          duration: 2500,
          color: 'success',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
        this.utilsController.routerLink('/main/home')
      }
    });

  }
}
