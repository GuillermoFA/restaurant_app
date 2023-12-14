import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  public hubConnection: signalR.HubConnection;
  profile: any;
  userRut: string = '';
  private url = 'http://localhost:5145/messagehub';

  constructor(private utilsService: UtilsService) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.url)
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection.start().then(() => {
      this.profile = this.utilsService.getFromLocalStorage('user');
      this.profile = JSON.parse(this.profile);
      this.userRut = this.profile.rut;
      this.hubConnection.invoke('AsignarUsuarioAGrupo', this.userRut);
      console.log(`Id de conexion actual: ${this.hubConnection.connectionId}`);
    }).catch(error => console.log('Error while starting connection: ' + error));
  }
}
