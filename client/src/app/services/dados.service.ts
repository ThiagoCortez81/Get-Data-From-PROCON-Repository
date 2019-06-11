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

  getDado(id_endp: string){
    return this.http.get( `${this.API_URL}/dados/${id_endp}`);
  }

  deleteDado(id_endp: string){
    return this.http.delete( `${this.API_URL}/dados/${id_endp}`);
    
  }

  saveDado(dado: Dado){
    return this.http.post( `${this.API_URL}/dados`,dado);
  }

  updateDado(id_endp: string|number,updateDado: Dado): Observable<Dado> {
    return this.http.put( `${this.API_URL}/dados/${id_endp}`,updateDado);
  
  }


}
