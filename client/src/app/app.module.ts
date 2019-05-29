import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { DadoFormComponent } from './components/dado-form/dado-form.component';
import { DadoListComponent } from './components/dado-list/dado-list.component';

import { DadosService } from './services/dados.service';


@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    DadoFormComponent,
    DadoListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    DadosService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
