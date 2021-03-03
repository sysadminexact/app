import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalOsDetailsPage } from './modal-os-details';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  declarations: [
    ModalOsDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalOsDetailsPage),
    SignaturePadModule,
  ],
  exports:[
    ModalOsDetailsPage
  ]
})
export class ModalOsDetailsPageModule {}
