import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {
    Platform,
    AlertController, IonRouterOutlet
} from '@ionic/angular';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Push, PushOptions, PushObject} from '@ionic-native/push/ngx';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Market} from '@ionic-native/market/ngx';
import {ApiQuery} from './api.service';
import {MenuController} from '@ionic/angular';
import * as $ from 'jquery';
import {Router, NavigationEnd, NavigationExtras, NavigationStart} from '@angular/router';
import {IonNav} from '@ionic/angular';
import {Location} from '@angular/common';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {IonContent} from '@ionic/angular';
import {EventsService} from './events.service';
import {filter} from 'rxjs/operators';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    // providers: [Geolocation, MenuController, Push, Market, Nav, GestureController, TransitionController,
    // DomController, AlertController, Events],
    providers: [Keyboard],
    styleUrls: ['app.scss']


})
export class AppComponent implements AfterViewInit {

    @ViewChild(IonNav) nav: IonNav;
    @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;
    @ViewChild(IonContent) content: IonContent;

    banner: any;
    menu_items_logout: any;
    menu_items_login: any;
    menu_items: any;
    menu_items_settings: any;
    menu_items_contacts: any;
    menu_items_footer1: any;
    menu_items_footer2: any;

    deviceToken: any;
    activeMenu: string;
    username: any;
    back: string;

    is_login: any = false;
    status: any = '';
    texts: any = {};
    new_message: any = '';
    message: any = {};
    avatar = '';
    stats = '';
    interval: any = true;
    // rootPage:any = 'HomePage';


    androidVesion = '1.1.2';
    iosVersion = '1.0.0';

    constructor(public platform: Platform,
                public  menu: MenuController,
                public api: ApiQuery,
                public router: Router,
                private geolocation: Geolocation,
                public alertCtrl: AlertController,
                public navLocation: Location,
                public statusBar: StatusBar,
                public splashScreen: SplashScreen,
                public push: Push,
                public keyboard: Keyboard,
                public market: Market,
                private events: EventsService) {


        this.api.http.get(api.url + api.routeGroup +'/menu', {}).subscribe((data: any) => {
            this.initMenuItems(data.menu);
        });
        this.keyboard.hide();
        this.api.storage.get('user_data').then((val) => {
            this.initPushNotification();
            if (!val) {
                this.menu_items = this.menu_items_logout;
                this.router.navigate(['/login']);
            } else {
                this.api.setHeaders(true, val.username, val.password);
                this.menu_items = this.menu_items_login;
                this.getBingo();
                if (this.router.url === '/' || this.router.url === '/home') {
                    this.router.navigate(['/home']);
                }
            }
        });

        this.closeMsg();
        setInterval(() => {
            if (!(this.api.username === 'null' || this.api.username === 'noname' || this.api.username === false)) {
                this.getBingo();
                this.getMessage();
            }
        }, 10000);

        this.initializeApp();
        this.menu1Active(false);
        this.setLocation();
    }


    navigateHome() {
        this.menuCloseAll();
        this.api.back = false;
        const navigationExtras: NavigationExtras = {
            queryParams: {
                params: JSON.stringify({
                    action: 'search',
                    filter: 'new',
                    page: '1'
                })
            }
        };
        this.menu.close().then(res => console.log(res));
        if (this.api.pageName === 'HomePage') {
            this.events.setLogo('click');
        } else {
            this.router.navigate(['/home'], navigationExtras).then();
        }
    }


    initPushNotification() {

        if (!this.platform.is('cordova')) {
            console.log('Push notifications not initialized. Cordova is not available - Run in physical device');
            return;
        }
        const options: PushOptions = {
            android: {},
            ios: {
                alert: 'true',
                badge: true,
                sound: 'false'
            },
            windows: {},
            browser: {
                pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            }
        };
        const push2: PushObject = this.push.init(options);
        push2.on('registration').subscribe((data) => {
            this.api.storage.set('deviceToken', data.registrationId);
            this.api.sendPhoneId(data.registrationId);
        });

        push2.on('notification').subscribe((data: any) => {
            if (data.additionalData.foreground === false) {
                this.api.storage.get('user_data').then((val) => {
                    if (val) {
                        this.api.setHeaders(true, val.username, val.password);
                        this.api.data.user = {
                            id: data.additionalData.userFrom
                        };
                        this.router.navigate(['/dialog']);
                        this.new_message.is_not_sent_today = false;
                    } else {
                        this.router.navigate(['/login']);
                    }
                });
            }
        });
    }

    closeMsg() {
        this.new_message = '';
    }


    setLocation() {
        this.geolocation.getCurrentPosition().then(pos => {
            const params = JSON.stringify({
                latitude: pos.coords.latitude.toString(),
                longitude: pos.coords.longitude.toString()
            });

            this.api.http.post(this.api.url + '/api/v2/locations', params, this.api.setHeaders(true)).subscribe(data => {
            });
        });
    }

    getStatistics() {
        this.api.http.get(this.api.url + '/api/v2/statistics', this.api.setHeaders(true)).subscribe((data: any) => {

            const statistics = data.statistics;

            // First Sidebar Menu
            this.menu_items[2].count = statistics.newNotificationsNumber;
            this.menu_items[0].count = statistics.newMessagesNumber;
            // Contacts Sidebar Menu
            this.menu_items_contacts[0].count = statistics.viewed;
            this.menu_items_contacts[1].count = statistics.viewedMe;
            this.menu_items_contacts[2].count = statistics.connected;
            this.menu_items_contacts[3].count = statistics.connectedMe;
            this.menu_items_contacts[4].count = statistics.favorited;
            this.menu_items_contacts[5].count = statistics.favoritedMe;
            this.menu_items_contacts[6].count = statistics.blacklisted;
            // Footer Menu
            this.menu_items_footer2[2].count = statistics.newNotificationsNumber;
            this.menu_items_footer2[2].count = 0;
            this.menu_items_footer1[3].count = statistics.newMessagesNumber;
            this.menu_items_footer2[0].count = statistics.favorited;
            this.menu_items_footer2[1].count = statistics.favoritedMe;
            this.api.isPay = data.isPay;

            this.bannerStatus();

        }, err => {
            this.clearLocalStorage();
        });
    }


    bannerStatus() {

        if (this.api.pageName === 'DialogPage' || this.api.pageName === 'EditProfilePage'
            || this.api.pageName === 'Registration' || this.api.pageName === 'ArenaPage'
            || this.api.pageName === 'ChangePhotosPage' || this.api.pageName === 'ProfilePage' || this.is_login === false) {
            $('.link-banner').hide();
        } else if (this.api.pageName === 'LoginPage') {
            $('.link-banner').hide();
        } else if (this.api.pageName === 'HomePage') {
            $('.link-banner').show();
        } else {
            $('.link-banner').show();
        }

    }


    clearLocalStorage() {
        this.api.setHeaders(false, null, null);
        // Removing data storage
        this.api.storage.remove('user_data');
        this.router.navigate(['/login']);
    }

    initMenuItems(menu) {
        this.back = menu.back;
        this.stats = menu.stats;
        this.menu_items_logout = [
            {_id: '', icon: 'log-in', title: menu.login, url: '/login', count: ''},
            {_id: 'blocked', icon: '', title: menu.forgot_password, url: '/password-recovery', count: ''},
            {_id: '', icon: 'mail', title: menu.contact_us, url: '/contact-us', count: ''},
            {_id: '', icon: 'person-add', title: menu.join_free, url: '/registration', count: ''},
        ];

        this.menu_items = [
            {_id: 'inbox', icon: '', title: menu.inbox, url: '/inbox', count: ''},
            {_id: 'the_area', icon: '', title: menu.the_arena, url: '/arena', count: ''},
            {_id: 'notifications', icon: '', title: menu.notifications, url: '/notifications', count: ''},
            {_id: 'stats', icon: 'list-outline', title: menu.contacts, url: '/profile', count: ''},
            {_id: '', icon: 'search', title: menu.search, url: '/search', count: ''},
            {_id: '', icon: 'information-circle', title: 'שאלות נפוצות', url: '/faq', count: ''},
            {_id: '', icon: 'mail', title: menu.contact_us, url: '/contact-us', count: ''},
            {_id: 'subscription', icon: 'ribbon', title: menu.subscription, url: '/subscription', count: ''},
        ];

        this.menu_items_login = [
            {_id: 'inbox', icon: '', title: menu.inbox, url: '/inbox', count: ''},
            {_id: 'the_area', icon: '', title: menu.the_arena, url: '/arena', count: ''},
            {_id: 'notifications', icon: '', title: menu.notifications, url: '/notifications', count: ''},
            {_id: 'stats', icon: 'stats', title: menu.contacts, url: '/profile', count: ''},
            {_id: '', icon: 'search', title: menu.search, url: '/search', count: ''},
            {_id: '', icon: 'information-circle', title: 'שאלות נפוצות', url: '/faq', count: ''},
            {_id: '', icon: 'mail', title: menu.contact_us, url: '/contact-us', count: ''},
            {_id: 'subscription', icon: 'ribbon', title: menu.subscription, url: '/subscription', count: ''},
        ];

        this.menu_items_settings = [
            {_id: 'edit_profile', icon: '', title: menu.edit_profile, url: '/edit-profile', count: ''},
            {_id: 'edit_photos', icon: '', title: menu.edit_photos, url: '/change-photos', count: ''},
            {_id: '', icon: 'person', title: menu.view_my_profile, url: '/profile', count: ''},
            {_id: 'change_password', icon: '', title: menu.change_password, url: '/change-password', count: ''},
            {_id: 'freeze_account', icon: '', title: menu.freeze_account, url: '/freeze-account', count: ''},
            {_id: 'settings', icon: 'cog', title: menu.settings, url: '/settings', count: ''},
            {_id: '', icon: 'mail', title: menu.contact_us, url: '/contact-us', count: ''},
            {_id: 'logout', icon: 'log-out', title: menu.log_out, url: '/login', count: ''}
        ];

        this.menu_items_contacts = [
            {_id: 'viewed', icon: '', title: menu.viewed, url: '/home', list: 'viewed', count: ''},
            {
                _id: 'viewed_me',
                icon: '',
                title: menu.viewed_me,
                url: '/home',
                list: 'viewed_me',
                count: ''
            },
            {
                _id: 'contacted',
                icon: '',
                title: menu.contacted,
                url: '/home',
                list: 'connected',
                count: ''
            },
            {
                _id: 'contacted_me',
                icon: '',
                title: menu.contacted_me,
                url: '/home',
                list: 'connected_me',
                count: ''
            },
            {
                _id: 'favorited',
                icon: '',
                title: menu.favorited,
                url: '/home',
                list: 'favorited',
                count: ''
            },
            {
                _id: 'favorited_me',
                icon: '',
                title: menu.favorited_me,
                url: '/home',
                list: 'favorite_me',
                count: ''
            },
            {_id: '', icon: 'lock', title: menu.blocked, url: '/home', list: 'black', count: ''}

        ];

        this.menu_items_footer1 = [
            {
                _id: 'online',
                src_img: '../assets/img/icons/online.png',
                icon: '',
                list: 'online',
                title: menu.online,
                url: '/home',
                count: ''
            },
            {
                _id: 'viewed',
                src_img: '../assets/img/icons/the-arena.png',
                icon: '',
                list: 'viewed',
                title: menu.the_arena,
                url: '/arena',
                count: ''
            },
            {
                _id: 'near-me',
                src_img: '',
                title: 'קרוב אלי',
                list: 'distance',
                icon: 'pin',
                url: '/home',
                count: ''
            },
            {
                _id: 'inbox',
                // src_img: '../assets/img/icons/inbox.png',
                src_img: '',
                icon: 'chatbubbles-outline',
                list: '',
                title: menu.inbox,
                url: '/inbox',
                count: ''
            },
        ];

        this.menu_items_footer2 = [
            {
                _id: '',
                src_img: '../assets/img/icons/favorited.png',
                icon: '',
                list: 'favorited',
                title: menu.favorited,
                url: '/home',
                count: ''
            },
            {
                _id: '',
                src_img: '../assets/img/icons/favorited_me.png',
                icon: '',
                list: 'favorite_me',
                title: menu.favorited_me,
                url: '/home',
                count: ''
            },
            {
                _id: 'notifications',
                src_img: '../assets/img/icons/notifications_ft.png',
                list: '',
                icon: '',
                title: menu.notifications,
                url: '/notifications',
                count: ''
            },
            {_id: '', src_img: '', icon: 'search', title: menu.search, list: '', url: '/search', count: ''},
        ];
    }


    menu1Active(bool = true) {
        this.activeMenu = 'menu1';
        this.menu.enable(true, 'menu1');
        this.menu.enable(false, 'menu2');
        this.menu.enable(false, 'menu3');
        if (bool) {
            this.menu.open('menu1');
        }
    }


    menu2Active() {
        this.activeMenu = 'menu2';
        this.menu.enable(false, 'menu1');
        this.menu.enable(true, 'menu2');
        this.menu.enable(false, 'menu3');
        this.menu.toggle('menu2');
    }


    menu3Active() {
        this.activeMenu = 'menu3';
        this.menu.enable(false, 'menu1').then(asd => console.log(asd + 'from 1'));
        this.menu.enable(false, 'menu2').then(asd => console.log(asd + 'from 2'));
        this.menu.enable(true, 'menu3').then(asd => console.log(asd + 'from 3'));
        this.menu.open('menu3').then(val => console.log(val + 'from toggle'));
    }


    menuCloseAll() {
        if (this.activeMenu !== 'menu1') {
            this.menu.toggle();
            this.activeMenu = 'menu1';
            this.menu.enable(true, 'menu1');
            this.menu.enable(false, 'menu2');
            this.menu.enable(false, 'menu3');
            this.menu.close().then(res => console.log(res));
            this.menu.toggle();
        }
    }


    initializeApp() {

        this.platform.ready().then(() => {
            this.getAppVersion();
            this.statusBar.show();
            // this.statusBar.styleDefault();
            // this.statusBar.hide();
            // this.splashScreen.hide();
        });
    }

    swipeFooterMenu() {
        // console.log('in swipe footer function');
        if ($('.more-btn').hasClass('menu-left')) {
            $('.more-btn').removeClass('menu-left');
            $('.more-btn .right-arrow').show();
            $('.more-btn .left-arrow').hide();

            $('.more-btn').parents('.menu-one').animate({
                'margin-right': '-92%'
            }, 1000);
        } else {
            $('.more-btn').addClass('menu-left');
            $('.more-btn .left-arrow').show();
            $('.more-btn .right-arrow').hide();
            $('.more-btn').parents('.menu-one').animate({
                'margin-right': '0'
            }, 1000);
        }
    }

    removeBackground() {
        $('#menu3, #menu2').find('ion-backdrop').remove();
    }

    getBanner() {
        this.api.http.get(this.api.url + '/open_api/v2/banner', this.api.header).subscribe((data: any) => {
            this.banner = data.banner;
            console.log(this.banner);
        });
    }

    goTo() {
        window.open(this.banner.link, '_blank');
        return false;
    }

    openPage(page) {

        let params = '';
        let logout = false;
        if (page._id === 'logout') {
            this.status = '';
            logout = true;
        }

        if (page._id === 'stats') {
            this.menu3Active();
        } else {
            // close the menu when clicking a link from the menu
            this.menu.close();


            // navigate to the new page if it is not the current page
            if (page.list === 'online') {
                params = JSON.stringify({
                    action: 'online'
                });
            } else if (page.list === 'distance') {
                params = JSON.stringify({
                    action: 'search',
                    filter: page.list
                });
            } else {

                params = JSON.stringify({
                    action: 'list',
                    list: page.list
                });
            }

            // this.nav.push(page.component, {page: page, action: 'list', params: params});

            const navigationExtras: NavigationExtras = {
                queryParams: {
                    params,
                    page,
                    action: 'list',
                    logout
                }
            };
            this.router.navigate([page.url], navigationExtras);

        }
    }

    getBingo() {
        this.api.storage.get('user_data').then((val) => {
            if (val) {
                this.api.http.get(this.api.url + '/api/v2/bingo', this.api.setHeaders(true)).subscribe((data: any) => {
                    this.api.storage.set('status', this.status);
                    this.avatar = data.texts.photo;
                    this.texts = data.texts;
                    console.log('THERE  2  12334656786484');
                    // DO NOT DELETE
                    if (this.status !== data.status) {
                        this.status = data.status;
                        this.checkStatus();
                    } else {
                        this.status = data.status;
                    }
                    if (data.user) {
                        this.api.data.data = data;
                        this.router.navigate(['/bingo']);
                        // tslint:disable-next-line:no-shadowed-variable
                        this.api.http.get(this.api.url + '/api/v2/bingo?likeMeId=' + data.user.id,
                            // tslint:disable-next-line:no-shadowed-variable
                            this.api.setHeaders(true)).subscribe(data => {
                        });
                    }
                });
            }
        });
    }

    dialogPage() {
        console.log(this.new_message);
        const user = {id: this.new_message.userId};
        this.closeMsg();
        this.api.data.user = user;
        this.router.navigate(['/dialog']).then();
    }

    getMessage() {
        this.api.http.get(this.api.url + '/api/v2/new/messages', this.api.setHeaders(true)).subscribe((data: any) => {

            if ((this.new_message === '' || typeof this.new_message === 'undefined') && !(this.api.pageName === 'DialogPage')) {

                this.new_message = data.messages[0];
                if (typeof this.new_message === 'object') {
                    // tslint:disable-next-line:no-shadowed-variable
                    this.api.http.get(this.api.url + '/api/v2/messages/notify?message_id=' + this.new_message.id,
                        // tslint:disable-next-line:no-shadowed-variable
                        this.api.setHeaders(true)).subscribe(data => {
                    });

                }
            }
            if (this.menu_items[0].count < data.newMessagesNumber) {
                this.events.setMessages({type: 'new', data});
            }
            this.message = data;
            this.menu_items[2].count = data.newNotificationsNumber;
            this.menu_items[0].count = data.newMessagesNumber;
            this.menu_items_footer2[2].count = data.newNotificationsNumber;
            this.menu_items_footer1[3].count = data.newMessagesNumber;

        });
    }

    checkStatus() {
        if (!(this.api.pageName === 'ActivationPage') && !(this.api.pageName === 'ContactUsPage') &&
            !(this.api.pageName === 'ChangePhotosPage') && !(this.api.pageName === 'Registration') &&
            !(this.api.pageName === 'PagePage')) {
            if (this.status === 'no_photo') {

                if (this.texts.photoMessage) {
                    this.api.toastCreate(this.texts.photoMessage);
                }
            } else if (this.status === 'not_activated') {

            }
        }
        if (this.api.pageName === 'ActivationPage' && this.status === 'login') {
            this.router.navigate(['/home']).then();
        }
    }

    async alert(title, subTitle) {
        const alert = await this.alertCtrl.create({
            header: title,
            subHeader: subTitle,
            buttons: ['אישור']
        });
        await alert.present();
    }

    getAppVersion() {
        this.api.http.get(this.api.url + '/open_api/v2/version', this.api.header).subscribe((data: any) => {

            // if(this.platform.is('android') && data != this.androidVesion ) {
            //   this.market.open('il.co.greendate');
            // } else if(this.platform.is('ios') && data != this.iosVersion) {
            //   this.market.open('il.co.greendate');
            // }

            if ((this.platform.is('android') && data.android_version !== this.androidVesion && data.android_version !== '1.0.1')
                || (this.platform.is('ios') && data.ios_version !== this.iosVersion)
            ) {
                this.alertCtrl.create({
                    header: data.title,
                    message: data.message,

                    buttons: [
                        {
                            text: data.cancel,
                        },
                        {
                            text: data.update,
                            handler: res => {
                                this.market.open('il.co.greendate');
                            }
                        }
                    ]
                }).then(alert => alert.present());
            }


            // if (this.platform.is('cordova')) {
            //   this.appVersion.getVersionNumber().then((s) => {
            //     if (data != s) {
            //       window.open('market://details?id=com.nyrd', '_system');
            //     } else {
            //       alert('else of getAppVersion(data = s)');
            //     }
            //   })
            // }
        });
    }


    ngAfterViewInit() {
        // this.keyboard.hide();
        // $(window).resize();
        this.router.events.pipe(filter(value => value instanceof NavigationEnd)).subscribe((val) => {
            $('.footerMenu').show();
            this.getBanner();

            this.events.statistics.subscribe(eventName => {
                if (eventName === 'updated') {
                    this.getStatistics();
                }
            });
            setTimeout(() => {
                this.keyboard.hide();
                setTimeout(() => {
                    $('ion-content').css({height: '100%'});
                }, 100);
                setTimeout(() => {
                    $('ion-content').css({height: '101%'});
                }, 200);
                setTimeout(() => {
                    $('ion-content').css({height: '100%'});
                }, 300);

            }, 200);

            const that = this;
            window.addEventListener('native.keyboardshow', () => {
                console.log('keyboardshow');
                $('.link-banner').hide();
                $('.footerMenu, .back-btn').hide();
                $('.back-btn').hide();


                if (that.api.pageName === 'DialogPage') {
                    $('.banner').hide();

                    setTimeout(() => {
                        $('.ios .user-block').css({
                            'margin-top': '235px'
                        });
                    }, 200);
                } else {
                    $('.banner').show();
                    setTimeout(() => {
                        $('ion-content').css({'margin-bottom': '0px'});
                    }, 200);

                }

                if (that.api.pageName === 'EditProfilePage') {
                    console.log('if uf edit page');
                    $('.container').css({
                        margin: '0 0 197px!important'
                    });
                } else if (that.api.pageName === 'ProfilePage') {
                    console.log('if uf profile page');
                    $('.container').css({'margin-bottom': '32px'});
                    $('.abuse-form').css({'padding-bottom': 0});
                    $('.content').css({'padding-bottom': 0});
                }

            });


            window.addEventListener('native.keyboardhide', () => {
                // let page = el.nav.getActive();
                // $('.footerMenu, .back-btn').show();
                $('ion-content').css({height: '100%'});
                that.bannerStatus();
                // that.keyboard.hide();
                if (that.api.pageName === 'DialogPage') {
                    $('.back-btn').show();
                    $('.footerMenu').hide();
                    setTimeout(() => {
                        $('.ios .user-block').css({
                            'margin-top': '27px'
                        });
                    }, 600);
                } else {
                    $('.footerMenu, .back-btn').show();
                    setTimeout(() => {
                        $('.scroll-content, .fixed-content').css({'margin-bottom': '0px'});
                    }, 500);
                }
                if (that.api.pageName === 'EditProfilePage') {
                    $('.container').css({
                        margin: '0 0 69px!important'
                    });
                } else if (that.api.pageName === 'ProfilePage') {
                    $('.container').css({'margin-bottom': '32px'});
                    $('.abuse-form').css({'padding-bottom': 0});
                    $('.content').css({'padding-bottom': 0});
                }

            });


            if (this.api.pageName === 'HomePage' && this.interval === false) {
                $('.link-banner').show();
                this.interval = true;
                this.getBingo();
            } else if (this.api.pageName === 'HomePage') {
                if (this.api.status !== '') {
                    this.status = this.api.status;
                }
            } else if (this.api.pageName === 'LoginPage') {
                clearInterval(this.interval);
                this.interval = false;
                this.avatar = '';
                this.menu_items = this.menu_items_logout;
                this.is_login = false;
            }


            // this.api.setHeaders(true);

            // tslint:disable-next-line:no-shadowed-variable
            this.api.storage.get('user_data').then((val) => {
                if (val) {
                    if (this.status === '') {
                        this.status = val.status;
                    }
                    this.checkStatus();
                    if (!val.status) {
                        this.menu_items = this.menu_items_logout;
                        this.is_login = false;
                        clearInterval(this.interval);
                        this.interval = false;
                    } else {
                        this.is_login = true;
                        this.menu_items = this.menu_items_login;
                        this.getStatistics();
                    }


                    if (this.api.pageName === 'HomePage') {
                        $('.link-banner').show();
                    } else if (this.api.pageName === 'LoginPage') {
                        $('.link-banner').hide();
                    }
                    this.bannerStatus();

                }
            });


            setTimeout(() => {
                // tslint:disable-next-line:no-shadowed-variable
                this.api.storage.get('user_data').then(val => {
                    if (!val) {
                        if (this.api.pageName !== 'PasswordRecoveryPage' && this.api.pageName !== 'RegistrationPage' &&
                            this.api.pageName !== 'PagePage' && this.api.pageName !== 'ContactUsPage') {
                            this.router.navigate(['/login']).then();
                            this.is_login = false;
                            this.menu_items = this.menu_items_logout;
                            clearInterval(this.interval);
                        }
                    }
                });
            }, 900);
        });
    }
}


