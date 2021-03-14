import {Component, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {ApiQuery} from '../api.service';
import {SelectModalPage} from '../select-modal/select-modal.page';
import {ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
import {HttpHeaders} from '@angular/common/http';
import {IonContent} from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.page.html',
  styleUrls: ['edit-profile.page.scss'],
})

export class EditProfilePage implements OnInit {

  @ViewChild(IonContent) content: IonContent;

  cityname: any = '';
  data: any = {};
  usersChooses: any = {};
  form: any;
  err: any = {};
  errKeys: any;
  formKeys: any;
  field_value: any;
  user: any; // { region: any, username: any, email: any, email_retype: any, area: any, neighborhood: any, zip_code: any,
    // phone: any, occupation: any, about_me: any, looking_for: any };
  name: any;
  birth: any;
  allfields = '';
  step: any = 1;


  constructor(public api: ApiQuery,
              public modalCtrl: ModalController,
              public router: Router,
              private sanitizer: DomSanitizer,
              public keyboard: Keyboard) {}


  ngOnInit() {
       // this.keyboard.hideKeyboardAccessoryBar(false);
       // this.keyboard.disableScroll(true);
      this.keyboard.hideFormAccessoryBar(false);
     // this.keyboard.disableScroll(false);
      this.edit_step(1);
  }


     onOpenKeyboard()  {
       $('.footerMenu').hide();
       $('.container').css({
             margin: '0 0 197px!important'
         });
    }


    onHideKeyboard() {
        $('.container').css({
                margin: '0 0 69px!important'
            });

        $('.footerMenu').show();
    }

  getValueLabel(field) {
   return this.form[field].choices.find(x => x.value === this.form[field].value).label;
  }

  isObject(val) {
    return typeof val === 'object';
  }

  isArray(val) {
    return Array.isArray(val);
  }

  async openSelect2(field, fieldTitle) {

    console.log(field);
    const modal = await this.modalCtrl.create({
      component: SelectModalPage,
      componentProps: {
        choices: field.choices,
        title: field.label,
        choseNow: this.usersChooses[fieldTitle],
        search: fieldTitle === 'city'
      }
    });
    await modal.present();

    modal.onDidDismiss().then(data => {
      if (data.data) {
        this.form[fieldTitle].value = data.data.value;
        this.usersChooses[fieldTitle] = data.data.label;
      }
    });
    // field.name

  }

  getKeys(obj) {
    return Object.keys(obj);
  }

  maxYear() {
    return new Date().getFullYear() - 18;
  }

  formSubmit() {
    this.err = {};
    this.allfields = '';
    this.api.showLoad();

    let data: any;

    if (this.step === 1) {

      let date_arr = ['', '', ''];

      if (typeof this.birth !== 'undefined') {
        date_arr = this.birth.split('-');
      }

      data = JSON.stringify({
          profile_one: {
            username: this.form.username.value,
            email: this.form.email.value,
            birthday: {
              year: parseInt(date_arr[0]),
              month: parseInt(date_arr[1]),
              day: parseInt(date_arr[2])

            },
            phone: this.form.phone.value,
           // _token: this.form._token.value
          }
        });

    } else if (this.step === 2) {

       data = JSON.stringify({
          profile_two: {
            region: this.form.region.value,
            city: this.form.city.value,
            relationshipStatus: this.form.relationshipStatus.value,
            occupation: this.form.occupation.value,
            education: this.form.education.value,
            religion: this.form.religion.value,
            religionAffinity: this.form.religionAffinity.value,
            sexOrientation: this.form.sexOrientation.value,
            purposes: this.form.purposes.value,
           // _token: this.form._token.value
          }
        });

      } else if (this.step === 3) {

       data = JSON.stringify({
          profile_three: {
            about: this.form.about.value,
            animals: this.form.animals.value,
            body: this.form.body.value,
            children: this.form.children.value,
            dinnerWith: this.form.dinnerWith.value,
            drinking: this.form.drinking.value,
            eyes: this.form.eyes.value,
            favoriteBooks: this.form.favoriteBooks.value,
            favoriteDish: this.form.favoriteDish.value,
            favoriteRestaurant: this.form.favoriteRestaurant.value,
            green: this.form.green.value,
            hair: this.form.hair.value,
            height: this.form.height.value,
            interests: this.form.interests.value,
            looking: this.form.looking.value,
            music: this.form.music.value,
            nutrition: this.form.nutrition.value,
            perfectDate: this.form.perfectDate.value,
            politicalAffiliation: this.form.politicalAffiliation.value,
            smoking: this.form.smoking.value,
            sport: this.form.sport.value,
            type: this.form.type.value,
            veggieReasons: this.form.veggieReasons.value,
            // _token: this.form._token.value

          }
        });

      }

      // tslint:disable-next-line:no-shadowed-variable
    this.api.http.post(this.api.url + '/api/v2/edits/profiles', data, this.api.setHeaders(true)).subscribe((data: any) => {
        this.err = data.errors.form.children;
        console.log(this.err);
        if (data.success) {
            this.api.toastCreate(data.texts.textSuccess, 2500);
            if (this.step === 1) {
                this.api.storage.get('user_data').then(user_data => {
                    if (data.username !== this.form.username.value) {
                        user_data.username = this.form.username.value;
                        this.api.storage.set('user_data', user_data);
                        this.api.setHeaders(true, this.form.username.value);
                    }
                });
                this.api.storage.set('username', this.form.username.value);
            }
        } else {
            setTimeout( () => {
                const y = $('.border-red').offset().top - 30;
                this.content.scrollToPoint(null, y, 300);
            }, 300 );
        }
        this.api.hideLoad();
    }, (err) => this.api.hideLoad());
  }


  edit_step(step) {
    this.api.http.get(this.api.url + '/api/v2/edit/profile?step=' + step, this.api.setHeaders(true)).subscribe((data: any) => {
        this.form = data.form;
        console.log(data);
        this.formKeys = Object.keys(this.form);
        this.step = step;
        if (step === 1) {
          this.birth = data.form.birthday.value.year + '-' + data.form.birthday.value.month + '-' + data.form.birthday.value.day;
          console.log(this.birth);
        } else if (this.step === 2) {
          // delete option gey for woman and lesbi for man
            if (data.user_gender === 1) {
              this.form.sexOrientation.choices.splice(2, 1);
            } else if (data.user_gender === 2) {
              this.form.sexOrientation.choices.splice(1, 1);
            }
        }

    });
  }

  setHeaders() {
    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.append('username', this.form.login.username.value);
    myHeaders = myHeaders.append('password', this.form.login.password.value);
    myHeaders = myHeaders.append('Content-type', 'application/json');
    myHeaders = myHeaders.append('Accept', '*/*');
    myHeaders = myHeaders.append('Access-Control-Allow-Origin', '*');

    const header = {
      headers: myHeaders
    };
    return header;
  }

  ionViewWillEnter() {
      this.api.pageName = 'RegistrationPage';
      // window.addEventListener('keyboardWillShow', this.onOpenKeyboard);
      // window.addEventListener('keyboardWillHide', this.onHideKeyboard);
  }

  ionViewWillLeave() {
      // window.removeEventListener('keyboardWillShow', null);
      // window.removeEventListener('keyboardWillHide', null);
  }

}
