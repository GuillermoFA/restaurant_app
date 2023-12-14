import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrl: './admins.component.css'
})
export class AdminsComponent implements OnInit, OnDestroy {
  usersData: any = [];
  adminsData: any = [];
  constructor(private users: UsersService, private router: Router ) { }
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  private baseUrl = 'http://localhost:5145/'; //cambiar


  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };
    this.showAdmins();

  }

  showAdmins(){
    this.users.getAdmins().subscribe((data) => {
      this.adminsData = data;
      console.log(this.adminsData);
      this.dtTrigger.next(data);
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }


}
