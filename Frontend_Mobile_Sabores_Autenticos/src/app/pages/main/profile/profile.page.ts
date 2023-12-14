import { Component, OnInit, inject } from '@angular/core';
import { SignalRService } from 'src/app/services/signal-r.service';
import { UtilsService } from 'src/app/services/utils.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  utilsService = inject(UtilsService);

  profile: any;
  isOrderReady = false;

  constructor(private signalRService: SignalRService) { }

  ngOnInit() {
    this.profile = this.utilsService.getFromLocalStorage('user');
    this.profile = JSON.parse(this.profile);

    this.signalRService.hubConnection.on('OrderReady', (message) => {
      console.log(`Pedido listo: ${ message }`);
      this.isOrderReady = true;
    });
  }

}
