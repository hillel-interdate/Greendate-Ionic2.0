import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiQuery} from '../api.service';
import {Router} from '@angular/router';
import {IonContent} from '@ionic/angular';
import * as $ from 'jquery';

/*
 Generated class for the FreezeAccount page.
 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-freeze-account',
  templateUrl: 'freeze-account.page.html',
  styleUrls: ['freeze-account.page.scss']
})
export class FreezeAccountPage implements OnInit{
  @ViewChild(IonContent) content: IonContent;

  public form: any = {text: {value: ''}, description: ''};

  public err: any = {status: '', text: ''};

  allfields = '';

  constructor(public api: ApiQuery,
              public router:Router) {}



  ngOnInit() {

    this.api.pageName = 'FreezeAccountPage';
    this.api.http.get(this.api.url + '/api/v2/freeze', this.api.header).subscribe((data:any) => {
      this.form.description = data.description;
      this.err.text = data.error;
    });
  }

  /*submit() {
   this.navCtrl.push(LoginPage);
   }
   */
  submit() {

    if (this.form.text.value === '') {
      this.allfields = 'יש להכניס סיבה להקפאה';
    } else {

      const params = JSON.stringify({
        freeze_account_reason: this.form.text.value
      });

      this.api.http.post(this.api.url + '/api/v1/freezes', params, this.api.header).subscribe((data:any) => this.validate(data));
      this.api.data._id = 'logout';
      this.router.navigate(['/login'])

    }

  }

  onOpenKeyboard() {
    $('.footerMenu').hide();
    setTimeout( () => {
      this.content.scrollToBottom(100);
    }, 300 );
  }

  onCloseKeyboard() {
    $('.footerMenu').show();
  }

  validate(response) {
    console.log(response);
  }

}
