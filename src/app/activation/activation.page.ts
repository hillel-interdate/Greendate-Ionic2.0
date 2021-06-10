import {Component} from '@angular/core';
import {ApiQuery} from '../api.service';
import {Router} from '@angular/router';

/*
 Generated class for the Activation page.
 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-activation',
  templateUrl: 'activation.page.html'
})
export class ActivationPage {

  form: { errorMessage: any, res: any, description: any, success: any, submit: any,
    phone: { label: any, value: any }, code: { label: any, value: any } } =
  {
    errorMessage: '',
    res: false,
    description: '',
    success: '',
    submit: false,
    phone: {label: '', value: ''},
    code: {label: '', value: ''}
  };

  constructor(public router: Router,
              public api: ApiQuery) {

    this.getForm();
  }

  getForm(data = '') {

    this.api.showLoad();

    this.api.http.post(this.api.url + '/api/v1/activations', data, this.api.setHeaders(true)).subscribe((resp: any) => {
      this.form = resp.form;
      this.form.res = resp.code;
      this.form.errorMessage = resp.errorMessage;

      this.api.hideLoad();

      if (this.form.res) {
        this.api.status = 'login';
        this.api.setStorageData({label: 'status', value: 'login'});
        // this.navCtrl.push(RegistrationFourPage, {new_user: resp.json().register_end_button});
        // this.navCtrl.push(HomePage);
        this.router.navigate(['/home']);
      }

    }, err => {
    //  this.navCtrl.push(LoginPage);
      this.router.navigate(['/login'])
    });
  }

  formSubmit() {
    let params = '';
    if (this.form.submit === 'Activate') {
      params = JSON.stringify({
        code: this.form.code.value
      });
    } else {
      params = JSON.stringify({
        phone: this.form.phone.value
      });
    }
    this.getForm(params);
  }
}
