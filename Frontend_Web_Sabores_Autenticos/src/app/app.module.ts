import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './shared/footer/footer.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { NavComponent } from './shared/nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { OrdersComponent } from './pages/orders/orders.component';
import { CatalogueComponent } from './pages/catalogue/catalogue.component';
import { UsersComponent } from './pages/users/users.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { DataTablesModule } from 'angular-datatables'
import { AddAdminComponent } from './pages/users/add-admin/add-admin.component';
import { OrdersOnProgressComponent } from './pages/orders/orders-on-progress/orders-on-progress.component';
import { OrdersHistoryComponent } from './pages/orders/orders-history/orders-history.component';
import { OrdersOnWaitComponent } from './pages/orders/orders-on-wait/orders-on-wait.component';
import { AddProductComponent } from './pages/catalogue/add-product/add-product.component';
import { EditProductComponent } from './pages/catalogue/edit-product/edit-product.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClientsComponent } from './pages/users/clients/clients.component';
import { AdminsComponent } from './pages/users/admins/admins.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    DashboardComponent,
    LoginComponent,
    NavComponent,
    OrdersComponent,
    CatalogueComponent,
    UsersComponent,
    SidenavComponent,
    AddAdminComponent,
    OrdersOnProgressComponent,
    OrdersHistoryComponent,
    OrdersOnWaitComponent,
    AddProductComponent,
    EditProductComponent,
    ClientsComponent,
    AdminsComponent



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    DataTablesModule,
    BrowserAnimationsModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
