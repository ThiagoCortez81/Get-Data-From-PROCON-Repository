import { Component, OnInit, HostBinding } from '@angular/core';

import { DadosService } from '../../services/dados.service';

@Component({
  selector: 'app-dado-list',
  templateUrl: './dado-list.component.html',
  styleUrls: ['./dado-list.component.css']
})
export class DadoListComponent implements OnInit {

  //Sem esse comando o arquivo fica em lista com o comando fica um do lado do outro
  @HostBinding('class') classes = 'row';
  
  dados: any = [];

  constructor(private dadosService: DadosService) { }

  ngOnInit() {
   this.getDados();
  }

  getDados(){
    this.dadosService.getDados().subscribe(
      res => {
       this.dados = res;
      },
      err => console.error(err)
 
    )
  }


  //Implementando ou chamando funcão de deletar do Crud sync
  deleteDado(idEndp:string ){
    this.dadosService.deleteDado(idEndp).subscribe(
      res =>{
        console.log(res);
        this.getDados();

      },
      err => console.log(err)
    );
  }

  //Implementando ou chamando funcão de EDITAR do Crud sync
  


}
