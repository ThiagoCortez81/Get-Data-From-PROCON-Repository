import { Component, OnInit, HostBinding } from '@angular/core';
import { Dado } from '../../models/Dado';
import { ActivatedRoute, Router} from '@angular/router';

import { DadosService } from '../../services/dados.service';


@Component({
  selector: 'app-dado-form',
  templateUrl: './dado-form.component.html',
  styleUrls: ['./dado-form.component.css']
})
export class DadoFormComponent implements OnInit {

  //@HostBinding('class') classes = 'row';

  dado: Dado ={
    
    id_endp: 0,
    url_endp: '',
    created_at: new Date()

    
    /** 
    id_endp: 0,
    AnoCalendario: 0,
    DataArquivamento: null,
    DataAbertura: null,
    CodigoRegiao: 0,
    Regiao: '',
    Uf:'',
    RazaoSocial:'',
    NomeFantasia:'',
    Tipo: 0,
    NumeroCNPJ:'',
    RadicalCNPJ:'',
    RazaoSocialRFB:'',
    NomeFantasiaRFB:'',
    CNAEPrincipal:'',
    DescCNAEPrincipal:'',
    Atendida:'',
    CodigoAssunto: 0,
    DescricaoAssunto:'',
    CodigoProblema: 0,
    DescricaoProblema:'',
    SexoConsumidor:'',
    FaixaEtariaConsumidor:'',
    CEPConsumidor: ''
    */
  };
  
  edit: boolean  = false;

  constructor(private dadosService: DadosService, private router: Router, private activedRoute: ActivatedRoute) { }

  ngOnInit() {
     const params = this.activedRoute.snapshot.params;
     
     

     if(params.id_endp){
       this.dadosService.getDado(params.id_endp)
        .subscribe(
          res =>{
            console.log(res);
            this.dado = res;
            this.edit = true;
          },
          err => console.error(err)
        )
     }
  }

  saveNewDado(){
    delete this.dado.created_at;
    delete this.dado.id_endp;
    
    this.dadosService.saveDado(this.dado)
      .subscribe(
        res =>{
          console.log(res);
          this.router.navigate(['/dados']);
        },
        err => console.error(err)
      )
  }

  updateDado(){
    delete this.dado.created_at;

    this.dadosService.updateDado(this.dado.id_endp, this.dado)
    .subscribe(
      res =>{
        console.log(res);
        this.router.navigate(['/dados']);
      },
      err => console.log(err)
    )
  }
}
