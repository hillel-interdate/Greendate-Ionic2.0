import {Storage} from '@ionic/storage';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {Injectable, isDevMode} from '@angular/core';
import {LoadingController, ToastController} from '@ionic/angular';



@Injectable({
    providedIn: 'root'
})
export class ApiQuery {

    data: any = {};
    url: any;
    headers: any;
    response: any;
    username: any = 'noname';
    password: any = 'nopass';
    header: any;
    status: any = '';
    back: any = false;
    storageRes: any;
    footer: any;
    pageName: any = false;
    loading: any;
    usersChooses: any = {};
    firstOpen: boolean;
    isLoading = false;
    isPay: any;

    constructor(public storage: Storage,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController,
                public http: HttpClient,
                private sanitizer: DomSanitizer) {

        // export JAVA_HOME=`/usr/libexec/java_home -v 1.8.0_221`
        if (isDevMode()) {
            // console.log('devmode');
            // this.url = 'http://localhost:8100';
            this.url = 'https://www.greendate.co.il';
        } else {
            // console.log('not dev mode');
            this.url = 'https://www.greendate.co.il';
        }
        // this.url = 'http://10.0.0.6:8100';
        this.footer = true;

    }

    safeHtml(html) {
        return this.sanitizer.bypassSecurityTrustHtml(html);
        // return this.sanitizer.bypassSecurityTrustScript(html);
    }

    sendPhoneId(idPhone) {
        //  alert('in send id , api page, id: ' + JSON.stringify(idPhone));
        // alert('in send phone id from api page  ,will send this: ' + idPhone);
        const data = JSON.stringify({phone_id: idPhone});
        // tslint:disable-next-line:no-shadowed-variable
        this.http.post(this.url + '/api/v2/phones', data, this.setHeaders(true)).subscribe(data => {
            // alert('data after send id: ' + JSON.stringify(data));
        }, err => console.log(`error was in send phone:  ${err}`));
    }

    functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {
        for (let i = 0; i < arraytosearch.length; i++) {
            // tslint:disable-next-line:triple-equals
            if (arraytosearch[i][key] == valuetosearch) {
                return i;
            }
        }
        return null;
    }

    async toastCreate(mess, duration = 60000) {
        const buttons = duration === 60000 ? [{text: 'אישור', role: 'cancel'}] : [];
        const toast = await this.toastCtrl.create({
            message: mess,
            buttons,
            duration,
            animated: true
        });
        await toast.present();
    }

    async showLoad(text = 'אנא המתן...') {
        if (!this.isLoading) {
            this.isLoading = true;
            return await this.loadingCtrl.create({
                message: text,
            }).then(a => {
                a.present().then(() => {
                    if (!this.isLoading) {
                        a.dismiss();
                    }
                });
            });
        }
    }

    async hideLoad() {
        if (this.isLoading) {
            this.isLoading = false;
            return await this.loadingCtrl.dismiss();
        }
    }

    setUserData(data) {
        this.setStorageData({label: 'username', value: data.username});
        this.setStorageData({label: 'password', value: data.password});
    }


    setStorageData(data) {
        this.storage.set(data.label, data.value);
    }

    getStorageData(data) {
        /*
         this.storage.get(data).then((res) => {
         console.log(this.storageRes);
         this.storageRes = res;
         });
         setTimeout(function(){
         console.log(this.storageRes);
         return this.storageRes;
         },2000);
         */
    }

    setHeaders(isAuth = false, username = '', password = '') {

        if (username !== '') {
            this.username = decodeURIComponent(username);
        }
        if (password !== '') {
            this.password = decodeURIComponent(password);
        }

        let myHeaders: HttpHeaders = new HttpHeaders();
        myHeaders = myHeaders.append('Content-type', 'application/json; charset=UTF-8');
        myHeaders = myHeaders.append('Accept', '*/*');
        myHeaders = myHeaders.append('Access-Control-Allow-Origin', '*');

        // tslint:disable-next-line:triple-equals
        if (isAuth == true) {
            // tslint:disable-next-line:max-line-length
            myHeaders = myHeaders.append('Authorization', 'Basic ' + btoa(encodeURIComponent(this.username) + ':' + encodeURIComponent(this.password)));
        }
        this.header = {
            headers: myHeaders
        };
        return this.header;
    }


    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit() {
        this.storage.get('user_data').then(data => {
            if (data.username) {
                this.username = data.username;
                this.password = data.password;
            }
        });

    }
}
