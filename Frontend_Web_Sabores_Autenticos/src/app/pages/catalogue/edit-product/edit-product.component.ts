import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CatalogueService } from 'src/app/services/catalogue/catalogue.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit {
  productForm: FormGroup;
  productId: number = 0;
  product: any;
  errorMessages: any = {};
  previewImageUrl: string | ArrayBuffer | null = null;

  constructor(private productService: CatalogueService,private route: Router, private router: ActivatedRoute, private formBuilder: FormBuilder) {
    this.productForm = this.formBuilder.group({
      PdtName: ['', Validators.required],
      PdtDescription: ['', Validators.required],
      Price: ['', [Validators.required, Validators.min(0)]],
      ImageFile: [null],  // Nuevo campo para el archivo
    });

  }

  ngOnInit(): void {
    const idParam = this.router.snapshot.params['id'];
    if (idParam) {
      this.productId = +idParam;
      this.productService.getProduct(this.productId).subscribe(
        (product: any) => {
          this.productForm.patchValue({
            PdtName: product.pdtName,
            PdtDescription: product.pdtDescription,
            Price: product.price,
          });
        },
        (error) => {
          console.error('Error al obtener el producto.', error);
        }
      );
    } else {
      console.error('Error al obtener el producto.');
    }
  }
  editProduct() {
    const updateProduct: any = this.productForm.value;

    const formData = new FormData();
    formData.append('PdtName', updateProduct.PdtName);
    formData.append('PdtDescription', updateProduct.PdtDescription);
    formData.append('Price', updateProduct.Price);
    const imageFileControl = this.productForm.get('ImageFile');
    formData.append('ImageFile', imageFileControl ? imageFileControl.value : null);

    if (this.productId !== undefined) {
      this.productService.editProduct(formData, this.productId).subscribe(
        () => {
          console.log('Producto actualizado correctamente.');
          this.productForm.reset();
          this.route.navigate(['/catalogo']);
        },
        (error) => {
          console.error('Error al actualizar el producto.', error);

          // Mostrar detalles específicos del error en la consola
          console.log('Detalles del error:', error);
        }
      );
    } else {
      console.error('ID no encontrado.');
    }
  }

  sureUpdate() {
    const confirmUpdate = confirm('¿Seguro que quieres editar el producto?');
    if (confirmUpdate) {
      // Restablecer el formulario a los valores originales o limpiar cambios no guardados
      this.productForm.reset();
      console.log('Actualización realizada. Formulario restablecido.');
      this.route.navigate(['/dashboard']);  // Redirigir a la página principal
    }
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.errorMessages = {};
      for (const control in this.productForm.controls) {
        if (this.productForm.controls.hasOwnProperty(control)) {
          const errors = this.productForm.controls[control].errors;
          if (errors) {
            this.errorMessages[control] = this.getErrorMessages(control, errors);
          }
        }
      }
      console.log(this.errorMessages);
      console.log('Formulario inválido. Revise los mensajes de error.');
      return;
    }
    console.log('Formulario válido. Enviar datos al servidor.');
  }


  cancelUpdate() {
    this.productForm.reset();
    console.log('Insert cancelada. Formulario restablecido.');
    this.route.navigate(['/catalogo']);
  }


  private getErrorMessages(control: string, errors: any): string {
    const messages: any = {
      required: `${control.charAt(0).toUpperCase() + control.slice(1)} es obligatorio.`,
      email: 'Ingrese un correo electrónico válido.',
      validateRut: 'Ingrese un RUT válido.',
      min: `${control.charAt(0).toUpperCase() + control.slice(1)} debe ser igual o mayor que 0.`,
      // Otras validaciones según sea necesario
    };

    return messages[Object.keys(errors)[0]];
  }

  onImageChange(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Lee y muestra una vista previa de la imagen
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImageUrl = reader.result;
      };
      reader.readAsDataURL(file);

      // Actualiza el valor del campo ImageFile en el formulario
      this.productForm.patchValue({
        ImageFile: file
      });
    }
  }

}
