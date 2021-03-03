import { Component, ViewChild } from '@angular/core';
import { Nav, Events, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { NetworkProvider } from '../providers/network/network';
import { HttpExactProvider } from '../providers/http-exact/http-exact';

import { ToastProvider } from '../providers/toast/toast';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any, icon: string}>;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen, 
              private push: Push,
              private network: NetworkProvider,
              private events: Events,
              private toast: ToastProvider,
              private httpexact: HttpExactProvider) {

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Ínicio', component: "HomePage", icon: "home" },
      { title: 'Histórico', component: "HistoricoPage", icon: "list" },
      { title: 'Sair', component: "LoginPage", icon: "ios-log-out-outline" }
    ];
  }

  initializeApp() 
  {
    this.platform.ready().then(() => {
      console.log("initializeApp  --> LOGIN TOKEN");
      console.log(localStorage.getItem('access_token'));
     
     // this.rootPage = "HomePage";

      if(localStorage.getItem('access_token') != null && localStorage.getItem('access_token') != "")
      {
        this.rootPage = "HomePage";
      }else{
        this.rootPage = "LoginPage";
      }

      this.statusBar.styleDefault();
      // Corrigi bug de não aparecer icones no status bar no android
      if (this.platform.is('android')) {
        this.statusBar.overlaysWebView(false);
        this.statusBar.backgroundColorByHexString('#000000');
      }

      setTimeout(function() {
        if(this.splashScreen !== undefined){
          this.splashScreen.hide();
        }
      }, 4000);

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
  
      pushObject.on('notification').subscribe((notification: any) => {
        console.log('Received a notification', notification);
        // if(this.platform.is("ios") && notification.additionalData.foreground){
        // }
      });

      // pushObject.on('registration').subscribe((data: any) => {
      //   console.log('device token -> ' + data.registrationId);			
      // });

      pushObject.on('error').subscribe(error => {
        console.error('Error with Push plugin' + error)
      });

      this.network.initializeNetworkEvents();
      // Offline event
      this.events.subscribe('network:offline', () => {
          //alert('network:offline ==> '+this.network.type);    
          this.toast.showConnectionOffline();
      });
      // Online event
      this.events.subscribe('network:online', () => {
          //alert('network:online ==> '+this.network.type);        
          this.toast.showConnectionOnline();
      });

    });

  }

  openPage(page) {
    if(page.component == 'LoginPage'){
      
      if(this.network.isOnline){
        this.httpexact.logout()
        .then(result =>{
          if (result.data == "true"){
            localStorage.clear();
            this.nav.setRoot(page.component);
          }else{
            this.toast.showTryAgain();
          }
        }).catch(error =>{
          this.toast.showTryAgain();
        })
      }else{
        this.toast.showConnectionOffline();
      }

    }else{
      this.nav.setRoot(page.component);
    }
  }
}
