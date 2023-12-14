import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/auth/login.service';
import { CookieService } from 'ngx-cookie-service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let cookieServiceSpy: jasmine.SpyObj<CookieService>;
  let formBuilder: FormBuilder;

  beforeEach(() => {
    const loginSpy = jasmine.createSpyObj('LoginService', ['login', 'logout']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const cookieServiceSpyObj = jasmine.createSpyObj('CookieService', ['set']);

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: LoginService, useValue: loginSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: CookieService, useValue: cookieServiceSpyObj },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loginServiceSpy = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    cookieServiceSpy = TestBed.inject(CookieService) as jasmine.SpyObj<CookieService>;
    formBuilder = TestBed.inject(FormBuilder);
  });

  it('Existe un componente LoginComponent', () => {
    expect(component).toBeTruthy();
  });

  it('Marcar todos los campos', () => {

    spyOn(component.loginForm, 'markAllAsTouched');
    component.login();
    expect(component.loginForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('No se llama al servicio de login si el formulario es inválido', () => {

    const fixture = TestBed.createComponent(LoginComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    const form = app.loginForm;
    const email = app.loginForm.controls.email;
    email.setValue('guillermofuentes24@gmail.com')
    expect(form.invalid).toBeTrue();

  });

  it('Formulario Válido', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    let email = app.loginForm.controls['email'];
    let password = app.loginForm.controls['password'];

    email.setValue('admin@gmail.com');
    password.setValue('admin1');

    expect(app.loginForm.invalid).toBeFalse();

  });

});
