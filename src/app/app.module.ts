import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
import {HttpClientModule} from "@angular/common/http";
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { FirebaseMessaging } from '@awesome-cordova-plugins/firebase-messaging/ngx';
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule,IonicStorageModule.forRoot()],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },FirebaseMessaging,FileTransfer,File,ImagePicker,Network,CallNumber,StatusBar,SocialSharing,Clipboard,InAppBrowser],
  bootstrap: [AppComponent],
})
export class AppModule {}
