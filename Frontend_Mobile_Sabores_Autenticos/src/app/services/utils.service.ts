import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingController = inject(LoadingController);
  toastController = inject(ToastController);
  router = inject(Router);


  // =============== Loading =================
  loading() {
    return this.loadingController.create({ spinner: 'crescent' });
  }

  // =============== Toast ===================
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastController.create(opts);
    toast.present();
  }

  // ============= Enrutador =================
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  // ===== Guarda datos en el localStorage ===
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  // ===== Obtiene datos del localStorage ====
  getFromLocalStorage(key: string) {
    return localStorage.getItem(key);
  }

  // =========== Cerrar sesion ===============
  signOut() {
    localStorage.removeItem('user');
    this.routerLink('/auth');
    
  }
}
