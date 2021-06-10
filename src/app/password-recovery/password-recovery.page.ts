import {Component, OnInit} from '@angular/core';
import {ToastController} from '@ionic/angular';
import {ApiQuery} from '../api.service';
import * as $ from 'jquery';
/*
 Generated class for the PasswordRecovery page.
 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-password-recovery',
    templateUrl: 'password-recovery.page.html',
    styleUrls: ['password-recovery.page.scss'],
  //  providers: [Http, ConnectionBackend,RequestOptions],
})
export class PasswordRecoveryPage implements OnInit{

    form: any = {email: {}, _token: {}};

    email_err: any;

    constructor(public api: ApiQuery,
               // public http: Http,
                public toastCtrl: ToastController) {}


    ngOnInit() {

        this.api.http.get(this.api.url + '/open_api/v2/password.json', this.api.header).subscribe((data: any) => {
            this.form = data.form;
        }, err => {
            console.log('Oops!');
        });

    }

    formSubmit() {

        let isValid = true;
        if(this.form.email.value.trim().length === 0) {
            this.email_err = 'נא להזין כתובת אימייל';
            isValid = false;
        }

        if(isValid) {
            const data = JSON.stringify({
                form: {
                    email: this.form.email.value,
                   // _token: this.form._token.value,
                }
            });

            this.api.http.post(this.api.url + '/open_api/v2/passwords', data ,
                // tslint:disable-next-line:no-shadowed-variable
                this.api.setHeaders(false)).subscribe(data => this.validate(data));
            console.log(data);
        }
    }

    validate(response) {

        console.log(response);

        this.email_err = response.errors.form.children.email.errors;
        this.form = response.form;

        if( response.send === true ) {
            this.form.email.value = '';

            this.api.toastCreate(response.success);
        }
    }

    onOpenKeyboard() {
        $('.footerMenu').hide();
    }

    onCloseKeyboard() {
        $('.footerMenu').show();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PasswordRecoveryPage');
    }

    ionViewWillEnter() {
        this.api.pageName = 'PasswordRecoveryPage';
    }



}

