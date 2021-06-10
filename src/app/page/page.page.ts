import {Component} from '@angular/core';
// import {NavController, NavParams, Nav} from '@ionic/angular';
import {ApiQuery} from '../api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';


/*
 Generated class for the Page page.
 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-page',
  templateUrl: 'page.page.html',

})
export class PagePage {

  page: { title: any, content: any } = {title: '', content: ''};

  constructor(
              public api: ApiQuery,
              public NavLocation: Location,
              public router: Router) {

   // let id = navParams.get('id');
    const id = this.router.getCurrentNavigation().extras.state.id;
    console.log(id);

    this.api.http.get(api.url + id, this.api.setHeaders(false)).subscribe((data: any) => {
      this.page = data.page;
     // alert(this.page.title);

    }, err => {
      console.log('Oops!');
    });
  }

  back() {
    this.NavLocation.back();
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad PagePage');
  }

  ionViewWillEnter() {
    this.api.pageName = 'PagePage';
  }

}
