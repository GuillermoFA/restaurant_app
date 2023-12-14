import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AddProductComponent } from './add-product.component';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogueService } from 'src/app/services/catalogue/catalogue.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { NavComponent } from 'src/app/shared/nav/nav.component';
import { CookieService } from 'ngx-cookie-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SidenavComponent } from 'src/app/shared/sidenav/sidenav.component';

describe('AddProductComponent', () => {
  let fixture: ComponentFixture<AddProductComponent>;
  let cookieServiceSpy: jasmine.SpyObj<CookieService>;
  let catalogueServiceSpy: jasmine.SpyObj<CatalogueService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let formBuilder: FormBuilder;
  let app: AddProductComponent;

  beforeEach(() => {
    const catalogueSpy = jasmine.createSpyObj('CatalogueService', ['addProduct']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const cookieServiceSpyObj = jasmine.createSpyObj('CookieService', ['set']);

    TestBed.configureTestingModule({
      declarations: [AddProductComponent, NavComponent, SidenavComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: CatalogueService, useValue: catalogueSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: CookieService, useValue: cookieServiceSpyObj },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddProductComponent);
    app = fixture.componentInstance;
    catalogueServiceSpy = TestBed.inject(CatalogueService) as jasmine.SpyObj<CatalogueService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    cookieServiceSpy = TestBed.inject(CookieService) as jasmine.SpyObj<CookieService>;
    formBuilder = TestBed.inject(FormBuilder);
  });

  it('Existe un componente AddProductComponent', () => {
    expect(app).toBeTruthy();
  });


  it('No se llama al servicio de addProduct si el formulario es inválido', () => {
    const fixture = TestBed.createComponent(AddProductComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    const form = app.productForm;
    const pdtName = app.productForm.controls['PdtName'];
    pdtName.setValue('Producto de prueba');

    expect(form.invalid).toBeTrue();
  });

  it('Formulario Válido con Imagen', () => {
    const pdtName = 'Producto de prueba';
    const pdtDescription = 'Descripción del producto de prueba';
    const qtyInStock = 10;
    const price = 2099;

    // Simular cambio de archivo
    const file = new File(['dummy'], 'dummy.jpg', { type: 'image/jpeg' });
    const input = { target: { files: [file] } };
    app.onImageChange(input);

    // Establecer el valor del formulario
    app.productForm.setValue({
      PdtName: pdtName,
      PdtDescription: pdtDescription,
      QtyInStock: qtyInStock,
      Price: price,
      img: file,
    });

    expect(app.productForm.valid).toBeTruthy();
  });

});




