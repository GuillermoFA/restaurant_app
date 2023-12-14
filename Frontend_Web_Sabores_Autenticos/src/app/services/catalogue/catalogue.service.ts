import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, catchError, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CatalogueService implements OnDestroy {

  constructor(private http: HttpClient, private cookieService: CookieService) { }
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  private baseUrl = 'http://localhost:5145/'

  getProducts(){
    const tokenUser = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + tokenUser
    });
    return this.http.get(`${this.baseUrl}api/Product`, {headers, responseType: 'json'})


  }

  addProduct(product: any): Observable<any> {
    const tokenUser = this.cookieService.get('token'); // Obtén el token como lo estás haciendo actualmente
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + tokenUser
    });

    return this.http.post<any>(`${this.baseUrl}api/Product`, product, { headers, responseType: 'json' });
  }
  editProduct(formValue: any, id: any) {
    const tokenUser = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + tokenUser
    });
    return this.http.put(`${this.baseUrl}api/Product/${id}`, formValue, { headers, responseType: 'json' });
  }
  getProduct(id: any){
    const tokenUser = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + tokenUser
    });
    return this.http.get(`${this.baseUrl}api/Product/${id}`, {headers, responseType: 'json'})
  }
  deleteProduct(id: any){
    const tokenUser = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + tokenUser
    });
    return this.http.delete(`${this.baseUrl}api/Product/${id}`, {headers, responseType: 'json'})
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();

  }
  getTrigger() {
    return this.dtTrigger;
  }
}
