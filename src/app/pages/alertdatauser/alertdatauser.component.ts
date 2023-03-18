import { Component, OnInit,Input } from '@angular/core';
import {ModalController, Platform,NavController} from '@ionic/angular';
import { Router,ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-alertdatauser',
  templateUrl: './alertdatauser.component.html',
  styleUrls: ['./alertdatauser.component.scss'],
})
export class AlertdatauserComponent  implements OnInit {
  @Input() opera: number | any;
  constructor(private activaterouter : ActivatedRoute,private navCtrl: NavController,private router : Router,private modalController: ModalController,private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.modalController.dismiss();
    });
  }
  closeModel(){
    this.modalController.dismiss({
    });
  }
  functionGoInvitations(){
    this.navCtrl.navigateRoot("/sendinvitation");
    this.modalController.dismiss({
    });
  }
  ngOnInit() {

  }

}
