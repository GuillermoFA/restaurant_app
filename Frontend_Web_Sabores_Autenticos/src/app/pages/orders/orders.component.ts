import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { OrdersService } from 'src/app/services/orders/orders.service';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],

})
export class OrdersComponent {
  waitOrdersData: any = [];
  onOrdersData: any = [];
  constructor(private ordersService: OrdersService) { }
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  historyData: any = [];

  ngOnInit(){
    this.dtOptions = {
      language : {
        url: 'https://cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
      },
      pagingType: 'full_numbers',

    };

  }

}
