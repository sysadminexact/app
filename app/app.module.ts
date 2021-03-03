import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { HTTP } from '@ionic-native/http';

import { Push } from '@ionic-native/push';
import { Network } from '@ionic-native/network';

import { ToastProvider } from '../providers/toast/toast';
import { NetworkProvider } from '../providers/network/network';
import { HttpExactProvider } from '../providers/http-exact/http-exact';

import 'rxjs/add/operator/mergeMap'; 


@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Push,
    HTTP,
    Network,
    ToastProvider,
    NetworkProvider,
    HttpExactProvider,
  
  ]
})
export class AppModule {}
