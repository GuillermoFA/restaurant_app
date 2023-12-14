import { Component,OnInit,OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { CatalogueService } from 'src/app/services/catalogue/catalogue.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit, OnDestroy {
  productsData: any[] = [];
  apiUrl = 'http://localhost:5145/images/';
  constructor(private productsService: CatalogueService, private router: Router) {

  }
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};



  ngOnInit(){
    this.showProducts();
  }
  showProducts(){
    this.productsService.getProducts().subscribe((data: any) => {
      this.productsData = data;
      this.dtTrigger.next(data);
      console.log(data);
    });
  }
  addProduct(){
    this.router.navigate(['catalogo/nuevo-producto']);
  }
  editProduct(id: number){
    this.router.navigate(['catalogo/editar-producto', id]);
  }

  deleteProduct(id: number){
    const confirmDelete = confirm('¿Seguro que quieres eliminar este producto?');
    if (confirmDelete){
      this.productsService.deleteProduct(id).subscribe((data: any) => {
        console.log(data);
        this.showProducts();
      });
    }
  }


  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();

  }



}
