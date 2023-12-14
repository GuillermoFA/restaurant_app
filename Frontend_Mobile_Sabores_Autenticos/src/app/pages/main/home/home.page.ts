import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { SignalRService } from 'src/app/services/signal-r.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  products: any[] = [];
  shoppingCart: any[] = [];
  idShoppingCart: any[] = [];
  isModalOpen = false;
  isOrderReady = false;
  totalPrice: number = 0;
  commentOrder = '';
  apiUrl = 'http://localhost:5145/images/';

  constructor(private productsService: ProductsService, private utilsService: UtilsService, private signalRService: SignalRService) {}

  ngOnInit() {
    this.productsService.getProducts().subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.log(error);
      }
    );

    this.signalRService.hubConnection.on('OrderReady', (message) => {
      console.log(`Pedido listo: ${ message }`);
      this.isOrderReady = true;
    });
  }
  
  addToTheShoppingCart(product: any) {
    this.shoppingCart.push(product);
    this.utilsService.presentToast({
      message: `Se ha agregado al carrito ${product.pdtName}.`,
      duration: 2500,
      color: 'warning',
      position: 'middle',
      icon: 'alert-circle-outline'
    });
    this.idShoppingCart.push(product.productId);
  }

  makeOrder() {
    if (this.shoppingCart.length == 0) {
      this.utilsService.presentToast({
        message: 'El carro de compras esta vacio',
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    } else {
      this.productsService.postOrder(this.idShoppingCart, this.commentOrder).subscribe(
        (data) => {
          this.utilsService.presentToast({
            message: 'Orden creada exitosamente',
            duration: 2500,
            color: 'success',
            position: 'middle',
            icon: 'alert-circle-outline'
          });
          this.isModalOpen = false;
          this.commentOrder = '';
          this.shoppingCart = [];
          this.idShoppingCart = [];
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  getText(event: CustomEvent) {
    this.commentOrder = (event.target as HTMLInputElement).value;
  }

  shoppingCartIsEmpty() {
    if (this.shoppingCart.length == 0) {
      return true;
    } else {
      return false;
    }
  }

}
