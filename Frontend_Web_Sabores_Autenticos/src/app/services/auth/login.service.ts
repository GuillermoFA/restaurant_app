import { EventEmitter, Injectable } from '@angular/core';
import { LoginRequest } from './loginRequest';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, BehaviorSubject, tap } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = 'http://localhost:5145'; //cambiar

  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); // Usuario no logeado inicialmente
  currentUserLoginOn$: Observable<boolean> = this.currentUserLoginOn.asObservable();
  currentUserData: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);
  currentUserData$: Observable<User | undefined> = this.currentUserData.asObservable();
  userLogoutEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(private http: HttpClient) {
    const savedUserData = localStorage.getItem('userData');
    if(savedUserData){
      this.currentUserData.next(JSON.parse(savedUserData));
      this.currentUserLoginOn.next(true);
    }
  }
  login(credentials: LoginRequest): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/api/Account/loginWeb?Email=${credentials.email}&Password=${credentials.password}`, credentials).pipe(
      tap((userData: User) => {
        this.currentUserData.next(userData);
        this.currentUserLoginOn.next(true);
        localStorage.setItem('userData', JSON.stringify(userData));
      }),
      catchError(this.handleError)
    );
  }

  logout(){

    this.currentUserLoginOn.next(false);
    localStorage.removeItem('userData');
    this.userLogoutEvent.emit;
    localStorage.clear();
    catchError(this.handleError);
  }

  private handleError(error:HttpErrorResponse){
    if(error.status==0){
      console.error('Se ha producido un error ', error);
    }
    else{
      console.error('BackEnd retorna codigo de estado', error.status, error.error);
    }
    return throwError(()=> new Error('Algo fallo. intentar denuevo'));
  }

  setUserLoggedIn(userData: User) {
    this.currentUserData.next(userData);
    this.currentUserLoginOn.next(true);
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  isUserLoggedIn(): boolean {
    return this.currentUserLoginOn.value;
  }

  getCurrentUserData(): User | undefined {
    return this.currentUserData.value;
  }

  get userData():Observable<User | undefined>{
    return this.currentUserData.asObservable();
  }

  get userLoginOn(): Observable<boolean>{
    return this.currentUserLoginOn.asObservable();
  }


}
