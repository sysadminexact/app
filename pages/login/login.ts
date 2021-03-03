import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../interface/user';
import { NetworkProvider } from '../../providers/network/network';
import { ToastProvider } from '../../providers/toast/toast';
import { HttpExactProvider } from '../../providers/http-exact/http-exact';
import { MyApp } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage 
{
  user = {} as User;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private network: NetworkProvider, 
    private toast: ToastProvider,
    private http: HttpExactProvider,
    private myapp: MyApp) 
    {
      // this.user.email="administrador@mail.com.br"
      // this.user.password="abc123"
    }

  login(user: User)
  {
    if (this.network.isOnline)
    {
      this.toast.showLoader();

      this.http.login({ "username" : user.email, "password" : user.password })
      .then(async (result) => 
      {
        console.log("Login --> SUCCESS");
        console.log("status = "+ result.status);
        
        let data = JSON.parse(result.data);
        
        if(data.access_token)
        {
          console.log("Salvando token localStorage...");
          console.log(data.access_token);
          localStorage.setItem('access_token', data.access_token);
          this.http.token = data.access_token;

          await this.http.getPushToken();
        
          this.http.setUserName()
            .then(data =>{
              let dados = JSON.parse(data.data);
              // console.log("setUserName = "+ dados.name);
              localStorage.setItem('user_name', dados.name);
              localStorage.setItem('user_perfil', dados.perfil);
              this.myapp.rootPage ="HomePage";
              this.navCtrl.setRoot('HomePage');
          }).catch(error =>{
            console.log("setUserName --> ERROR");
            console.log("status = "+ error.status);
            this.toast.hideLoader();
          })
            this.toast.hideLoader();
        }else{
          console.log("Login --> TOKEN NÃO ENCONTRADO");
          this.toast.hideLoader();
          this.toast.create('Token de acesso não encontrado!\nPor favor tente novamente', 3000, 'middle');
        }
      }).catch(error => 
      {
        console.log("Login --> ERROR");
        console.log("status = "+ error.status);
        this.toast.hideLoader();
        this.toast.showLoginErrorMsg();
      });
    }else
    {
      this.toast.showConnectionOffline();
    }
  }

}
