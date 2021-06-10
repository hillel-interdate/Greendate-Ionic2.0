import {Component, OnInit} from '@angular/core';
import { ApiQuery } from '../api.service';
/*
 Generated class for the Settings page.
 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage implements OnInit {

  form: any = { is_sent_email: '', is_sent_push: '' }

  constructor(public api: ApiQuery)  {}


  ngOnInit() {
    this.api.pageName = 'SettingsPage';
    this.api.http.post(this.api.url+'/api/v1/settings','',this.api.setHeaders(true)).subscribe((data:any) => {
      console.log('Dialogs: ',data);
      this.form = data.form;
    },err => {
      console.log('Oops!');
    });
  }

  submit() {

    const params = JSON.stringify({
      is_sent_email:   this.form.is_sent_email.value,
      is_sent_push:    this.form.is_sent_push.value
    });

   this.api.http.post(this.api.url+'/api/v1/settings',params,this.api.setHeaders(true)).subscribe((data: any) => {
     console.log('Dialogs: ',data);
     this.api.toastCreate(data.success, 2500);
    },err => {
      console.log('Oops!');
    });
  }
}
