import { Component, OnInit,ViewChild } from '@angular/core';
import {LoadingController, MenuController, NavController, Platform, ToastController} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {UsersService} from "../../services/users.service";
import { Network } from '@awesome-cordova-plugins/network/ngx';
import {CategoriesService} from "../../services/categories.service";
import {ActivatedRoute, Router} from '@angular/router';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { File,Entry } from '@awesome-cordova-plugins/file/ngx';
import { IonInfiniteScroll } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll | any;
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
  public returnCitysData:any;
  public returnArrayCitysFromServer:any;
  public returnCitysArray:any = [];
  public returnCategoriesData:any;
  public returnArrayCategoriesFromServer:any;
  public returnCategoriesArray:any = [];
  public returnsubCatData:any;
  public returnArraysubCatFromServer:any;
  public returnsubCatArray:any = [];
  public catIdUser:any=0;
  public errorCat:any="";
  public isErrorCat:any = 1;
  public isdisabled:boolean=true;
  public subCatIdUser:any=0;
  public errorSubCat:any="";
  public isErrorSubCat:any = 1;
  public cityId:any=0;
  public errorCity:any="";
  public isErrorCity:any = 1;
  public regionId:any=0;
  public errorRegion:any="";
  public isErrorRegion:any = 1;
  public returnRegionsData:any;
  public returnArrayRegionsFromServer:any;
  public returnRegionsArray:any = [];
  public userName:any;
  public errorUserName:any="";
  public isErrorUserName:any = 1;
  public commercialName:any;
  public errorCommercialName:any="";
  public isErrorCommercialName:any = 1;
  public serviceDetails:any;
  public errorServiceDetails:any="";
  public isErrorServiceDetails:any = 1;
  public message:any;
  public firstFileArray:any;
  public userImage:any="../../assets/imgs/def.png";
  public userFullName:any;
  public userMobile:any;
  public firstFileVal:any;
  public foreFileVal:any;
  public foreFileArray:any;
  public serviceDetailsNew:any;
  constructor(private file: File,private toastCtrl: ToastController,private imagePicker: ImagePicker,private transfer: FileTransfer,private loading: LoadingController,private usersService:UsersService,private router : Router,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private categoriesService:CategoriesService) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','information');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.navigateRoot("/home");
    });
  }
  async selectCityValues(event:any,type:any=0){
    if(type==0)
      this.cityId = event.target.value;
    else
      this.cityId = event;
    this.errorCity = "";
    this.isErrorCity = 1;
    await this.categoriesService.regions(this.cityId).then(data=>{
      this.returnRegionsData = data;
      this.operationResult = this.returnRegionsData.Error.ErrorCode;
      if(this.operationResult==1){
        this.returnRegionsArray=[];
        this.returnArrayRegionsFromServer = this.returnRegionsData.Data.regions;
        for(let i = 0; i < this.returnArrayRegionsFromServer.length;i++) {
          this.returnRegionsArray[i]=[];
          this.returnRegionsArray[i]['id'] = this.returnArrayRegionsFromServer[i].id;
          this.returnRegionsArray[i]['title'] = this.returnArrayRegionsFromServer[i].title;
        }
      }
    });
    this.isEnterAllValues();
  }
  checkUserName(event:any){
    this.errorUserName = "succsessFiled";
    this.isErrorUserName = 1;
    this.userName = event.target.value;
    if(this.userName == "" || this.userName == undefined){
      this.errorUserName = "errorFiled";
      this.isErrorUserName = 0;
    }
    this.isEnterAllValues();
  }
  checkServiceDetails(event:any){
    this.errorServiceDetails = "succsessFiled";
    this.isErrorServiceDetails = 1;
    this.serviceDetails = event.target.value;
    if(this.serviceDetails == "" || this.serviceDetails == undefined){
      this.errorServiceDetails = "errorFiled";
      this.isErrorServiceDetails = 0;
    }
    this.isEnterAllValues();
  }
  checkCommercialName(event:any){
    this.errorCommercialName = "succsessFiled";
    this.isErrorCommercialName = 1;
    this.commercialName = event.target.value;
    if(this.commercialName == "" || this.commercialName == undefined){
      this.errorCommercialName = "errorFiled";
      this.isErrorCommercialName = 0;
    }
    this.isEnterAllValues();
  }
  async selectCatValues(event:any,type:any=0){
    if(type == 0)
      this.catIdUser = event.target.value;
    else
      this.catIdUser = event;
    this.errorCat = "";
    this.isErrorCat = 1;
     await this.categoriesService.subCat(this.catIdUser).then(data=>{
      this.returnsubCatData = data;
      this.operationResult = this.returnsubCatData.Error.ErrorCode;
      if(this.operationResult==1){
        this.returnsubCatArray=[];
        this.returnArraysubCatFromServer = this.returnsubCatData.Data.subCat;
        for(let i = 0; i < this.returnArraysubCatFromServer.length;i++) {
          this.returnsubCatArray[i]=[];
          this.returnsubCatArray[i]['id'] = this.returnArraysubCatFromServer[i].id;
          this.returnsubCatArray[i]['title'] = this.returnArraysubCatFromServer[i].title;
        }
      }
    });
    this.isEnterAllValues();
  }
  selectSubCatValues(event:any){
    this.subCatIdUser = event.target.value;
    this.errorSubCat = "";
    this.isErrorSubCat = 1;
    this.isEnterAllValues();
  }
  selectRegionValues(event:any){
    this.regionId = event.target.value;
    this.errorRegion = "";
    this.isErrorRegion = 1;
    this.isEnterAllValues();
  }
  isEnterAllValues(){
    if(this.catIdUser != 0 && this.subCatIdUser != 0 && this.cityId != 0 && this.regionId != 0 && this.userName != undefined && this.userName != "" && this.commercialName != undefined && this.commercialName != "" && this.serviceDetails != undefined && this.serviceDetails != ""){
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
    await this.categoriesService.citys().then(data=>{
      this.returnCitysData = data;
      this.operationResult = this.returnCitysData.Error.ErrorCode;
      if(this.operationResult==1){
        this.returnArrayCitysFromServer = this.returnCitysData.Data.citys;
        for(let i = 0; i < this.returnArrayCitysFromServer.length;i++) {
          this.returnCitysArray[i]=[];
          this.returnCitysArray[i]['id'] = this.returnArrayCitysFromServer[i].id;
          this.returnCitysArray[i]['title'] = this.returnArrayCitysFromServer[i].title;
        }
      }
    });
    await this.categoriesService.categories().then(data=>{
      this.returnCategoriesData = data;
      this.operationResult = this.returnCategoriesData.Error.ErrorCode;
      if(this.operationResult==1){
        this.returnArrayCategoriesFromServer = this.returnCategoriesData.Data.categories;
        for(let i = 0; i < this.returnArrayCategoriesFromServer.length;i++) {
          this.returnCategoriesArray[i]=[];
          this.returnCategoriesArray[i]['id'] = this.returnArrayCategoriesFromServer[i].id;
          this.returnCategoriesArray[i]['title'] = this.returnArrayCategoriesFromServer[i].title;
        }
      }
    });
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
      console.log(this.returnData)
      this.operationResult = this.returnData.Error.ErrorCode;
      if(this.operationResult==1){
        this.cityId = this.returnData.Data.cityId;
        this.points = this.returnData.Data.points;
      this.catIdUser = this.returnData.Data.catId;
        await this.selectCityValues(this.cityId,1);
        await this.selectCatValues(this.catIdUser,1);
      this.userImage = this.returnData.Data.image;
      if(this.userImage == null || this.userImage == 0 || this.userImage == undefined)
        this.userImage = "../../assets/imgs/def.png";
      await this.storage.set('image',this.userImage);
      this.userFullName = this.returnData.Data.name;
      this.userName = this.returnData.Data.name;
      this.userMobile = this.returnData.Data.mobile;
      this.subCatIdUser = this.returnData.Data.subCatId;
      this.commercialName = this.returnData.Data.commercialName;
      this.regionId = this.returnData.Data.regionsId;
      this.serviceDetails = this.returnData.Data.serviceDetails;
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
  refrechAllPage(event:any) {
    this.ngOnInit()
    setTimeout(() => {
      event.target.complete();
    }, 2000);
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }
  uploadeSecondFile(){
    if(this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone')){
      let  options = {
        maximumImagesCount:1,
      };
      this.imagePicker.getPictures(options).then((results) => {
        this.firstFileArray = results[0];
        const arraySplit = this.firstFileArray.split("/tmp/");
        this.firstFileVal = arraySplit[1];
        this.message = "تم تحميل ملف الصورة بنجاح";
        this.displayResult(this.message);
      }, (err) => {
        this.message = "لم يتم تحميل ملف الصورة بنجاح";
        this.displayResult(this.message);
      });
    }else{
      let  options = {
        maximumImagesCount:1,
      };
      this.imagePicker.getPictures(options).then((results) => {
        this.file.resolveLocalFilesystemUrl(results[0]).then((entry:Entry)=>{
          this.firstFileArray = entry.nativeURL;
          this.firstFileVal = entry.name;
          this.message = "تم تحميل ملف الصورة بنجاح";
          this.displayResult(this.message);
        }).catch((errrsss:any)=>{
          this.message = "لم يتم تحميل ملف الصورة بنجاح";
          this.displayResult(this.message);
        })
      }, (err) => {
        this.message = "لم يتم تحميل ملف الصورة بنجاح";
        this.displayResult(this.message);
      });
    }
  }
  uploadeForeFile(){
    if(this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone')){
      let  options = {
        maximumImagesCount:1,
      };
      this.imagePicker.getPictures(options).then((results) => {
        this.foreFileArray = results[0];
        const arraySplit = this.foreFileArray.split("/tmp/");
        this.foreFileVal = arraySplit[1];
        this.message = "تم تحميل ملف الصورة بنجاح";
        this.displayResult(this.message);
      }, (err) => {
        this.message = "لم يتم تحميل ملف الصورة بنجاح";
        this.displayResult(this.message);
      });
    }else{
      let  options = {
        maximumImagesCount:1,
      };
      this.imagePicker.getPictures(options).then((results) => {
        this.file.resolveLocalFilesystemUrl(results[0]).then((entry:Entry)=>{
          this.foreFileArray = entry.nativeURL;
          this.foreFileVal = entry.name;
          this.message = "تم تحميل ملف الصورة بنجاح";
          this.displayResult(this.message);
        }).catch((errrsss:any)=>{
          this.message = "لم يتم تحميل ملف الصورة بنجاح";
          this.displayResult(this.message);
        })
      }, (err) => {
        this.message = "لم يتم تحميل ملف الصورة بنجاح";
        this.displayResult(this.message);
      });
    }
  }
  async updateAccount(){
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.storage.set('thisPageReturn','registration');
      this.storage.set('internetBack','0');
      this.navCtrl.navigateRoot("/errors");
    });
    if(this.catIdUser == 0 && this.subCatIdUser == 0 && this.cityId == 0 && this.regionId == 0 && (this.userName == undefined || this.userName == "") && (this.commercialName == undefined || this.commercialName == "") && (this.serviceDetails == undefined || this.serviceDetails == "")){
      this.errorCat = "errorFiled";
      this.isErrorCat = 0;
      this.errorSubCat = "errorFiled";
      this.isErrorSubCat = 0;
      this.errorCity = "errorFiled";
      this.isErrorCity = 0;
      this.errorRegion = "errorFiled";
      this.isErrorRegion = 0;
      this.errorUserName = "errorFiled";
      this.isErrorUserName = 0;
      this.errorCommercialName = "errorFiled";
      this.isErrorCommercialName = 0;
      this.errorServiceDetails = "errorFiled";
      this.isErrorServiceDetails = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.catIdUser == 0){
      this.errorCat = "errorFiled";
      this.isErrorCat = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.subCatIdUser == 0){
      this.errorSubCat = "errorFiled";
      this.isErrorSubCat = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.cityId == 0){
      this.errorCity = "errorFiled";
      this.isErrorCity = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.regionId == 0){
      this.errorRegion = "errorFiled";
      this.isErrorRegion = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.userName == undefined || this.userName == ""){
      this.errorUserName = "errorFiled";
      this.isErrorUserName = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.commercialName == undefined || this.commercialName == ""){
      this.errorCommercialName = "errorFiled";
      this.isErrorCommercialName = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.serviceDetails == undefined || this.serviceDetails == ""){
      this.errorServiceDetails = "errorFiled";
      this.isErrorServiceDetails = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.catIdUser != 0 && this.subCatIdUser != 0 && this.cityId != 0 && this.regionId != 0 && this.userName != undefined && this.commercialName != undefined && this.serviceDetails != undefined){
      this.serviceDetailsNew = this.serviceDetails
      var match = /\r|\n/.exec(this.serviceDetails);
      if (match) {
        this.serviceDetailsNew = this.serviceDetails.replaceAll(/\r|\n/ig, " swapkozeyad ");
      }
      this.usersService.updateAccount(this.userId,this.catIdUser,this.subCatIdUser,this.cityId,this.regionId,this.userName,this.commercialName,this.serviceDetailsNew).then(async data=>{
        this.returnData = data;
        this.operationResult = this.returnData.Error.ErrorCode;
        if(this.operationResult==1){
          const fileTransfer: FileTransferObject = this.transfer.create();
          if(this.firstFileArray!=undefined && this.firstFileArray!=null && this.firstFileArray!=""){
            let options: FileUploadOptions = {
              fileKey: 'file',
              fileName:this.firstFileArray,
              mimeType:'image/jpg',
              chunkedMode:true,
              headers: {}
            }
            fileTransfer.upload(this.firstFileArray, 'https://admin.eswapco.com/api/addImages/'+this.userId+"/1", options)
              .then((data) => {
              }, (err) => {
              })
          }
          if(this.foreFileArray!=undefined && this.foreFileArray!=null && this.foreFileArray!=""){
            let options: FileUploadOptions = {
              fileKey: 'file',
              fileName:this.foreFileVal,
              mimeType:'image/jpg',
              chunkedMode:false,
              headers: {}
            }
              fileTransfer.upload(this.foreFileArray, 'https://admin.eswapco.com/api/addImages/'+this.userId+"/4", options)
              .then((data) => {
              }, (err) => {
              })
          }
          await this.storage.set('fullNameLogin',this.userName);
          await this.storage.set('catId',this.catIdUser);
          await this.storage.set('subCatId',this.subCatIdUser);
          this.userFullName = this.userName;
          this.message = "تمت عملية تعديل بياناتك الشخصية بنجاح";
          this.displayResult(this.message);
          await this.usersService.information(this.userId).then(async data=>{
            this.returnData = data;
            this.operationResult = this.returnData.Error.ErrorCode;
            if(this.operationResult==1){
              this.userImage = this.returnData.Data.image;
              if(this.userImage == null || this.userImage == 0 || this.userImage == undefined)
                this.userImage = "../../assets/imgs/def.png";
              await this.storage.set('image',this.userImage);
            }
          })
          this.ngOnInit();
        }else if(this.operationResult==2){
          this.message = "لم تتم عملية تعديل بياناتك بنجاح...البيانات فارغة";
          this.displayResult(this.message);
        }else if(this.operationResult==3){
          this.message = "لم عملية تعديل بياناتك بنجاح...حاول مرة اخرى";
          this.displayResult(this.message);
        }
      }).catch(e=>{
        this.message = "لم عملية تعديل بياناتك بنجاح...حاول مرة اخرى";
        this.displayResult(this.message);
      })
      this.isdisabled = true;
    }
    return true
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
