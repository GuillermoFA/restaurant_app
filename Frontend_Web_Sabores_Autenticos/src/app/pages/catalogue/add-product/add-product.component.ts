import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CatalogueService } from 'src/app/services/catalogue/catalogue.service';
import { Product } from 'src/app/services/catalogue/product';
import { HttpErrorResponse } from '@angular/common/http';
import { error } from 'jquery';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit{

  errorMessages: any = {};
  productForm: FormGroup;
  message: string = '';
  selectedFile: File | null = null;
  previewImageUrl: string | null = null;
  products: any[] = [];



  constructor(private productService: CatalogueService,private router: Router, private formBuilder: FormBuilder) {
    this.productForm = this.formBuilder.group({
      PdtName: ['', Validators.required],
      PdtDescription: ['', Validators.required],
      QtyInStock: ['', Validators.required],
      Price: ['', [Validators.required, Validators.min(0)]],
      img: [null, Validators.required]
    });
  }

  ngOnInit(): void {
  }

  addProduct() {
    const newProduct: any = this.productForm.value;
    const formData = new FormData();
    formData.append('PdtName', newProduct.PdtName);
    formData.append('PdtDescription', newProduct.PdtDescription);
    formData.append('QtyInStock', newProduct.QtyInStock);
    formData.append('Price', newProduct.Price);
    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    } else {
      formData.append('ImageFile', ''); // Valor predeterminado en caso de que this.selectedFile sea nulo
    }

    this.productService.addProduct(formData).subscribe(
      (createdProduct: any) => {
        if (createdProduct) {
          this.products.push(createdProduct);
          this.productForm.reset();
          this.router.navigate(['/catalogo']);
        } else {
          console.error('Error al crear producto.');
        }
      },
      (error) => {
        console.error('Error al crear producto.', error);
      }
    );
  }


  cancelUpdate() {
    this.productForm.reset();
    console.log('Insert cancelada. Formulario restablecido.');
    this.router.navigate(['/catalogo']);
  }

  onImageChange(event: any): void {
    const files = (event.target as HTMLInputElement).files;

    if (files && files.length > 0) {
      this.selectedFile = files[0];
    }
  }

}
