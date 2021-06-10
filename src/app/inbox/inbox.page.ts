import {Component, OnInit} from '@angular/core';

import {ApiQuery} from '../api.service';

import {Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {EventsService} from '../events.service';
import {filter} from 'rxjs/operators';
import {Subscription} from 'rxjs';


/*
 Generated class for the Inbox page.
 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-inbox',
    templateUrl: './inbox.page.html',
    styleUrls: ['inbox.page.scss']
})
export class InboxPage {

    users: Array<{ id: string, message: string, username: string, newMessagesNumber: string, faceWebPath: string, noPhoto: string }>;
    texts: { no_results: string };
    interval: any;
    private messageSubscription: Subscription;

    constructor(public router: Router,
                public alertCtrl: AlertController,
                public api: ApiQuery,
                public events: EventsService) {
        // this.api.storage.get('user_data').then((val) => {
        //     if (val) {
        //         this.api.setHeaders(true, val.username, val.password);
        //     }
        // });
    }

    ionViewWillEnter() {
        this.api.pageName = 'InboxPage';
        if (!this.api.back) {
            this.api.showLoad().then();
        } else {
            this.api.back = true;
        }
        this.getDialogs();
        //  this.interval = setInterval(() => this.getDialogs(), 10000)
        this.messageSubscription = this.events.messages.pipe(filter(messageType => messageType.type === 'new')).subscribe((data) => {
            // alert(1);
            this.getDialogs();
            // this.users = data.messages;
        });

    }

    ionViewWillLeave() {
        this.messageSubscription.unsubscribe();
    }

    getDialogs() {
        this.api.http.get(this.api.url + '/api/v2/inbox', this.api.setHeaders(true)).subscribe((data: any) => {
            console.log(data);
            this.users = data.dialogs;
            this.texts = data.texts;
            this.api.hideLoad();
        }, err => this.api.hideLoad());

    }

    // checkDialogs() {
    //     this.api.http.get(this.api.url + '/api/v2/inbox', this.api.setHeaders(true)).subscribe((data:any) => {
    //         if (data.dialogs.length != this.users.length) {
    //             this.users = data.dialogs;
    //         } else {
    //             for(let x = 0; x < data.dialogs.length; x++) {
    //                 if(this.users[x].message != data[x].message ) {
    //                     this.users[x]. message = data[x].message;
    //                 }
    //             }
    //         }
    //     });
    // }


    toDialogPage(user) {
        this.api.data.user = user;
        this.router.navigate(['/dialog']);
    }

    deleteDialog(dialog, index) {
        console.log(dialog);
        this.alertCtrl.create({
            header: 'מחיקת שיחה עם ' + dialog.username,
            message: 'למחוק את השיחה?',
            buttons: [
                {
                    text: 'כן',
                    handler: () => {

                        this.api.storage.get('user_data').then(user_data => {
                            if (user_data) {
                                const data = {
                                    user_id: user_data.user_id,
                                    contact_id: dialog.id
                                };
                                this.api.http.post(this.api.url + '/api/v2/deletes/inboxes.json', data, this.api.header)
                                    // tslint:disable-next-line:no-shadowed-variable
                                    .subscribe((data: any) => {
                                        this.api.showLoad();
                                        if (data.deleted) {
                                            this.users.splice(index, 1);
                                            this.ionViewWillEnter();
                                            console.log(this.users);
                                            this.api.hideLoad();
                                        } else {
                                            this.api.hideLoad();
                                        }
                                    });
                            }

                        }, err => this.api.hideLoad());
                    }
                },
                {
                    text: 'לא',
                    role: 'cancel',
                    // handler: () => {}
                }
            ]
        }).then(alert => alert.present());
    }


}
