import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersOnWaitComponent } from './orders-on-wait.component';

describe('OrdersOnWaitComponent', () => {
  let component: OrdersOnWaitComponent;
  let fixture: ComponentFixture<OrdersOnWaitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersOnWaitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrdersOnWaitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
