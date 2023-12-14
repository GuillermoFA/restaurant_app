import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  
  form = new FormGroup({
    Rut: new FormControl('', [Validators.required, Validators.minLength(12), Validators.maxLength(12)]),
    Name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    Email: new FormControl('', [Validators.required, Validators.email]),
    Password: new FormControl('', [Validators.required])
  })

  constructor(private customerService: CustomerService) { }

  ngOnInit() {
  }

  submit() {
    this.customerService.registerCustomer(this.form.value);
  }

}
