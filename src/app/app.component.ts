import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AlertController, Platform,NavController,MenuController,ToastController} from '@ionic/angular';
import {Storage} from "@ionic/storage";
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { FirebaseMessaging } from '@awesome-cordova-plugins/firebase-messaging/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  showFirstPage:any;
  fullNameLogin:any;
  emailLogin:any;
  public appPagesfirst = [
    { title: 'الرئيسية', url: '/homeout'},
    { title: 'تسجيل الدخول', url: '/login'},
    { title: 'إنشاء حساب', url: '/registration'},
    { title: 'حول التطبيق', url: '/about'},
    { title: 'سياسة الخصوصية', url: '/policy'},
  ];
  public appPagesLast = [
    { title: 'الرئيسية', url: '/home'},
    { title: 'دعوة صديق', url: '/sendinvitation'},
    { title: 'السجلات', url: '/archives'},
    { title: 'المفضلة', url: '/favourite' },
    { title: 'صفحتي الشخصية', url: '/mypage' },
    { title: 'حسابي', url: '/account' },
    { title: 'إشعارات التطبيق', url: '/appnotification' },
    { title: 'تغير كلمة المرور', url: '/changepassword' },
    { title: 'إلغاء الحساب', url: '/deleteaccount' },
    { title: 'المساعدة', url: '/help' },
    { title: 'حول التطبيق', url: '/about'},
    { title: 'سياسة الخصوصية', url: '/policy'},
    { title: 'تسجيل الخروج', url: ''},
  ];
  public fullName:any;
  public userId:any;
  public numberLogin:any;
  public catId:any;
  public points:any;
  public type:any;
  public email:any;
  public appPages:any;
  public isActive:any;
  public active:any;
  public image:any="../../assets/imgs/def.png";
  public isaddInformation:any;
  public instagramLink:any;
  public facebookLink:any;
  public youtupeLink:any;

  public titlePush:any;
  public subHeaderPush:any;
  public imagePush:any;
  constructor(private firebaseMessaging : FirebaseMessaging,private toastCtrl: ToastController,private navCtrl: NavController,private iab: InAppBrowser,private menu:MenuController,private alertController:AlertController,private statusBar:StatusBar,private router : Router,private platform : Platform,private storage: Storage) {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#494949');
      this.zeyad()
    });
    this.goPageValue()
  }
  async zeyad(){
    this.firebaseMessaging.requestPermission({forceShow: false}).then(function() {
      console.log("Push messaging is allowed");
    });
    await this.firebaseMessaging.subscribe("swapkotest");
    await this.firebaseMessaging.onMessage().subscribe(async (data:any)=>{
      if(this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone')){
        this.titlePush = data.aps.alert.title;
        this.subHeaderPush = data.aps.alert.body;
        this.imagePush = "";
        if(data.fcm_options.image!=null && data.fcm_options.image!=null && data.fcm_options.image!=undefined && data.fcm_options.image!=0 && data.fcm_options.image!="")
          this.imagePush ='<img src="'+data.fcm_options.image+'" width="100%">';
        if(data.aps.alert.body!=null && data.aps.alert.body!=null && data.aps.alert.body!=undefined && data.aps.alert.body!=0 && data.aps.alert.body!=""){
          const alert = await this.alertController.create({
            header: this.titlePush,
            subHeader: this.subHeaderPush,
            cssClass: 'alertBacPush',
            mode: 'ios',
            message: this.imagePush,
            buttons: []
          });
          await alert.present();
        }
      }
      if(this.platform.is('android')){
        this.titlePush = data.gcm.title;
        this.subHeaderPush = data.gcm.body;
        this.imagePush = "";
        if(data.gcm.imageUrl!=null && data.gcm.imageUrl!=null && data.gcm.imageUrl!=undefined && data.gcm.imageUrl!=0 && data.gcm.imageUrl!="")
          this.imagePush ='<img src="'+data.gcm.imageUrl+'" width="100%">';
        if(data.gcm.body!=null && data.gcm.body!=null && data.gcm.body!=undefined && data.gcm.body!=0 && data.gcm.body!=""){
          const alert = await this.alertController.create({
            header: this.titlePush,
            subHeader: this.subHeaderPush,
            cssClass: 'alertBacPush',
            mode: 'ios',
            message: this.imagePush,
            buttons: []
          });
          await alert.present();
        }
      }
    })
    await this.firebaseMessaging.onBackgroundMessage().subscribe((data:any)=>{
     // console.log(data);
      console.log("asdasdasd");
    })
  }
  async goPageValue(){
    this.facebookLink = await this.storage.get('facebookLink');
    this.youtupeLink = await this.storage.get('youtupeLink');
    this.instagramLink = await this.storage.get('instagramLink');
    this.fullName = await this.storage.get('fullNameLogin');
    this.numberLogin = await this.storage.get('numberLogin');
    this.userId = await this.storage.get('userId');
    this.catId = await this.storage.get('catId');
    this.points = await this.storage.get('points');
    this.type = await this.storage.get('type');
    this.email = await this.storage.get('email');
    this.isActive = await this.storage.get('isActive');
    this.active = await this.storage.get('isaddInformation');
    this.image = await this.storage.get('image');
    if(this.image == null || this.image == 0 || this.image == undefined)
      this.image = "../../assets/imgs/def.png";
    this.isaddInformation = await this.storage.get('isaddInformation');
    if(this.userId == null || this.numberLogin == null){
      this.navCtrl.navigateRoot('homeout');
    }else
    if(this.active == 1)
      this.navCtrl.navigateRoot('home');
    else
      this.router.navigateByUrl('homeout');
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
  async functionOpenAccoun(){
    this.image = await this.storage.get('image');
    if(this.image == null || this.image == 0 || this.image == undefined)
      this.image = "../../assets/imgs/def.png";
    this.fullName = await this.storage.get('fullNameLogin');
  }
  functionGoPage(url:any){
    this.navCtrl.navigateRoot(url);
  }
  functionOpenAccount(){
    this.menu.close();
    this.navCtrl.navigateRoot("/account");
  }
  async functionOpenFacebook(){
    this.facebookLink = await this.storage.get('facebookLink');
    const browser = this.iab.create(this.facebookLink,'_system',{location:'yes',clearcache:'yes',toolbar:'no'});
  }
  async functionYoutupe(){
    this.youtupeLink = await this.storage.get('youtupeLink');
    const browser = this.iab.create(this.youtupeLink,'_system',{location:'yes',clearcache:'yes',toolbar:'no'});
  }
  async functionInstagram(){
    this.instagramLink = await this.storage.get('instagramLink');
    const browser = this.iab.create(this.instagramLink,'_system',{location:'yes',clearcache:'yes',toolbar:'no'});
  }
  async signOut(){
    const alert = await this.alertController.create({
      cssClass: 'alertBac',
      mode: 'ios',
      message: '! هل انت متأكد',
      buttons: [
        {
          text: 'لا',
          cssClass: 'alertButton',
          handler: () => {
          }
        }, {
          text: 'نعم',
          cssClass: 'alertButton',
          handler: () => {
            this.storage.remove('fullNameLogin');
            this.storage.remove('numberLogin');
            this.storage.remove('passwordLogin');
            this.storage.remove('type');
            this.storage.remove('userId');
            this.storage.remove('catId');
            this.storage.remove('subCatId');
            this.storage.remove('points');
            this.router.navigateByUrl('login');
          }
        }
      ]
    });
    await alert.present();
  }
}
