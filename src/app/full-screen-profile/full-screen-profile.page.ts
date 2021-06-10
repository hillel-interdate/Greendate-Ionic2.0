import {Component, OnInit} from '@angular/core';
import { ToastController } from '@ionic/angular';

import { ApiQuery } from '../api.service';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
/*
 Generated class for the FullScreenProfile page.
 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-full-screen-profile',
  templateUrl: 'full-screen-profile.page.html',
  styleUrls: ['full-screen-profile.page.scss']
})
export class FullScreenProfilePage implements OnInit{

  user:any;
  myId:any;


  constructor(public toastCtrl:ToastController,
              public router: Router,
              public NavLocation: Location,
              public api:ApiQuery) {}



  ngOnInit() {
    // this.user = navParams.get('user');
    this.user = this.api.data.user;
    this.api.pageName = 'FullScreenProfilePage';

    this.api.storage.get('user_id').then((val) => {

      if (val) {
        this.myId = val;
      }
    });
  }

  goBack() {
    console.log('in go back');
    this.NavLocation.back();
  }

  toDialog(user) {
    // this.navCtrl.push(DialogPage, {
    //   user: user
    // });
    this.api.data.user = user;
    this.router.navigate(['/dialog']);
  }

  addFavorites(user) {
    user.isAddFavorite = true;

    const params = JSON.stringify({
      list: 'Favorite'
    });

    this.api.http.post(this.api.url + '/api/v2/lists/' + user.id, params, this.api.setHeaders(true)).subscribe((data:any) => {
     this.toastCtrl.create({
        message: data.success,
        duration: 3000
      }).then(alert => alert.present());

    }, err => {
      console.log('Oops!');
    });
  }

  addLike(user) {
    user.isAddLike = true;
    this.toastCtrl.create({
      message: ' עשית לייק ל' + user.username,
      duration: 2000
    }).then(alert=>alert.present());


    const params = JSON.stringify({
      toUser: user.id,
    });

    this.api.http.post(this.api.url + '/api/v1/likes/' + user.id, params, this.api.setHeaders(true)).subscribe(data => {
      console.log(data);
    }, err => {
      console.log('Oops!');
    });
  }


}