import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  data: any = [];
  constructor(private http: HttpClient, private cookieService: CookieService) { }
  dtTrigger: Subject<any> = new Subject<any>();
  private baseUrl = 'http://localhost:5145/'; //cambiar

  getAdmins(){
    const tokenUser = this.cookieService.get('token');
    console.log(tokenUser);
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + tokenUser
    });
    return this.http.get(`${this.baseUrl}api/User?role=admin`, {headers, responseType: 'json'})

  }
  getUsers(){
    const tokenUser = this.cookieService.get('token');
    console.log(tokenUser);
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + tokenUser
    });
    return this.http.get(`${this.baseUrl}api/User?role=client`, {headers, responseType: 'json'})
  }
  deleteUser(id: number){
    const tokenUser = this.cookieService.get('token');
    console.log(tokenUser);
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + tokenUser
    });
    return this.http.delete(`${this.baseUrl}api/User/${id}`, {headers, responseType: 'json'})
  }
  addAdmin(formValue: any){
    const tokenUser = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + tokenUser
    });
    return this.http.post(`${this.baseUrl}api/User/registerOnlyToAdmin`, formValue, {headers, responseType: 'json'})
  }
  disableUser(id: number){
    const tokenUser = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + tokenUser
    });
    return this.http.put(`${this.baseUrl}api/User/UnActivateUser/${id}`, "", {headers, responseType: 'json'})
  }
  enableUser(id: number){
    const tokenUser = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + tokenUser
    });
    return this.http.put(`${this.baseUrl}api/User/ActivateUser/${id}`, "", {headers, responseType: 'json'})
  }


  logout(){
    localStorage.removeItem('token');
    this.cookieService.delete('token');
    this.cookieService.deleteAll();
  }



}
