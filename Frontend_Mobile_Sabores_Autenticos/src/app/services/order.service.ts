import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private urlApi = 'http://localhost:5145/api/Order/customerOrdersEnEspera/';

  constructor(private httpClient: HttpClient, private utilsService: UtilsService) { }

  getOrders(customerId: string) {
    const accessToken = this.utilsService.getFromLocalStorage('user') || '{}';
    const jsonAccessToken = JSON.parse(accessToken);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${jsonAccessToken.token}`,
    });

    return this.httpClient.get<any[]>(`${this.urlApi + customerId}`, { headers, responseType: 'json' });
  }
}
