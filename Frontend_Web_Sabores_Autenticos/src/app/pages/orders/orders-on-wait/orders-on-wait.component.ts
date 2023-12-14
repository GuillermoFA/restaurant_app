import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { OrdersService } from 'src/app/services/orders/orders.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders-on-wait',
  templateUrl: './orders-on-wait.component.html',
  styleUrl: './orders-on-wait.component.css'
})
export class OrdersOnWaitComponent {
  activeOrder: any = [];
  products: any = [];
  ordersData: any = [];
  constructor(private ordersService: OrdersService, private route: Router) { }
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};

  ngOnInit(){
    this.ordersService.getWaitOrders().subscribe((data: any) => {

      console.log(data);
      for(let i = 0; i < data.length; i++){
        data[i].createdAt = [data[i].createdAt.slice(0, 10), ' ', data[i].createdAt.slice(11, 19)].join('');
      }

      this.ordersData = data;
      console.log(this.ordersData);
      this.dtTrigger.next(data);
      if(this.ordersData.length == 0){
        Swal.fire({
          title: "No hay pedidos en espera",
          text: "No existen pedidos que esten en espera en este instante, vuelva a intentarlo más tarde",
          icon: "error"

        }).then((result) => {
          if (result.isConfirmed) {
            this.route.navigate(['/pedidos']);
          }
        })
      }
    });



  }
  detail(order: any){
    this.activeOrder = order;
    console.log(this.activeOrder);
    this.products = order.products;
    const dialog = document.querySelector('dialog');


    dialog?.showModal();
  }
  edit(id: any){
    Swal.fire({
      title: "Elije a que estado quieres cambiar el pedido",
      showDenyButton: true,
      showCancelButton: true,
      cancelButtonText: "Cancelar acción",
      confirmButtonText: "Preparar Pedido",
      denyButtonText: `Cancelar pedido`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.ordersService.toOnProgress(id).subscribe((data: any) => {},
        (error) => {
          console.log(error);
          Swal.fire("Error al enviar a preparar el pedido", "", "error",);
        })
        Swal.fire({
          title: `Pedido ${id} en preparación!`,
          icon: 'success',
          confirmButtonText: 'OK',

        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        })

      } else if (result.isDenied) {
        this.ordersService.toCancel(id).subscribe((data: any) => {},
        (error) => {
          console.log(error);
          Swal.fire("Error al cancelar el pedido", "", "error",);
        })
        Swal.fire({
          title: `Pedido ${id} cancelado`,
          icon: 'error',
          confirmButtonText: 'OK',

        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        })
      }
    });
  }


}


