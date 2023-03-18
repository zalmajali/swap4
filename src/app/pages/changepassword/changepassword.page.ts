import { Component, OnInit,ViewChild } from '@angular/core';
import {LoadingController, MenuController, NavController, Platform, ToastController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {UsersService} from "../../services/users.service";
import { Network } from '@awesome-cordova-plugins/network/ngx';
import {CategoriesService} from "../../services/categories.service";
import {ActivatedRoute, Router} from '@angular/router';
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.page.html',
  styleUrls: ['./changepassword.page.scss'],
})
export class ChangepasswordPage implements OnInit {
  public operationResult:any;
  public fullNameLogin:any;
  public emailLogin:any;
  public iconValues = "chevron-back-outline";
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
  public message:any;
  public userImage:any="../../assets/imgs/def.png";
  public oldPassword:any;
  public errorOldPassword:any="";
  public isErrorOldPassword:any = 1;
  public newPassword:any;
  public errorNewPassword:any="";
  public isErrorNewPassword:any = 1;
  public reNewPassword:any;
  public errorReNewPassword:any="";
  public isErrorReNewPassword:any = 1;
  public isdisabled:boolean=true;
  public showOldPassword: boolean = false;
  public showNewPassword: boolean = false;
  public showReNewPassword: boolean = false;
  errorRePasswordMsg:any="";
  constructor(private toastCtrl: ToastController,private loading: LoadingController,private usersService:UsersService,private router : Router,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private categoriesService:CategoriesService) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','changepassword');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.navigateRoot("/home");
    });
  }
  checkOldPassword(event:any){
    this.errorOldPassword = "succsessFiled";
    this.isErrorOldPassword = 1;
    this.oldPassword = event.target.value;
    if(this.oldPassword == "" || this.oldPassword == undefined){
      this.errorOldPassword = "errorFiled";
      this.isErrorOldPassword = 0;
    }
    this.isEnterAllValues();
  }
  checkNewPassword(event:any){
    this.errorNewPassword = "succsessFiled";
    this.isErrorNewPassword = 1;
    this.newPassword = event.target.value;
    if(this.newPassword == "" || this.newPassword == undefined){
      this.errorNewPassword = "errorFiled";
      this.isErrorNewPassword = 0;
    }
    this.isEnterAllValues();
  }
  checkReNewPassword(event:any){
    this.errorReNewPassword = "succsessFiled";
    this.isErrorReNewPassword = 1;
    this.reNewPassword = event.target.value;
    if(this.reNewPassword == "" || this.reNewPassword == undefined){
      this.errorReNewPassword = "errorFiled";
      this.isErrorReNewPassword = 0;
    }
    this.isEnterAllValues();
  }
  isEnterAllValues(){
    if(this.oldPassword != undefined && this.oldPassword != "" && this.newPassword != undefined && this.newPassword != "" && this.reNewPassword != undefined && this.reNewPassword != ""){
      this.isdisabled = true;
    }
  }
  async ngOnInit() {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: '',
      duration: 4000,
    });
    await loading.present();
    this.fullName = await this.storage.get('fullNameLogin');
    this.numberLogin = await this.storage.get('numberLogin');
    this.userId = await this.storage.get('userId');
    this.catId = await this.storage.get('catId');
    this.points = await this.storage.get('points');
    this.type = await this.storage.get('type');
    this.email = await this.storage.get('email');
    if(this.userId == null || this.numberLogin == null  || this.catId == null  || this.fullName == null){
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
      this.returnData = data;
      this.operationResult = this.returnData.Error.ErrorCode;
      if(this.operationResult==1){
        this.points = this.returnData.Data.points;
        this.userImage = this.returnData.Data.image;
        if(this.userImage == null || this.userImage == 0 || this.userImage == undefined)
          this.userImage = "../../assets/imgs/def.png";
        await this.storage.set('image',this.userImage);
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
  changePassword(){
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','changepassword');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });

    if((this.oldPassword == undefined || this.oldPassword == "") && (this.newPassword == undefined || this.newPassword == "") && (this.reNewPassword == undefined || this.reNewPassword == "")){
      this.errorOldPassword = "errorFiled";
      this.isErrorOldPassword = 0;
      this.errorNewPassword = "errorFiled";
      this.isErrorNewPassword = 0;
      this.errorReNewPassword = "errorFiled";
      this.isErrorReNewPassword = 0;
      this.errorRePasswordMsg = "الرجاء إدخال كلمة تأكيد كلمة المرور الجديدة";
      this.isdisabled = false;
      return false;
    }
    if(this.oldPassword == undefined || this.oldPassword == ""){
      this.errorOldPassword = "errorFiled";
      this.isErrorOldPassword = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.newPassword == undefined || this.newPassword == ""){
      this.errorNewPassword = "errorFiled";
      this.isErrorNewPassword = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.reNewPassword == undefined || this.reNewPassword == ""){
      this.errorReNewPassword = "errorFiled";
      this.isErrorReNewPassword = 0;
      this.errorRePasswordMsg = "الرجاء إدخال كلمة تأكيد كلمة المرور الجديدة";
      this.isdisabled = false;
      return false;
    }
    if(this.newPassword != this.reNewPassword){
      this.errorReNewPassword = "errorFiled";
      this.isErrorReNewPassword = 0;
      this.errorRePasswordMsg = "كلمة المرور و تأكيد كلمة المرور غير متطابقتان";
      this.isdisabled = false;
      return false;
    }
    if(this.oldPassword != undefined && this.newPassword != undefined && this.reNewPassword != undefined){
      this.usersService.changePassword(this.userId,this.oldPassword,this.newPassword).then(async data=>{
        this.returnData = data;
        this.operationResult = this.returnData.Error.ErrorCode;
        if(this.operationResult==1){
          this.message = "تمت عملية تعديل كلمة المرور بنجاح";
          this.displayResult(this.message);
        }else if(this.operationResult==2){
          this.message = "لم تتم عملية تعديل كلمة المرور بنجاح...كلمة المرور القديمة غير صحيحة";
          this.displayResult(this.message);
        }else if(this.operationResult==3){
          this.message = "لم عملية تعديل كلمة المرور بنجاح...البيانات مفقودة";
          this.displayResult(this.message);
        }else{
          this.message = "لم عملية تعديل كلمة المرور بنجاح...حاول مرة اخرى";
          this.displayResult(this.message);
        }
      }).catch(e=>{
        this.message = "لم عملية تعديل كلمة المرور بنجاح...حاول مرة اخرى";
        this.displayResult(this.message);
      })
      this.isdisabled = true;
    }
    return true;
  }
  changeOldInputType(){
    this.showOldPassword = !this.showOldPassword;
  }
  changeNewInputType(){
    this.showNewPassword = !this.showNewPassword;
  }
  changeReNewInputType(){
    this.showReNewPassword = !this.showReNewPassword;
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
