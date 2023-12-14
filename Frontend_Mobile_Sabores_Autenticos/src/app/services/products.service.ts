import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = 'http://localhost:5145';

  constructor(private httpClient: HttpClient, private utilsService: UtilsService) { }

  getProducts(): Observable<any[]> {
    const accessToken = this.utilsService.getFromLocalStorage('user') || '{}';
    const jsonAccessToken = JSON.parse(accessToken);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${jsonAccessToken.token}`,
    });

    return this.httpClient.get<any[]>(`${this.apiUrl}/api/Product`, { headers, responseType: 'json' });
  }

  postOrder(idProducts: any[], commentOrder: string): Observable<any[]> {
    const accessToken = this.utilsService.getFromLocalStorage('user') || '{}';
    const jsonAccessToken = JSON.parse(accessToken);

    const userData = this.utilsService.getFromLocalStorage('user') || '{}';
    const customerId = JSON.parse(userData);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${jsonAccessToken.token}`,
    });

    const orderData = {
      arrayOfProdId: idProducts,
      customerId: customerId.id,
      comment: commentOrder
    }

    return this.httpClient.post<any[]>(`${this.apiUrl}/api/Order/registerOrder`, orderData, { headers, responseType: 'json' });
  }
}
