import { Component, OnInit,ViewChild } from '@angular/core';
import {MenuController, Platform, NavController, IonSlides, ModalController, ToastController,IonInput} from '@ionic/angular';
import {Storage} from "@ionic/storage";
import {CategoriesService} from "../../services/categories.service";
import { Network } from '@awesome-cordova-plugins/network/ngx';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersService} from "../../services/users.service";
import { FirebaseMessaging } from '@awesome-cordova-plugins/firebase-messaging/ngx';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public categoriesHome:any=0;
  public categories:any='all';
  public operationResult:any;
  public returnCategoriesData:any;
  public returnArrayCategoriesFromServer:any;
  public returnCategoriesArray:any = [];
  public fullNameLogin:any;
  public emailLogin:any;
  public returnData:any;
  public fullName:any;
  public userId:any;
  public numberLogin:any;
  public catId:any;
  public points:any;
  public type:any;
  public email:any;
  public newNotifications:any=0;
  public returnNotfiData:any;
  public isActive:any;
  public active:any;
  public message:any;
  public returnDataUser:any;
  public searchVal:any;
  public returnSettingData:any;
  public image:any;
  public operationResultVal:any;
  constructor(private firebaseMessaging : FirebaseMessaging,private toastCtrl: ToastController,private usersService:UsersService,private router : Router,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private categoriesService:CategoriesService) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','home');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
  }
  checkSearch(event:any){
    this.searchVal = event.target.value;
  }
  searchValues(){
    this.navCtrl.navigateRoot(['/search', {searchVal:this.searchVal}])
  }
  async ngOnInit() {
    this.fullName = await this.storage.get('fullNameLogin');
    this.numberLogin = await this.storage.get('numberLogin');
    this.userId = await this.storage.get('userId');
    this.catId = await this.storage.get('catId');
    this.points = await this.storage.get('points');
    this.type = await this.storage.get('type');
    this.isActive = await this.storage.get('isActive');
    this.active = await this.storage.get('active');
    if(this.userId == null || this.numberLogin == null || this.catId == null || this.type == null || this.type == null){
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
    await this.categoriesService.setting().then(async data=>{
      this.returnSettingData = data;
      this.operationResultVal = this.returnSettingData.Error.ErrorCode;
      if(this.operationResultVal==1){
        await this.storage.set('facebookLink',this.returnSettingData.Data.facebookLink);
        await this.storage.set('youtupeLink',this.returnSettingData.Data.youtupeLink);
        await this.storage.set('instagramLink',this.returnSettingData.Data.instagramLink);
      }
    });
    this.categoriesService.categories().then(data=>{
      this.returnCategoriesData = data;
      this.operationResult = this.returnCategoriesData.Error.ErrorCode;
      if(this.operationResult==1){
        this.returnArrayCategoriesFromServer = this.returnCategoriesData.Data.categories;
        for(let i = 0; i < this.returnArrayCategoriesFromServer.length;i++) {
          this.returnCategoriesArray[i]=[];
          this.returnCategoriesArray[i]['id'] = this.returnArrayCategoriesFromServer[i].id;
          this.returnCategoriesArray[i]['title'] = this.returnArrayCategoriesFromServer[i].title;
          this.returnCategoriesArray[i]['image'] = this.returnArrayCategoriesFromServer[i].image;
        }
        let countOfData = this.returnCategoriesArray.length;
        if(countOfData == 0)
          this.categories = 0;
        else{
          this.categories = 1;
        }
      }else
        this.categories = 0;
    });
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
    await this.checkIfSiteWork();
    this.notifications();
    await this.categoriesService.settingVal().then(async data=>{
      this.returnSettingData = data;
      this.operationResult = this.returnSettingData.Error.ErrorCode;
      if(this.operationResult==1){
        this.image = this.returnSettingData.Data.image;
      }
    });
    this.functionInsertTocken()
  }
  async functionInsertTocken(){
    await this.firebaseMessaging.getToken().then(token => {
      this.usersService.updateUserToken(this.userId,token).then(async data=>{
      })
    });
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
  async checkIfSiteWork(){
    this.usersService.checkIfSiteWorkApi().then(async data=>{
      this.returnData = data;
      this.operationResult = this.returnData.Error.ErrorCode;
      if(this.operationResult!=1){
        this.navCtrl.navigateRoot("/sitework");
      }
    }).catch(e=>{
      this.navCtrl.navigateRoot("/sitework");
    })
  }
  functionGoServices(catId:any,catName:any){
    this.navCtrl.navigateRoot(['/services', {catId:catId,catName:catName}])
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
  async functionOpenMenue(){
    this.menu.enable(true,"last");
    this.menu.open("last");
  }
}
