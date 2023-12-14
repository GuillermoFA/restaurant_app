import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { OrdersService } from 'src/app/services/orders/orders.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders-on-progress',
  templateUrl: './orders-on-progress.component.html',
  styleUrl: './orders-on-progress.component.css'
})
export class OrdersOnProgressComponent {
  activeOrder: any = [];
  products: any = [];
  ordersData: any = [];
  constructor(private ordersService: OrdersService, private route: Router) { }
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};

  ngOnInit(){
    this.ordersService.getOnOrders().subscribe((data: any) => {
      for(let i = 0; i < data.length; i++){
        data[i].createdAt = [data[i].createdAt.slice(0, 10), ' ', data[i].createdAt.slice(11, 19)].join('');
      }
      this.ordersData = data;
      console.log(this.ordersData);
      this.dtTrigger.next(data);
      if(this.ordersData.length == 0){
        Swal.fire({
          title: "No hay pedidos en progreso",
          text: "No existen pedidos que esten en progreso en este instante, vuelva a intentarlo más tarde",
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
      confirmButtonText: "Enviar Pedido",
      denyButtonText: `Cancelar pedido`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.ordersService.toHistory(id).subscribe((data: any) => {},
        (error) => {
          console.log(error);
          Swal.fire("Error al enviar el pedido", "", "error",);
        })
        Swal.fire({
          title: `Pedido ${id} enviado!`,
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
