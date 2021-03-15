import {Component, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {ApiQuery} from '../api.service';
// import {Http, Headers} from '@angular/http';
// import { RequestOptions} from '@angular/http';
import {SelectModalPage} from '../select-modal/select-modal.page';
import {ModalController} from '@ionic/angular';
import {Router, NavigationExtras, ActivatedRoute} from '@angular/router';
import {HttpHeaders} from '@angular/common/http';
import {IonContent} from '@ionic/angular';
import {EventsService} from '../events.service';
import * as $ from 'jquery';

/*
 Generated class for the One page.
 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */


@Component({
    selector: 'page-registration',
    templateUrl: 'registration.page.html',
    styleUrls: ['registration.page.scss'],
    // providers: [Storage]
})

export class RegistrationPage implements OnInit {

    @ViewChild(IonContent) content: IonContent;

    cityname: any = '';
    data: any = {};
    usersChooses: any = {};
    form: any;
    err: any = {};
    errKeys: any;
    formKeys: any;
    // field_value: any;
    user: any = {}; // { region: any, username: any, email: any, email_retype: any, area: any, neighborhood: any, zip_code: any,
    // phone: any, occupation: any, about_me: any, looking_for: any };
    name: any;
    birth: any;
    allfields = '';
    facebook_id: any;

    constructor(// public http: Http,
                public api: ApiQuery,
                public modalCtrl: ModalController,
                public router: Router,
                public route: ActivatedRoute,
                public events: EventsService,
                private sanitizer: DomSanitizer) {}


    ngOnInit() {

        this.api.http.post(this.api.url + '/open_api/v2/signs/ups/news.json', {}, this.api.setHeaders()).subscribe((res: any) => {
            this.form = res.user.form;
            this.formKeys = Object.keys(this.form);
            this.form.agree.label = this.sanitizer.bypassSecurityTrustHtml(this.form.agree.label);
        }, err => {
            console.log('Oops!', err);
        });

        this.route.queryParams.subscribe((params: any) => {
            const data = JSON.parse(params.params);
            if (data.user) {
               // alert(data.user.facebook_id);
               // alert(JSON.stringify(this.user));
                this.facebook_id = data.user.facebook_id;
                // alert(JSON.stringify(this.user));
                // this.form.username.value = data.user.username;
                // this.facebook_id = data.user.facebook_id;
            }
        });

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

    onOpenKeyboard()  {
        $('.footerMenu').hide();
        $('.container').css({
            margin: '11px auto 197px!important'
        });
    }


    onHideKeyboard() {
      $('.container').css({
          margin: '11px auto 69px!important'
      });
      $('.footerMenu').show();
    }

    formSubmit() {

        this.err = {};
        this.allfields = '';
        this.api.showLoad();

        let data: any;

        if (this.form.step !== 1) {
            let date_arr = ['', '', ''];
            console.log(this.birth);
            if (typeof this.birth !== 'undefined') {
                date_arr = this.birth.split('-');
                console.log(date_arr);
            }
            this.user = {
                username: this.form.username.value,
                email:  this.form.email.value,
                password: this.form.password.first.value,
                gender: this.form.gender.value,
                birthday: {
                    day: parseInt(date_arr[2]),
                    month: parseInt(date_arr[1]),
                    year: parseInt(date_arr[0])
                },
                phone: this.form.phone.value,
                agree: this.form.agree.value,
                agreeSendEmails: this.form.agreeSendEmails.value,
                facebook_id: this.facebook_id
            };


            data = {

                    // flow_signUpApi_instance: this.form.flow_signUpApi_instance.value,
                    // flow_signUpApi_step: this.form.flow_signUpApi_step.value,
                    signUpOne: {
                        username: this.form.username.value,
                        email:  this.form.email.value,
                        password: {
                            first: this.form.password.first.value,
                            second: this.form.password.second.value
                        },
                        gender: this.form.gender.value,
                        birthday: {
                            day: parseInt(date_arr[2]),
                            month: parseInt(date_arr[1]),
                            year: parseInt(date_arr[0])
                        },
                        phone: this.form.phone.value,
                        agree: this.form.agree.value,
                        agreeSendEmails: this.form.agreeSendEmails.value,
                        // _token: this.form._token.value
                    }

            };
            // if(this.form.flow_signUpApi_instance){
                // data.flow_signUpApi_instance = this.form.flow_signUpApi_instance.value;
                // data.flow_signUpApi_step = this.form.flow_signUpApi_step.value;
            // }

            data = JSON.stringify(data);

        } else if (this.form.step === 2) {
            console.log(this.form);
            console.log('this city' + JSON.stringify(this.form.city.value));

            this.user.relationshipStatus = this.form.relationshipStatus.value;
            this.user.region = this.form.region.value;
            this.user.city = this.form.city.value;
            this.user.religion = this.form.religion.value;
            this.user.religionAffinity = this.form.religionAffinity.value;
            this.user.education = this.form.education.value;
            this.user.occupation = this.form.occupation.value;
            this.user.purposes = this.form.purposes.value;
            this.user.sexOrientation = this.form.sexOrientation.value;

            data = {
                // flow_signUpApi_instance: this.form.flow_signUpApi_instance.value,
                // flow_signUpApi_step: this.form.flow_signUpApi_step.value,
                signUpTwo: {
                    relationshipStatus: this.form.relationshipStatus.value,
                    region: this.form.region.value,
                    city: this.form.city.value,
                    religion: this.form.religion.value,
                    religionAffinity: this.form.religionAffinity.value,
                    education: this.form.education.value,
                    occupation: this.form.occupation.value,
                    purposes: this.form.purposes.value,
                    sexOrientation: this.form.sexOrientation.value,
                    // _token: this.form._token.value
                }
            };
            data = JSON.stringify(data);

        } else if (this.form.step === 3) {

            this.user.about = this.form.about.value;
            this.user.looking = this.form.looking.value;
            this.user.green = this.form.green.value;
            this.user.smoking = this.form.smoking.value;
            this.user.drinking = this.form.drinking.value;
            this.user.children = this.form.children.value;
            this.user.animals = this.form.animals.value;
            this.user.interests = this.form.interests.value;
            this.user.politicalAffiliation = this.form.politicalAffiliation.value;
            this.user.height = this.form.height.value;
            this.user.body = this.form.body.value;
            this.user.eyes = this.form.eyes.value;
            this.user.hair = this.form.hair.value;
            this.user.perfectDate = this.form.perfectDate.value;
            this.user.favoriteDish = this.form.favoriteDish.value;
            this.user.favoriteRestaurant = this.form.favoriteRestaurant.value;
            this.user.dinnerWith = this.form.dinnerWith.value;
            this.user.favoriteBooks = this.form.favoriteBooks.value;
            this.user.music = this.form.music.value;
            this.user.type = this.form.type.value;
            this.user.nutrition = this.form.nutrition.value;
            this.user.veggieReasons = this.form.veggieReasons.value;
            this.user.sport = this.form.sport.value;


            data = {
                // flow_signUpApi_instance: this.form.flow_signUpApi_instance.value,
                // flow_signUpApi_step: this.form.flow_signUpApi_step.value,
                user: this.user,
                signUpTwo: {
                    about: this.form.about.value,
                    looking: this.form.looking.value,
                    green: this.form.green.value,
                    smoking: this.form.smoking.value,
                    drinking: this.form.drinking.value,
                    children: this.form.children.value,
                    animals: this.form.animals.value,
                    interests: this.form.interests.value,
                    politicalAffiliation: this.form.politicalAffiliation.value,
                    height: this.form.height.value,
                    body: this.form.body.value,
                    eyes: this.form.eyes.value,
                    hair: this.form.hair.value,
                    perfectDate: this.form.perfectDate.value,
                    favoriteDish: this.form.favoriteDish.value,
                    favoriteRestaurant: this.form.favoriteRestaurant.value,
                    dinnerWith: this.form.dinnerWith.value,
                    favoriteBooks: this.form.favoriteBooks.value,
                    music: this.form.music.value,
                    type: this.form.type.value,
                    nutrition: this.form.nutrition.value,
                    veggieReasons: this.form.veggieReasons.value,
                    sport: this.form.sport.value,
                    // _token: this.form._token.value
                }
            };
            data = JSON.stringify(data);

        }
       // alert(JSON.stringify(this.user));
        this.api.http.post(this.api.url + '/open_api/v2/signs/ups/news.json', data, this.api.setHeaders()).subscribe((res: any) => {
            this.validate(res);
        }, () => this.api.hideLoad());
    }


    validate(response) {

        this.err = [];
        if (parseInt(response.id) > 0) { // step 4

            console.log(response, this.user);
            console.log(this.user.username, this.user.password);
            console.log(encodeURIComponent(this.user.username), encodeURIComponent(this.user.password));

            this.api.setHeaders(true, this.user.username, this.user.password);

            this.api.storage.set('user_data', {
                username: this.user.username,
                password: this.user.password,
                status: 'login',
                user_id: response.id,
                user_photo: response.photo
            });
            this.events.setStatus('login');
           // let that = this;
            this.api.storage.get('deviceToken').then((val) => {
               this.api.sendPhoneId(val);
           });
            const data = {
               // status: 'init',
                username: this.user.username,
                password: this.user.password
            };
            this.api.storage.set('', data);

            const navigationExtras: NavigationExtras = {
                queryParams: {
                    new_user: true
                }
            };
            this.router.navigate(['/change-photos'], navigationExtras);



        } else if (typeof response.user.form.step !== 'undefined' && response.user.form.step === (this.form.step + 1)) {
            console.log('in the valid if');
            this.form = response.user.form;
            console.log(this.form);
            this.formKeys = this.getKeys(this.form);
            console.log(this.form);
            if ((this.form.step === 2)) {
                 // delete option gey for womans ond lesbit for mans
                if (this.user.gender === 1) {
                 this.form.sexOrientation.choices.splice(2, 1);
                } else if (this.user.gender === 2) {
                    this.form.sexOrientation.choices.splice(1, 1);
                }
            }

            // alert('will scroll to top');
            this.content.scrollToTop(0);

        } else {
            console.log('in the invaf=lid');
          //  if(this.form.step == response.user.form.step) {
            if (this.form.step === 1) {
                    response.user.form.password.first = this.form.password.first;
                    response.user.form.password.second = this.form.password.second;
                    response.user.form.agree = this.form.agree;
                    response.user.form.agreeSendEmails = this.form.agreeSendEmails;
                } else if (this.form.step === 2) {
                    response.user.form.purposes = this.form.purposes;
                } else if (this.form.step === 3) {
                    console.log('in the 3 step');
                    response.user.form.veggieReasons = this.form.veggieReasons;
                    response.user.form.interests = this.form.interests;
                    response.user.form.animals = this.form.animals;
                }
            this.form = response.user.form;
            this.formKeys = this.getKeys(this.form);
            setTimeout( () => {
                    console.log('in et timeout');
                    const y = this.form.step === 3 ? $('.border-red').offset().top + 2100 : $('.border-red').offset().top ;
                    console.log(y);
                    // alert('will scroll to point');
                    this.content.scrollToPoint(null, y, 300);
                }, 300 );
           // }



            this.err = response.user.errors.form.children;
            if (this.err.length > 1) {
                this.errKeys = Object.keys(this.err);
            } else {
                this.allfields = 'יש למלא את כל השדות המסומנים בכוכבית';
            }
            console.log(this.err);

        }


        this.api.hideLoad();
        console.log(this.user);
    }

    getPage(id) {
        const navigationExtras: NavigationExtras = {
            state: {
                id
            }
        };
        // alert(id);
        this.router.navigate(['/page'], navigationExtras);
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
    }
}
