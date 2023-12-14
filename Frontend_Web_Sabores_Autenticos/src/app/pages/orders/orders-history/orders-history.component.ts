import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { OrdersService } from 'src/app/services/orders/orders.service';

@Component({
  selector: 'app-orders-history',
  templateUrl: './orders-history.component.html',
  styleUrl: './orders-history.component.css'
})
export class OrdersHistoryComponent {
  activeOrder: any = [];
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
    this.showHistoryOrders();
  }
  showHistoryOrders(){
    this.ordersService.getHistoryOrders().subscribe((data: any) => {
      this.historyData = data;
      console.log(this.historyData);
      if(!this.verifyOrders(this.historyData)){

        const alert = document.getElementById('alert');
        const table = document.getElementById('historyTableDiv');
        if(alert != null && table != null){
          console.log('No hay ordenes');
          alert.style.display = 'block';
          table.style.display = 'none';
        }


      }
      this.dtTrigger.next(data);
    });



  }

  verifyOrders(historyData: any){
    if(historyData.length === 0){
      return false;
    }else{
      return true;
    }
  }
  detail(order: any){
    this.activeOrder = order;
    const dialog = document.querySelector('dialog');


    dialog?.showModal();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
