import {Component, ViewChild, OnInit} from '@angular/core';
import {IonContent} from '@ionic/angular';
import {ApiQuery} from '../api.service';
import {Router, NavigationExtras} from '@angular/router';
import {Location} from '@angular/common';
import * as $ from 'jquery';

import {ChangeDetectorRef} from '@angular/core';


@Component({
    selector: 'page-dialog',
    templateUrl: 'dialog.page.html',
    styleUrls: ['dialog.page.scss']
})

export class DialogPage implements OnInit {
    @ViewChild(IonContent) content: IonContent;

    user: any = {};
    users: Array<{ id: string, isOnline: string, nick_name: string, image: string }>;
    texts: any = {a_conversation_with: '', title: '', photo: ''};
    message: any;
    messages: any = [];
    checkChat: any;
    notReadMessage: any = [];
    deleteMyMess: boolean;
    // keyboard: Keyboard;
    page: any = 1;
    addMoreMessages: any;
    messData: any;
    allowedToReadMessage: any;

    constructor(public api: ApiQuery,
                public router: Router,
                public navLocation: Location,
                public changeRef: ChangeDetectorRef,
    ) {
    }


    ngOnInit() {
        // alert(122);
        this.api.back = false;
        this.user = this.api.data.user;
        // alert(this.user);
        this.getMessages();
        // window.addEventListener('keyboardWillShow', () => {
        //   console.log('keyboard will show');
        //   this.scrollToBottom(500);
        // });


    }

    getMessages() {
        // alert(44);
        this.api.http.get(this.api.url + '/api/v2/dialogs/' + this.user.id + '?per_page=30&page=' + this.page,
            this.api.setHeaders(true)).subscribe((data: any) => {
            // alert(1)
            $('.footerMenu').hide();
            // console.log(data);
            this.user = data.dialog.contact;
            this.texts = data.texts;
            this.messages = data.history;
            this.allowedToReadMessage = data.allowedToReadMessage;
            for (let i = 0; i < this.messages.length; i++) {
                if (this.messages[i].isRead === false) {
                    this.notReadMessage.push(this.messages[i].id);
                    // alert(2)
                }
            }
            // console.log(this.notReadMessage);
            // console.log(this.messages);
            this.scrollToBottom(500, 0);
            this.addMoreMessages = this.messages.length >= 30;
            // console.log(this.addMoreMessages);
        }, err => {
            console.log('Oops!', err);
        });
    }

    scrollToBottom(t, s = 300) {
        //// alert(1);
        setTimeout(() => {
            // console.log('will scroll');
            this.content.scrollToBottom(s);
        }, t);
    }


    onOpenKeyboard() {
        this.scrollToBottom(100);
        // $('.user-block').css({'margin-top':'83%'});
    }

    // 90 line + 93 - for ios
    onCloseKeyboard() {
        //  $('.user-block').css({'margin-top':'24px'});
    }

    back() {
        $('.footerMenu').show();
        setTimeout(() => {
            $('.scroll-content, .fixed-content').css({'margin-bottom': '57px'});
        }, 500);

        this.api.back = true;
        this.navLocation.back();
    }

    sendPush() {
        this.api.http.post(this.api.url + '/api/v2/sends/' + this.user.id + '/pushes', {}, this.api.setHeaders(true)).subscribe(data => {
        });
    }

    sendMessage() {
        const params = JSON.stringify({
            message: this.message
        });
        // if(this.message.length > 0) {
        // let date = new Date();
        // let now = date.getHours() + ':' + date.getMinutes() + ' ' + date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();

        this.messData = {
            message: {
                username: this.api.username,
                text: this.message,
                delivered: false,
                messPoss: this.messages.length ? this.messages.length : 0
            }
        };
        // console.log(this.messData);
        this.messages.push(this.messData.message);
        // this.scrollToBottom(150);
        this.message = '';


        this.api.http.post(this.api.url + '/api/v2/sends/' + this.user.id + '/messages',
            params, this.api.setHeaders(true)).subscribe((data: any) => {
            if (data.message) {
                this.sendPush();
                data.message.dilevered = true;
                this.messages[this.messData.message.messPoss] = data.message;
                this.allowedToReadMessage = data.allowedToReadMessage;
                this.notReadMessage.push(data.message.id);
                this.scrollToBottom(150);
            } else {
                this.api.toastCreate(data.errorMessage);
                this.messages.splice(this.messData.message.messPoss, 1);
            }
        });

        // } else {
        // this.message = '';
        // }

    }

    moreMessages(event) {

        // console.log('more users run');

        if (this.addMoreMessages) {
            this.page++;
            this.api.http.get(this.api.url + '/api/v2/dialogs/' + this.user.id + '?per_page=30&page=' + this.page,
                this.api.setHeaders(true)).subscribe((data: any) => {
                // console.log(data);
                // $('.messages').css('overflow', 'hidden');
                for (const message of data.history) {
                    this.messages.unshift(message);
                }
                // console.log(this.messages);
                this.addMoreMessages = data.history.length >= 30;
            });
        }


        event.target.complete();

    }

    getNewMessages() {

        const myLastMess = this.notReadMessage.slice(-1)[0] ? this.notReadMessage.slice(-1)[0] : false;

        // var notReadMessageStr = '?messages=['+messagesIds+']';
        // console.log(this.notReadMessage);

        // this.api.http.get(this.api.url + '/api/v2/chats/' + this.user.id + '/new/messages' + notReadMessageStr,
        // this.api.setHeaders(true)).subscribe((data:any) => {
        this.api.http.get(this.api.url + '/api/v2/chats/' + this.user.id + '/new/messages?lastMess=' + myLastMess,
            this.api.setHeaders(true)).subscribe((data: any) => {

            if (data.lastIsRead && data.lastIsRead[0].isRead === 1 && this.allowedToReadMessage) {
                // alert(1);
                // console.log(this.notReadMessage);
                for (let y = this.messages.length - 1, x = 0; x < this.notReadMessage.length; x++, y--) {
                    this.messages[y].isRead = true;
                    // console.log(this.messages);
                }
                this.notReadMessage = [];
            }
            // console.log('new ' + JSON.stringify(data));
            if (data.newMessages && data.newMessages.length > 0) {
                // //alert(1);
                for (const message of data.newMessages) {
                    //  alert(2);
                    if (!this.allowedToReadMessage) {
                        // this.readMessagesStatus();
                    } else {
                        for (let y = this.messages.length - 1, x = 0; x < this.notReadMessage.length; x++, y--) {
                            this.messages[y].isRead = true;
                            // console.log(this.messages);
                        }
                        this.notReadMessage = [];
                    }
                    this.messages.push(message);
                    this.scrollToBottom(300);
                    const params = JSON.stringify({
                        message_id: message.id
                    });
                    this.api.http.post(this.api.url + '/api/v2/reads/' + this.user.id + '/messages',
                        // tslint:disable-next-line:no-shadowed-variable
                        params, this.api.setHeaders(true)).subscribe((data: any) => {

                    });
                }
                // this.messages.push(data.newMessages);
            }
            if (data.readMessages && data.readMessages.length > 0) {
                const readMess = data.readMessages;
                for (let i = 0; i < this.messages.length; i++) {
                    // *******alert(readMess.indexOf(this.messages[i].id));
                    if (readMess.indexOf(this.messages[i].id) !== '-1') {

                        this.messages[i].isRead = 1;
                        this.notReadMessage.splice(this.notReadMessage.indexOf(this.messages[i].id), 1);
                    }
                }
            }

        });

    }

    something(e) {
        e.preventDefault();
    }

    // sandReadMessage(){
    //   var params = JSON.stringify({
    //     message: 'ok-1990234'
    //   });
    //
    //   this.api.http.post(this.api.url + '/api/v2/sends/' + this.user.id + '/messages',
    //   params, this.api.setHeaders(true)).subscribe(data => {
    //   });
    // }

    deleteMessage(message, index) { // message.from

        this.api.showLoad();
        // console.log(message);
        this.api.storage.get('user_data').then(user_data => {

            if (user_data) {
                // console.log('in if data');
                this.deleteMyMess = message.from === user_data.user_id;
            }
            //  console.log(this.deleteMyMess);
            const data = {
                messageId: message.id,
                deleteFrom: this.deleteMyMess,
                userId: user_data.user_id,
                contactId: this.user.id
            };
            // tslint:disable-next-line:no-shadowed-variable
            this.api.http.post(this.api.url + '/api/v2/deletes/messages.json', data, this.api.header).subscribe(data => {
                if (data) {

                    // console.log(index);
                    this.messages.splice(index, 1);
                    // console.log(this.messages);
                    this.api.hideLoad();
                } else {
                    this.api.hideLoad();
                }
            });
        });

    }

    readMessagesStatus() {
        //// alert(this.notReadMessage.length);
        // if(this.notReadMessage.length > 0) {
        //   var params = JSON.stringify({
        //     messages: this.notReadMessage
        //   });
        //
        //   this.api.http.post(this.api.url + '/api/v2/checks/messages', params, this.api.setHeaders(true)).subscribe((data:any) => {
        //
        //     for (let i = 0; i < this.messages.length; i++) {
        //       if (data.readMessages.indexOf(this.messages[i].id) !== '-1') {
        //       this.messages[i].isRead = 1;
        //       }
        //     }
        //     for (let e = 0; this.notReadMessage.length; e++) {
        //       if (data.readMessages.indexOf(this.notReadMessage[e]) !== '-1') {
        //       delete this.notReadMessage[e];
        //       }
        //     }
        //   });
        // }
    }

    subscription() {
        this.router.navigate(['/subscription']);
    }

    ionViewWillLeave() {
        clearInterval(this.checkChat);
        $('.footerMenu').show();
        //  window.removeEventListener('keyboardDidShow', this.scrollToBottom)
    }

    toProfilePage() {
        // this.api.data['user'] = this.user;
        const navigationExtras: NavigationExtras = {
            queryParams: {
                data: JSON.stringify({
                    user: this.user
                })
            }
        };
        this.router.navigate(['/profile'], navigationExtras);
    }

    ionViewWillEnter() {
        // alert('-2');
        this.api.pageName = 'DialogPage';
        $('.footerMenu').hide();
        // console.log('DIALOG Load');
        this.scrollToBottom(400);
        const that = this;
        this.checkChat = setInterval(() => {
            // alert('-1');
            that.getNewMessages();
        }, 10000);

        $('button').click(() => {
            $('textarea').val('');
        });

    }

    useFreePointToReadMessage(message) {
        const index = this.api.functiontofindIndexByKeyValue(this.messages, 'id', message.id);
        this.api.http.get(this.api.url + '/api/v2/chats/' + message.id + '/use/free/point/to/read/message.json',
            this.api.setHeaders(true)).subscribe((data: any) => {
            this.messages[index].text = data.messageText;
            // this.setMessagesAsRead([message.id]);
            if (!data.userHasFreePoints) {
                // Update page
                // this.messages = [];
                // this.getMessages();
                for (let i = 0; i < this.messages.length; i++) {
                    this.messages[i].hasPoints = 0;
                }
                ;
            }
        });
    }

    ionViewDidLoad() {
    }
}
