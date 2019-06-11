import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DadoListComponent } from './components/dado-list/dado-list.component';
import { DadoFormComponent } from './components/dado-form/dado-form.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/dados',
    pathMatch: 'full'
  },
  {
    path: 'dados',
    component: DadoListComponent
  },
  {
    path: 'dados/add',
    component: DadoFormComponent
  },
  {
    path: 'dados/edit/:id_endp',
    component: DadoFormComponent
  }
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
