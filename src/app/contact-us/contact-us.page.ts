import {Component} from '@angular/core';
import {ToastController} from '@ionic/angular';
import {ApiQuery} from '../api.service';
import {Location} from '@angular/common';

declare var $: any;

@Component({
    selector: 'page-contact-us',
    templateUrl: 'contact-us.page.html',
    styleUrls: ['contact-us.page.scss']
})
export class ContactUsPage {

    form: any = {};
    errors: any = {};
    user_id: any;
    allfields = '';
    public logged_in = false;

    constructor(public api: ApiQuery,
                public navLocation: Location,
                public toastCtrl: ToastController) {


        this.api.http.get(api.url + '/open_api/v2/contact', api.header).subscribe((data: any) => {
            this.form = data.form;
            console.log(this.form);

        }, err => {
            console.log('Oops!');
        });

        this.api.storage.get('user_data').then(data => {
            if (data.user_id) {
                this.user_id = data.user_id;
                this.logged_in = true;
            }
        });


    }

    onOpenKeyboard() {
        $('.footerMenu').hide();
    }

    onHideKeyboard() {
        $('.footerMenu').show();
    }

    formSubmit() {

        let isValid = true;
        if (this.form.email.value.trim().length < 7 && !this.logged_in) {
            this.errors.email = 'כתובת אימייל לא תקינה';
            isValid = false;
        }
        if (this.form.subject.value.trim() === '') {
            this.errors.subject = 'נא להזין נושא פניה';
            isValid = false;
        }
        if ( this.form.text.value.trim() === '') {
            this.errors.text = 'נא להזין הודעה';
            isValid = false;
        }

        if (isValid) {
            const params = {
                contact: {
                    email: this.user_id ? this.user_id : this.form.email.value,
                    text: this.form.text.value,
                    subject: this.form.subject.value
                    // _token: this.form._token.value,
                }
            };

            this.api.http.post(this.api.url + '/open_api/v2/contacts', params, this.api.header).subscribe(data => this.validate(data));
        }

    }

    validate(response) {
        this.errors.email = response.errors.form.children.email.errors;
        this.errors.subject = response.errors.form.children.subject.errors;
        this.errors.text = response.errors.form.children.text.errors;

        if (response.send === true) {

            this.form.email.value = '';
            this.form.text.value = '';
            this.form.subject.value = '';

            this.toastCtrl.create({
                buttons: [{
                    text: 'אישור',
                    role: 'cancel'
                }],
                message: 'ההודעה נשלחה בהצלחה',
            }).then(toast => toast.present());
        } else if (!this.errors) {
            this.allfields = 'ooops!';
        }
    }


    back() {
        this.navLocation.back();
        setTimeout(() => {
            $('.scroll-content, .fixed-content').css({'margin-bottom': '57px'});
        }, 500);
    }


    ionViewWillEnter() {
        this.api.pageName = 'ContactUsPage';
        window.addEventListener('keyboardWillShow', this.onOpenKeyboard);
        window.addEventListener('keyboardWillHide', this.onHideKeyboard);
      //  alert(this.api.pageName);
    }

    ionViewWillLeave() {
        window.removeEventListener('keyboardWillShow', this.onOpenKeyboard);
        window.removeEventListener('keyboardWillHide', this.onHideKeyboard);
    }

}
