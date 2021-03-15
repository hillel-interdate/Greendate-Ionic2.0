import {Component, OnInit} from '@angular/core';
import { ApiQuery } from '../api.service';
import {Router} from '@angular/router';

/*
 Generated class for the Notifications page.
 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.page.html',
  styleUrls: ['notifications.page.scss']
})
export class NotificationsPage implements OnInit{
  like = 'like';
  tabs: string = this.like;
  bingo = 'bingo';
  users: Array<{ id: string, date: string, username: string, is_read: string, photo: string,
      text: string, region_name: string, image: string, about: {}, component: any}>;
  texts: any;
  constructor(public router: Router,
              public api: ApiQuery) {}

  ngOnInit() {
    this.api.pageName = 'NotificationsPage';
    this.api.http.post(this.api.url+'/api/v2/notifications.json',{},this.api.setHeaders(true)).subscribe((data:any) => {
      this.users = data.users;
      this.texts = data.texts;
      console.log('Features: ',data);
    },err => {
      console.log('Oops!');
    });
  }

  toDialog(user) {
    const user_id = user.user_id;
    const bingo = user.bingo;
   this.api.http.post(this.api.url+'/api/v2/notifications.json',{id: user.id},this.api.setHeaders(true)).subscribe((data:any) => {

      this.users = data.users;

      if( bingo ) {
        this.api.data.user = {id: user_id};
        this.router.navigate(['/dialog']);
      }else {
        this.api.data.user = user_id;
        this.router.navigate(['/arena']);
      }
    },err => {
      console.log('Oops!');
    });

  }


}
