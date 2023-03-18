import { Component, OnInit,ViewChild } from '@angular/core';
import {LoadingController, MenuController, NavController, Platform, ToastController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {UsersService} from "../../services/users.service";
import { Network } from '@awesome-cordova-plugins/network/ngx';
import {CategoriesService} from "../../services/categories.service";
import {ActivatedRoute, Router} from '@angular/router';
import {StoresService} from "../../services/stores.service";
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
@Component({
  selector: 'app-appnotification',
  templateUrl: './appnotification.page.html',
  styleUrls: ['./appnotification.page.scss'],
})
export class AppnotificationPage implements OnInit {
  public fullName:any;
  public userId:any;
  public numberLogin:any;
  public catUserId:any;
  public points:any;
  public type:any;
  public email:any;
  public message:any;
  public operationResult:any;
  public returnPointsData:any;
  public returnArrayPointsFromServer:any;
  public returnPointsArray:any = [];
  public dataArch:any;
  public returnDataUser:any;
  public newNotifications:any=0;
  public returnNotfiData:any;
  public loopingNumber:any = 1;
  public returnPushData:any;
  public returnArrayPushFromServer:any;
  public returnPushArray:any = [];
  public push:any;
  constructor(private storesService : StoresService,private iab: InAppBrowser,private activaterouter : ActivatedRoute,private toastCtrl: ToastController,private loading: LoadingController,private usersService:UsersService,private router : Router,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private categoriesService:CategoriesService) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','pushnotification');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.navigateRoot("/home");
    });
  }
  async functionOpenLink(link:any){
    const browser = this.iab.create(link,'_system',{location:'yes',clearcache:'yes',toolbar:'no'});
  }
  async functionGetData(userId:any) {
    let limitNew = 0;
    this.usersService.allAppNotifications().then(async data=>{
      this.returnPushData = data;
      this.operationResult = this.returnPushData.Error.ErrorCode;
      if(this.operationResult==1){
        this.returnArrayPushFromServer = this.returnPushData.Data.notifications;
        this.returnPushArray=[];
        for(let i = 0; i < this.returnArrayPushFromServer.length;i++) {
          this.returnPushArray[i]=[];
          this.returnPushArray[i]['title'] = this.returnArrayPushFromServer[i].title;
          this.returnPushArray[i]['msg'] = this.returnArrayPushFromServer[i].msg;
          this.returnPushArray[i]['image'] = this.returnArrayPushFromServer[i].image;
          this.returnPushArray[i]['link'] = this.returnArrayPushFromServer[i].link;
          this.returnPushArray[i]['date'] = this.returnArrayPushFromServer[i].date;
        }
        let countOfData = this.returnPushArray.length;
        if(countOfData == 0)
          this.push = 0;
        else{
          this.push = 1;
        }
      }else
        this.push = 0;
      setTimeout(()=>{
        this.functionGetData(userId)
      },3500)
    }).catch(error=>{
      this.functionGetData(userId)
    });
  }
  async ngOnInit() {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: '',
      duration: 2500,
    });
    await loading.present();
    this.fullName = await this.storage.get('fullNameLogin');
    this.numberLogin = await this.storage.get('numberLogin');
    this.userId = await this.storage.get('userId');
    this.catUserId = await this.storage.get('catId');
    this.points = await this.storage.get('points');
    this.type = await this.storage.get('type');
    this.email = await this.storage.get('email');
    if(this.userId == null || this.numberLogin == null  || this.catUserId == null  || this.fullName == null){
      this.storage.remove('fullNameLogin');
      this.storage.remove('numberLogin');
      this.storage.remove('passwordLogin');
      this.storage.remove('type');
      this.storage.remove('userId');
      this.storage.remove('catId');
      this.storage.remove('subCatId');
      this.storage.remove('points');
      this.navCtrl.navigateRoot('login');
    }
    await this.usersService.information(this.userId).then(async data=>{
      this.returnDataUser = data;
      this.operationResult = this.returnDataUser.Error.ErrorCode;
      if(this.operationResult==1){
        this.points = this.returnDataUser.Data.points;
        await this.storage.set('points',this.points);
      }else{
        this.storage.remove('fullNameLogin');
        this.storage.remove('numberLogin');
        this.storage.remove('passwordLogin');
        this.storage.remove('type');
        this.storage.remove('userId');
        this.storage.remove('catId');
        this.storage.remove('subCatId');
        this.storage.remove('points');
        this.navCtrl.navigateRoot('login');
      }
    }).catch(e=>{
      this.storage.remove('fullNameLogin');
      this.storage.remove('numberLogin');
      this.storage.remove('passwordLogin');
      this.storage.remove('type');
      this.storage.remove('userId');
      this.storage.remove('catId');
      this.storage.remove('subCatId');
      this.storage.remove('points');
      this.navCtrl.navigateRoot('login');
      this.displayResult(this.message);
    })
    this.notifications();
    this.functionGetData(this.userId)
  }
  async notifications(){
    this.usersService.newNotifications(this.userId).then(async data=>{
      this.returnNotfiData = data;
      this.operationResult = this.returnNotfiData.Error.ErrorCode;
      if(this.operationResult==1){
        this.newNotifications = this.returnNotfiData.Data.numSelectNotifications;
      }else{
        this.newNotifications = 0;
      }
    }).catch(e=>{
      this.newNotifications = 0;
    })
    setTimeout(()=>{
      this.notifications();
    },3500)
  }
  async displayResult(message:any){
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: 'bottom',
      cssClass:"toastStyle",
      color:""
    });
    await toast.present();
  }
  functionGoToHome(){
    this.navCtrl.navigateRoot("/home");
  }
  functionGoInvitations(){
    this.navCtrl.navigateRoot("/invitations");
  }
  functionGoToSendPoint(){
    this.navCtrl.navigateRoot("/sendpoint");
  }
  functionGoToArchives(){
    this.navCtrl.navigateRoot("/archives");
  }
  functionOpenAccount(){
    this.navCtrl.navigateRoot("/account");
  }
  functionPushNotifications(){
    this.navCtrl.navigateRoot("/pushnotification");
  }
  async functionOpenMenue(){
    this.menu.enable(true,"last");
    this.menu.open("last");
  }
}
