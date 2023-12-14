import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { CatalogueComponent } from './pages/catalogue/catalogue.component';
import { UsersComponent } from './pages/users/users.component';
import { AddAdminComponent } from './pages/users/add-admin/add-admin.component';
import { OrdersHistoryComponent } from './pages/orders/orders-history/orders-history.component';
import { OrdersOnProgressComponent } from './pages/orders/orders-on-progress/orders-on-progress.component';
import { OrdersOnWaitComponent } from './pages/orders/orders-on-wait/orders-on-wait.component';
import { AddProductComponent } from './pages/catalogue/add-product/add-product.component';
import { EditProductComponent } from './pages/catalogue/edit-product/edit-product.component';
import { AdminsComponent } from './pages/users/admins/admins.component';
import { ClientsComponent } from './pages/users/clients/clients.component';



const routes: Routes = [
  {path:'',redirectTo:'/iniciar-sesion',pathMatch:'full'},
  {path: 'inicio',component: DashboardComponent, canActivate: [AuthGuard] },
  {path: 'iniciar-sesion',component: LoginComponent },
  {path: 'pedidos',component: OrdersComponent, canActivate: [AuthGuard]},
  {path: 'catalogo',component: CatalogueComponent, canActivate: [AuthGuard]},
  {path: 'usuarios',component: UsersComponent, canActivate: [AuthGuard]},
  {path: 'usuarios/admins/nuevo-admin', component: AddAdminComponent, canActivate: [AuthGuard] },
  {path: 'pedidos/en-progreso', component: OrdersOnProgressComponent, canActivate: [AuthGuard] },
  {path: 'pedidos/en-espera', component: OrdersOnWaitComponent, canActivate: [AuthGuard] },
  {path: 'pedidos/historial', component: OrdersHistoryComponent, canActivate: [AuthGuard] },
  {path: 'catalogo/nuevo-producto', component: AddProductComponent, canActivate: [AuthGuard] },
  {path: 'catalogo/editar-producto/:id', component: EditProductComponent, canActivate: [AuthGuard] },
  {path: 'usuarios/admins', component: AdminsComponent, canActivate: [AuthGuard] },
  {path: 'usuarios/clientes', component: ClientsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
