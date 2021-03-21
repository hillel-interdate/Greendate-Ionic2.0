import {Component, ViewChild} from '@angular/core';
import {ApiQuery} from '../api.service';
import {IonContent} from '@ionic/angular';
import {Router, ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {ChangeDetectorRef} from '@angular/core';
// import {Keyboard} from '@ionic-native/keyboard/ngx';
import {Platform} from '@ionic/angular';

/*
 Generated class for the Profile page.
 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

declare var $: any;


@Component({
    selector: 'page-profile',
    templateUrl: 'profile.page.html',
    styleUrls: ['profile.page.scss']
})
export class ProfilePage {
    @ViewChild(IonContent) content: IonContent;


    isAbuseOpen: any = false;
    // isAbout: boolean = false;

    // user: { id: any, type: any, username: any, music: any, isAddBlackListed: any,
    // about: { label: any }, photos: any, photo: any, url: any, } = {
    //   id: '',
    //   isAddBlackListed: false,
    //   music: '',
    //   username: '',
    //   about: {label: ''},
    //   photos: '',
    //   type: '',
    //   photo: '',
    //   url: ''
    // };
    user: any = {
        isAddBlackListed: false
    };
    texts: { lock: any, unlock: any } = {lock: '', unlock: ''};

    formReportAbuse: { title: any, buttons: { cancel: any, submit: any }, text: { label: any, name: any, value: any } } =
        {title: '', buttons: {cancel: '', submit: ''}, text: {label: '', name: '', value: ''}};

    myId: any = false;


    constructor(public api: ApiQuery,
                public navLocation: Location,
                public router: Router,
                public route: ActivatedRoute,
                // public keyboard: Keyboard,
                private changeRef: ChangeDetectorRef,
                public platform: Platform) {
    }


    ngOnInit() {
        this.route.queryParams.subscribe((params: any) => {
            if (params.data) {
                this.user = JSON.parse(params.data).user;
                console.log(this.user);
                this.user.photos = [
                    {
                        isMain: true,
                        isValid: true,
                        url: this.user.url ? this.user.url : this.user.image,
                    }
                ];
                this.getUesr();
            } else {
                this.api.storage.get('user_data').then(userData => {
                    console.log(userData.user_id);
                    this.user.id = userData.user_id;
                    this.myId = userData.user_id;
                    this.user.username = userData.username;
                    this.user.photos = [
                        {
                            isMain: true,
                            isValid: true,
                            url: userData.user_photo
                        }
                    ];
                    console.log(userData);
                    this.getUesr();
                    this.api.hideLoad();
                });
            }
        });


    }


    onClickInput() {
        $('.footerMenu').hide();
        $('.container').css({'margin-bottom': '32px'});
        $('.abuse-form').css({'padding-bottom': 0});
        $('.content').css({'padding-bottom': 0});
        setTimeout(() => {
            this.content.scrollToBottom(100);
        }, 300);
    }


    onBlurInput() {
        $('.footerMenu').show();
        $('.container').css({'margin-bottom': '66px'});
    }


    onOpenKeyboard() {
        // $('.footerMenu').hide();
        // $('.content').css(
        //     {
        //         'margin-bottom': 0,
        //         'padding-bottom': '23px',
        //     }
        // );
        // $('.abuse-form').css(
        //     {
        //         'padding-bottom': '23px',
        //     }
        // );
        // setTimeout(()=>{
        //     this.content.scrollToBottom(100);
        // }, 300);
    }

    onHideKeyboard() {
        // $('.footerMenu').show();
        // $('.content').css(
        //     {
        //         'height': '101%',
        //         'padding-bottom': '10px',
        //     }
        // );
        // $('.abuse-form').css(
        //     {
        //         //'padding-bottom': '67px',
        //         'padding-bottom': '0',
        //     }
        // );

    }

    ionViewWillEnter() {
        this.api.pageName = 'ProfilePage';
        // window.addEventListener('keyboardWillShow', this.onOpenKeyboard);
        // window.addEventListener('keyboardWillHide', this.onHideKeyboard);
    }


    getKeys(obj) {

        return Object.keys(obj);

    }

    getUesr() {
        this.api.http.get(this.api.url + '/api/v2/users/' + this.user.id, this.api.setHeaders(true)).subscribe((data: any) => {
            this.user = data;
            this.formReportAbuse = data.formReportAbuse;
            this.changeRef.detectChanges();
        });

    }


    back() {
        this.api.back = true;
        this.navLocation.back();
    }

    addFavorites(user) {
        let params: string;
        if (user.isAddFavorite === false) {
            user.isAddFavorite = true;

            params = JSON.stringify({
                list: 'Favorite'
            });
        } else {
            user.isAddFavorite = false;
            params = JSON.stringify({
                list: 'Favorite',
                action: 'delete'
            });
        }

        this.api.http.post(this.api.url + '/api/v2/lists/' + user.id, params, this.api.setHeaders(true)).subscribe((data: any) => {
            console.log(data);
            this.api.toastCreate(data.success, 2500);
        });
    }

    blockSubmit() {
        let action: string;
        if (this.user.isAddBlackListed === true) {
            this.user.isAddBlackListed = false;
            action = 'delete';
        } else {
            this.user.isAddBlackListed = true;
            action = 'create';
        }


        const params = JSON.stringify({
            list: 'BlackList',
            action
        });

        this.api.http.post(this.api.url + '/api/v2/lists/' + this.user.id, params, this.api.setHeaders(true)).subscribe((data: any) => {
            this.api.toastCreate(data.success);
        });
    }

    addLike(user) {
        user.isAddLike = true;
        this.api.toastCreate(' עשית לייק ל' + user.username);

        const params = JSON.stringify({
            toUser: user.id,
        });

        this.api.http.post(this.api.url + '/api/v2/likes/' + user.id, params, this.api.setHeaders(true)).subscribe(data => {
            console.log(data);
        }, err => {
            console.log('Oops!');
        });

    }

    fullPagePhotos() {
        this.api.data.user = this.user;
        this.router.navigate(['full-screen-profile']);
    }

    toDialog(user) {

        this.api.data.user = user;
        this.router.navigate(['/dialog']);
    }

    reportAbuseShow() {
        this.isAbuseOpen = true;
        setTimeout(() => this.content.scrollToBottom(300), 300);
        $('.pmtitle.bottom').css(
            {
                'margin-bottom': '0px',
            }
        );
    }

    reportAbuseClose() {
        this.isAbuseOpen = false;
        this.formReportAbuse.text.value = '';
        // this.keyboard.hide();
        $('.footerMenu').show();
        $('.pmtitle.bottom').css({'margin-bottom': '66px'});
    }


    closeKeyboard() {
        // this.keyboard.hide();
    }

    abuseSubmit() {

        const params = JSON.stringify({
            text: this.formReportAbuse.text.value,
        });

        this.api.http.post(this.api.url + '/api/v2/reports/' + this.user.id + '/abuses', params,
            this.api.setHeaders(true)).subscribe((data: any) => {
            this.api.toastCreate(data.success);
        }, err => {
            console.log('Oops!');
        });
        this.reportAbuseClose();
    }


    ionViewWillLeave() {
        // this.keyboard.hide();
        // window.removeEventListener('keyboardWillShow', this.onOpenKeyboard);
        // window.removeEventListener('keyboardWillHide', this.onHideKeyboard);
    }

}
