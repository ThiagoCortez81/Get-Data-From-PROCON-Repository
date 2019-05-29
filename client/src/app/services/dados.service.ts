import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Dado } from '../models/Dado';

import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class DadosService {

  API_URL = '/api';

  constructor(private http: HttpClient) { }

  getDados(){
    return this.http.get( `${this.API_URL}/dados`);
  }

  getDado(idEndp: string){
    return this.http.get( `${this.API_URL}/dados/${idEndp}`);
  }

  deleteDado(idEndp: string){
    return this.http.delete( `${this.API_URL}/dados/${idEndp}`);
    
  }

  saveDado(dado: Dado){
    return this.http.post( `${this.API_URL}/dados`,dado);
  }

  updateDado(idEndp: string|number,updateDado: Dado): Observable<Dado> {
    return this.http.put( `${this.API_URL}/dados/${idEndp}`,updateDado);
  
  }


}
