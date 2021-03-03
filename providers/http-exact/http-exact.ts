import {Injectable} from '@angular/core';
import { HTTP } from '@ionic-native/http';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

import 'rxjs/add/operator/map';
import { HttpErrorResponse } from '@angular/common/http';

let url = 'http://app.exactsolution.com.br/api';

@Injectable()
export class HttpExactProvider {

  public token = "";
  
  constructor(private http: HTTP, private push: Push) 
  {
    this.token = localStorage.getItem('access_token');
  }

  login(credentials) {
      return this.http.post(url + "/login", credentials, {} );
  }

  logout() {
    return this.http.post(url + "/logout", {}, {"Authorization": "Bearer "+ this.token} );
  }

  getOs(tipo: string){
      return this.http.get(url + "/os/"+ tipo, {}, {"Authorization": "Bearer "+ this.token});
  }

  setUserName(){
    return this.http.get(url + "/usuarios/perfil", {}, {"Authorization": "Bearer "+ this.token});
  }

  sentSignature(ordem_id: string, assinatura: string){
    return this.http.put(url + "/os/" + ordem_id + "/assinar", { assinatura: assinatura },  {"Authorization": "Bearer "+ this.token});
  }

  rejectOs(ordem_id: string, motivo: string){
     return this.http.put(url + "/os/" + ordem_id + "/rejeitar",{ motivo_rejeicao: motivo },  {"Authorization": "Bearer "+ this.token});
  }

  getPushToken(){
    const options: PushOptions = {
      android: {
        senderID: 'com.exactsolution.app',
        sound: 'true',
        vibrate: true,
        forceShow: "1",
      },
      ios: {
        alert: 'true',
        badge: 'true',
        sound: 'true',
        clearBadge: 'true'
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);
    pushObject.on('registration')
      .subscribe(data =>{ //.subscribe((data: any) => {
      console.log("getPushToken --> PUSH TOKEN");
      console.log(data.registrationId);

       this.putPushToken(data.registrationId)
        .then(result =>{
          console.log("PUT PUSH TOKEN TO SEVER --> SUCCESS");
          console.log("status = "+ result.status);
        }).catch( (error:HttpErrorResponse) =>{
          console.log("updatePushToken --> ERROR");
          console.log("status = "+ error.status);
        })
    })
  }

  putPushToken(registrationId){
    return this.http.put(url + "/usuarios/token", { push_token: registrationId }, {"Authorization": "Bearer "+ this.token});
  }

}