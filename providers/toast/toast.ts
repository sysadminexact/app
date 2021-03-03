import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from 'ionic-angular';

@Injectable()
export class ToastProvider {
  
  loading: any = null;

  isLoading = false;

  constructor(private toast: ToastController, private loadingCtrl: LoadingController) {
  }

  create(msg: string, time: number, pos: string){
    this.toast.create({ message: msg, duration: time,  position: pos }).present();
  }

  showLoginErrorMsg(){
    this.toast.create({ message:"Login não autenticado!\nVerifique se digitou corretamente.", duration: 5000,  position: 'middle'  }).present();
  }

  showTryAgain(){
    this.toast.create({ message:"Falha de conexão!\nTente novamente em instantes.", duration: 5000,  position: 'middle'  }).present();
  }
  
  showSendError(tipo: string){
    this.toast.create({ message:"Não foi possível enviar "+ tipo +"!\nVerifique sua conexão de internet.", duration: 5000,  position: 'middle'  }).present();
  }

  showConnectionOnline(){
    this.toast.create({ message:"Conexão de internet restabelecida.", position: 'middle', showCloseButton: true, closeButtonText: "OK"  }).present();
  }

  showConnectionOffline(){
    this.toast.create({ message:"Sem conexão de Internet!", position: 'middle', showCloseButton: true, closeButtonText: "OK"  }).present();
  }

  showCustomMessage(msg: string, time: number, pos: string){
    this.toast.create({ message: msg, duration: time, position: pos }).present();
  }

  private showLoadingHandler(message) {
    if (this.loading == null) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.present();
    } else {
        this.loading.data.content = message;
    }
}

private hideLoadingHandler() {
    if (this.loading != null) {
        this.loading.dismiss();
        this.loading = null;
    }
}

public showLoader() {
    this.showLoadingHandler("Aguarde por favor...");
}

public hideLoader() {
    this.hideLoadingHandler();
}

}
