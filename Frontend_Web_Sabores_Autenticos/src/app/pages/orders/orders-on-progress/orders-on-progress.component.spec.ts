import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersOnProgressComponent } from './orders-on-progress.component';

describe('OrdersOnProgressComponent', () => {
  let component: OrdersOnProgressComponent;
  let fixture: ComponentFixture<OrdersOnProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersOnProgressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrdersOnProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
