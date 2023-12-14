import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { SignalRService } from 'src/app/services/signal-r.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  orders: any = [];

  isOrderReady = false;

  constructor(private orderService: OrderService, private signalRService: SignalRService) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.orderService.getOrders(user.id).subscribe(
      (data) => {
        this.orders = data;
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

  ordersIsEmpty(): boolean {
    if (this.orders.length == 0) {
      return true;
    } else {
      return false;
    }
  }

  
}
