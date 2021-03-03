import { Component, ViewChild, HostListener } from '@angular/core';
import { ViewController , NavParams, IonicPage } from 'ionic-angular';
import { Ordem } from '../../interface/Ordem';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';

@IonicPage()
@Component({
  selector: 'page-modal-os-details',
  templateUrl: 'modal-os-details.html',
})
export class ModalOsDetailsPage {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  height = ((window.innerHeight / 2) +30);
  width = (window.innerWidth -20); 
  completed = false;
  
  signaturePadOptions: Object = { 
    'minWidth': 0.1,
    'canvasWidth': this.width,
    'canvasHeight':  this.height
  };

  details: Ordem;
  index: number;
  assuntos: string[];
  observacoes: string[];
  observacoes_internas: string[];
  decisao: string = "";
  temp: string = "";
  txaRejeitar: string = "";
  perfil = "";

  constructor(  public params: NavParams, public viewCtrl: ViewController ) {
    this.perfil = localStorage.getItem("user_perfil");
    this.details = this.params.get("data");
    this.index = this.params.get("index");
    
    this.assuntos = this.details.OS_ASSUNTOS.split("\n");
    this.observacoes = this.details.OS_OBSERVACOES.split("\n");
    this.observacoes_internas = this.details.OS_OBSERVACOES_INTERNAS.split("\n");

    // console.log("PERFIL = "+ this.perfil);
    // console.log("OBSERVACOES INTERNAS = "+ this.observacoes_internas);
  }

  unselectSegment(){
    if(this.decisao == "assinar" && this.details.OS_ASSINA == "false"){
      let data = { 'status': 'assinado', "ordem_id": this.details.OS_ID, "assinatura": "", "index": this.index };
      this.viewCtrl.dismiss(data);
    }else{
      if(this.decisao == this.temp){
        this.decisao = '';
        this.temp = '';
        this.completed = false;
      }else{
        this.temp = this.decisao;
      }
    }
   
    if(this.decisao == 'rejeitar'){
      this.completed = false;
    }
  }

  assinar(){
    this.details.OS_ASSINATURA = this.signaturePad.toDataURL();
    let data = { 'status': 'assinado', "ordem_id": this.details.OS_ID, "assinatura": this.details.OS_ASSINATURA, "index": this.index };
    this.viewCtrl.dismiss(data);
  }
  rejeitar(){
    let data = { 'status': 'rejeitado', "ordem_id": this.details.OS_ID, "motivo": this.txaRejeitar, "index": this.index };
    this.viewCtrl.dismiss(data);
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if(this.signaturePad !== undefined){
      this.signaturePad.clear();

      this.height = ((window.innerHeight / 2) +30);
      this.width = (window.innerWidth -20); 

      this.signaturePad.set("canvasWidth", this.width);
      this.signaturePad.set("canvasHeight", this.height);

      console.log("width = " + window.innerWidth);
      console.log("height = " + window.innerHeight);
    }
  }

  ionViewDidLoad() {
    //this.signaturePad.clear(); 
  }

  drawComplete() {
    this.completed = true;
  }

  clear(){
    this.signaturePad.clear();
    this.completed = false;
  }
  
  hideFooter(){
   return (this.decisao == 'assinar' && this.completed) || (this.decisao == 'rejeitar' && this.txaRejeitar != '') || (this.decisao == '') ? true : false;
  }

}
