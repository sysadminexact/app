import { Component } from '@angular/core';
import { NavController, IonicPage, ModalController } from 'ionic-angular';
import { Ordem } from '../../interface/Ordem';
import { HttpExactProvider } from '../../providers/http-exact/http-exact';
import { ToastProvider } from '../../providers/toast/toast';
import { HttpErrorResponse } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  user_name: string;
  today = new Date();
  ordens : Array <Ordem> = [];

  constructor(public navCtrl: NavController, 
              private modalCtrl: ModalController, 
              private http: HttpExactProvider,
              private toast: ToastProvider) 
  {}

  ionViewDidLoad(){
   this.user_name = localStorage.getItem('user_name');
   this.toast.showLoader();
   this.getOS();

  //  this.ordens = [];
  //  this.ordens.push({
  //   OS_ID: "AZ00004",
  //   OS_ASSINATURA: '',
  //   OS_NUMERO: "AZ00004",
  //   OS_EMISSAO: "2019-04-07",
  //   OS_ANALISTA: "André Zingra de Lima",
  //   OS_EMPRESA: "Jarvis do Brasil Ferramentas Industriais Ltda",
  //   OS_DESC: "",
  //   OS_PROJETO: "Demanda",
  //   OS_DATA: "2019-04-07",
  //   OS_AREA: "Demanda",
  //   OS_CONSULTORIA: "Demanda",
  //   OS_ATENDIMENTO: "Demanda",
  //   OS_ASSUNTOS: "Demanda",
  //   OS_INICIO: "07:30",
  //   OS_INTERVALO: "01:00",
  //   OS_TERMINO: "15:00",
  //   OS_TRANSLADO: "00:30",
  //   OS_TOTAL: "05:30",
  //   OS_DATA_ASSINATURA: "",
  //   OS_OBSERVACOES: "",
  //   OS_OBSERVACOES_INTERNAS: "",
  //   OS_ASSINA: ""
  // })
  }

  getOS(){
    this.http.getOs('pendentes')
      .then( result =>{
        console.log("Home getOs --> SUCCESS");
        console.log("status = "+ result.status );
        
        if(result.data.charAt(0) != "<"){

          let data = JSON.parse(result.data);
          this.ordens = [];
          
          data.forEach(DATA => {
            this.ordens.push({
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
    }).catch( (error: HttpErrorResponse) =>{
        console.log("Home getOs --> ERROR");
        console.log("status = "+ error.status);
        this.toast.hideLoader();
    });
  }

  openModalDetails(os : Ordem, i: number){
    let data = { data: os, index: i };
    let modal = this.modalCtrl.create('ModalOsDetailsPage', data);
    
    modal.onDidDismiss(retorno => {
      if(retorno !== undefined){
        
        if(retorno.status == "assinado")
        {
          this.http.sentSignature(retorno.ordem_id, retorno.assinatura)
            .then(result =>
              { 
                console.log("Home sentSignature --> SUCCESS");
                console.log("status = "+ result.status);
                console.log("data = "+ result.data);
      
                let data = result.data;

                if(data == "true"){
                  console.log("Home sentSignature --> True (salvou)");
                  this.toast.showCustomMessage("Assinado com sucesso!", 3000, "middle");
                  this.ordens.splice(retorno.index, 1);
                }else{
                  console.log("Home sentSignature --> False (Não salvou)");
                  this.toast.showSendError('assinatura');
                }
              }).catch( (error : HttpErrorResponse) =>{
                console.log("Home sentSignature --> ERROR");
                console.log("status = "+ error.status);
                console.log("error = "+ error.error);
                console.log("retorno.ordem_id = "+ retorno.ordem_id);
                console.log("retorno.assinatura = "+ retorno.assinatura);
                this.toast.showSendError('assinatura');
              });
          
        }else if(retorno.status =="rejeitado"){
          this.http.rejectOs(retorno.ordem_id, retorno.motivo)
          .then(result =>{
            console.log("Home rejectOs --> SUCCESS");
            console.log("status = "+ result.status);

            let data = result.data;

            if(data == "true"){
              console.log("Home rejectOs --> True (salvou)");
              this.toast.showCustomMessage("Rejeitado com sucesso!", 3000, "middle");
              this.ordens.splice(retorno.index, 1);

            }else{
              console.log("Home rejectOs --> False (Não salvou)");
              this.toast.showSendError('rejeição');
            }
          }).catch( (error : HttpErrorResponse) =>{
            console.log("Home rejectOs --> ERROR");
            console.log("status = "+ error.status);
            this.toast.showSendError('rejeição');
          });
        }
   
      }
    });
    modal.present();
  }

  doRefresh(refresher) {
    this.getOS();

    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

}
