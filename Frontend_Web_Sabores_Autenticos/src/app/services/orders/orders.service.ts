import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  data: any = [];
  constructor(private http: HttpClient, private cookieService: CookieService) { }

  private baseUrl = 'http://localhost:5145/'; //cambiar

  getWaitOrders(){
    const tokenUser = this.cookieService.get('token');
    console.log(tokenUser);
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + tokenUser
    });
    return this.http.get(`${this.baseUrl}api/Order/getEnEspera`, {headers, responseType: 'json'}) // cambiar a nueva ruta

  }
  getOnOrders(){
    const tokenUser = this.cookieService.get('token');
    console.log(tokenUser);
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + tokenUser
    });
    console.log(headers);
    return this.http.get(`${this.baseUrl}api/Order/getEnProceso`, {headers, responseType: 'json'})
  }
  getHistoryOrders(){
    const tokenUser = this.cookieService.get('token');
    console.log(tokenUser);
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + tokenUser
    });
    return this.http.get(`${this.baseUrl}api/Order/getFinalizados`, {headers, responseType: 'json'})

  }

  toOnProgress(id: any){
    const tokenUser = this.cookieService.get('token');
    console.log(tokenUser);
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + tokenUser
    });
    return this.http.patch(`${this.baseUrl}api/Order/OrderIdToEnProceso?orderIdToEnProceso=${id}`,"", {headers, responseType: 'json'})
  }
  toHistory(id: any){
    const tokenUser = this.cookieService.get('token');
    console.log(tokenUser);

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + tokenUser
    });
    console.log(headers);
    return this.http.patch(`${this.baseUrl}api/Order/OrderIdToCompletado?orderIdToCompletado=${id}`,"",{headers, responseType: 'json'})

  }
  toCancel(id: any){
    const tokenUser = this.cookieService.get('token');
    console.log(tokenUser);
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + tokenUser
    });
    return this.http.patch(`${this.baseUrl}api/Order/OrderIdToCancelado?orderIdToCancelado=${id}`,"", {headers, responseType: 'json'})

  }



}
