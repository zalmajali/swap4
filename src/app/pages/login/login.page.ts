import { Component, OnInit } from '@angular/core';
import {LoadingController, MenuController, NavController, Platform, ToastController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {UsersService} from "../../services/users.service";
import { Network } from '@awesome-cordova-plugins/network/ngx';
import {HttpClient} from "@angular/common/http";
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  number:any;
  errorNumber:any="";
  isErrorNumber:any = 1;
  password:any;
  errorPassword:any="";
  isErrorPassword:any = 1;
  isdisabled:boolean=true;
  backToPage:any;
  returnData:any;
  operationResult:any;
  message:any;
  loadingShow:any = 0;
  returnFullName:any;
  returnNumber:any;
  showPassword: boolean = false;
  showLoginWithApple:any = 0;
  facebookToken:any;
  facebookUserId:any;
  result:any;
  firstTime:any;
  lastTime:any;
  fullNameLogin:any;
  emailLogin:any;
  productInShopingCart:any;
  loginOk:any=0;
  constructor(private http:HttpClient,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private usersService:UsersService,private toastCtrl: ToastController,private loading: LoadingController) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','login');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.navigateRoot("/login");
    });
  }
  async ngOnInit() {
    this.storage.remove('fullNameLogin');
    this.storage.remove('numberLogin');
    this.storage.remove('passwordLogin');
    this.storage.remove('type');
    this.storage.remove('userId');
    this.storage.remove('catId');
    this.storage.remove('subCatId');
    this.storage.remove('points');
    this.storage.remove('isActive');
    this.storage.remove('active');
    this.storage.remove('image');
    this.storage.remove('invitationCode');
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','login');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
    await this.storage.set('internetBack','1');
    await this.checkIfLogin();
    await this.checkIfSiteWork();
  }
  checkNumber(event:any){
    this.errorNumber = "succsessFiled";
    this.isErrorNumber = 1;
    this.number = event.target.value;
    if(this.number == "" || this.number == undefined){
      this.errorNumber = "errorFiled";
      this.isErrorNumber = 0;
    }
    this.isEnterAllValues();
  }
  checkPassword(event:any){
    this.errorPassword = "succsessFiled";
    this.isErrorPassword = 1;
    this.password = event.target.value;
    if(this.password == "" || this.password == undefined){
      this.errorPassword = "errorFiled";
      this.isErrorPassword = 0;
    }
    this.isEnterAllValues();
  }
  isEnterAllValues(){
    if(this.number != undefined && this.number != "" && this.password != undefined && this.password != ""){
      this.isdisabled = true;
    }
  }
  async checkIfLogin(){
    this.usersService.checkIfLoginApi().then(async data=>{
      this.returnData = data;
      this.operationResult = this.returnData.Error.ErrorCode;
      if(this.operationResult!=1){
        this.storage.remove('fullNameLogin');
        this.storage.remove('numberLogin');
        this.storage.remove('passwordLogin');
        this.storage.remove('type');
        this.storage.remove('userId');
        this.storage.remove('catId');
        this.storage.remove('subCatId');
        this.storage.remove('points');
        this.message = "عذرا التطبيق متوقف حاليا لا يمكنك الدخول على حسابك الان";
        this.displayResult(this.message);
      }else{
        this.loginOk = 1;
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
      this.message = "عذرا التطبيق متوقف حاليا لا يمكنك الدخول على حسابك الان";
      this.displayResult(this.message);
    })
  }
  async checkUser(){
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','login');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
    if(this.loginOk == 0){
      this.message = "عذرا التطبيق متوقف حاليا لا يمكنك الدخول على حسابك الان";
      this.displayResult(this.message);
      return false;
    }
    if((this.number == undefined || this.number == "") && (this.password == undefined || this.password == "")){
      this.errorNumber = "errorFiled";
      this.errorPassword = "errorFiled";
      this.isErrorNumber = 0;
      this.isErrorPassword = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.number == undefined || this.number == ""){
      this.errorNumber = "errorFiled";
      this.isErrorNumber = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.password == undefined || this.password == ""){
      this.errorPassword = "errorFiled";
      this.isErrorPassword = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.number != undefined && this.password != undefined){
      const loading = await this.loading.create({
        cssClass: 'my-custom-class',
        message: '',
        duration: 2500,
      });
      await loading.present();
      this.usersService.checkUser(this.number,this.password,'962').then(async data=>{
        this.returnData = data;
        this.operationResult = this.returnData.Error.ErrorCode;
        if(this.operationResult==1){
          await this.storage.set('fullNameLogin',this.returnData.Data.name);
          await this.storage.set('numberLogin',this.number);
          await this.storage.set('passwordLogin',this.password);
          await this.storage.set('type',this.returnData.Data.type);
          await this.storage.set('userId',this.returnData.Data.id);
          await this.storage.set('catId',this.returnData.Data.catId);
          await this.storage.set('subCatId',this.returnData.Data.subCatId);
          await this.storage.set('points',this.returnData.Data.points);
          await this.storage.set('isActive',this.returnData.Data.is_active);
          await this.storage.set('active',this.returnData.Data.active);
          await this.storage.set('image',this.returnData.Data.image);
          await this.storage.set('invitationCode',this.returnData.Data.invitationCode);
          await this.storage.set('isaddInformation',1);
          this.navCtrl.navigateRoot("/home");
        }else if(this.operationResult==2){
          this.message = "لم تتم عملية الدخول بنجاح...البيانات فارغة";
          this.displayResult(this.message);
        }else if(this.operationResult==3){
          await this.storage.set('userId',this.returnData.Data.id);
          this.message = "لم تتم عملية الدخول بنجاح...لم يتم تفعيل الحساب للان";
          this.displayResult(this.message);
          this.navCtrl.navigateRoot("/activation");
        }else if(this.operationResult==4){
          this.message = "لم تتم عملية الدخول بنجاح...كلمة المرور غير صحيحة";
          this.displayResult(this.message);
        }else if(this.operationResult==6){
          await this.storage.set('fullNameLogin',this.returnData.Data.name);
          await this.storage.set('numberLogin',this.number);
          await this.storage.set('passwordLogin',this.password);
          await this.storage.set('type',this.returnData.Data.type);
          await this.storage.set('userId',this.returnData.Data.id);
          await this.storage.set('catId',this.returnData.Data.catId);
          await this.storage.set('subCatId',this.returnData.Data.subCatId);
          await this.storage.set('points',this.returnData.Data.points);
          await this.storage.set('isActive',this.returnData.Data.is_active);
          await this.storage.set('active',this.returnData.Data.active);
          await this.storage.set('image',this.returnData.Data.image);
          await this.storage.set('invitationCode',this.returnData.Data.invitationCode);
          this.message = "تمت عملية الدخول بنجاح يرجى إكمال بياناتك الشخصية";
          this.displayResult(this.message);
          this.navCtrl.navigateRoot("/information");
        }else if(this.operationResult==7){
          this.message = "عذرا...لا يمكنك الدخول على حسابك الان لحين موافقة الادارة على بياناتك الشخصية";
          this.displayResult(this.message);
        }else{
          this.message = "لم تتم عملية الدخول بنجاح...رقم الجوال غير صحيح";
          this.displayResult(this.message);
        }
      }).catch(e=>{
        this.message = "لم تتم عملية الدخول بنجاح...حاول مرة اخرى";
        this.displayResult(this.message);
      })
      this.isdisabled = true;
    }
    return true;
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
  forgotPasssword(){
    this.navCtrl.navigateRoot("/forgotpasssword");
  }
  functionGoRegistration(){
    this.navCtrl.navigateRoot("/registration");
  }
  changeInputType(){
    this.showPassword = !this.showPassword;
  }
  async functionOpenMenue(){
    this.menu.enable(true,"first");
    this.menu.open("first");
  }
}
