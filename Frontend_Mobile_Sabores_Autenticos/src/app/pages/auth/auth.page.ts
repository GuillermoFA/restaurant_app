import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  form = new FormGroup({
    Email: new FormControl('', [Validators.required, Validators.email]),
    Password: new FormControl('', [Validators.required])
  })

  constructor(private customerService: CustomerService) { }

  ngOnInit() {
  }

  submit() {
    if (this.form.valid) {
      this.customerService.loginCustomer(this.form.value);
      this.form.reset();
    }
  }
}