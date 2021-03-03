import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Ordem } from '../../interface/Ordem';
import { HttpExactProvider } from '../../providers/http-exact/http-exact';
import { ToastProvider } from '../../providers/toast/toast';
import { HttpErrorResponse } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-historico',
  templateUrl: 'historico.html',
})
export class HistoricoPage {
  historico: Array < Ordem > = [];
  user_name: string;
  today = new Date();

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private modalCtrl: ModalController,
              private toast: ToastProvider,
              private http: HttpExactProvider) 
  {}

  ionViewDidLoad() {
    this.user_name = localStorage.getItem('user_name');
    this.toast.showLoader();
    this.getHistorico();
  }
  async getHistorico(){
    this.http.getOs('assinadas')
    .then( result =>{
      console.log("Historico getOs --> SUCCESS");
      console.log("status = "+ result.status);

      if(result.data.charAt(0) != "<"){
      
        let data = JSON.parse(result.data);
        this.historico = [];

        data.forEach(DATA => {
          this.historico.push({
            OS_ID: DATA.OS_ID,
            OS_ASSINATURA: '',
            OS_NUMERO: DATA.OS_NUMERO,
            OS_EMISSAO: DATA.OS_EMISSAO,
            OS_ANALISTA: DATA.OS_ANALISTA,
            OS_EMPRESA: DATA.OS_EMPRESA,
            OS_DESC: DATA.OS_DESC,
            OS_PROJETO: DATA.OS_PROJETO,
            OS_DATA: DATA.OS_DATA,
            OS_AREA: DATA.OS_AREA,
            OS_CONSULTORIA: DATA.OS_CONSULTORIA,
            OS_ATENDIMENTO: DATA.OS_ATENDIMENTO,
            OS_ASSUNTOS: DATA.OS_ASSUNTOS,
            OS_INICIO: DATA.OS_INICIO,
            OS_INTERVALO: DATA.OS_INTERVALO,
            OS_TERMINO: DATA.OS_TERMINO,
            OS_TRANSLADO: DATA.OS_TRANSLADO,
            OS_TOTAL: DATA.OS_TOTAL,
            OS_DATA_ASSINATURA: DATA.OS_DATA_ASSINATURA,
            OS_OBSERVACOES: DATA.OS_OBSERVACOES,
            OS_OBSERVACOES_INTERNAS: DATA.OS_OBSERVACOES_INTERNAS,
            OS_ASSINA: DATA.OS_ASSINA
          })
        });
      }
      this.toast.hideLoader();
    }).catch( (error : HttpErrorResponse) => {
      console.log("Historico getOs --> ERROR");
      console.log("status = "+ error.status);
      this.toast.hideLoader();
    });
  }

  verDetalhes(os: Ordem){
    let data = { data: os, index: -2 };
    let modal = this.modalCtrl.create('ModalOsDetailsPage', data);
    modal.present();
  }

  doRefresh(refresher) {
    this.getHistorico();

    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

}
