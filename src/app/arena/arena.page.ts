import {Component, ViewChild, OnInit} from '@angular/core';
import {ApiQuery} from '../api.service';
import {Injectable} from '@angular/core';
import {Router, NavigationExtras} from '@angular/router';
import {IonSlides} from '@ionic/angular';
import {EventsService} from '../events.service';
import {filter} from 'rxjs/operators';

/*
 Generated class for the Arena page.
 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-arena',
    templateUrl: 'arena.page.html',
    styleUrls: ['arena.page.scss']
})
@Injectable()
export class ArenaPage implements OnInit {

    @ViewChild(IonSlides) slides: IonSlides;


    users: any;

    texts: { like: string, add: string, message: string, remove: string, unblock: string, no_results: string };
    notifications: any;
    checkNotifications: any;
    user: any;
    index: any = 0;
    renderUsers: any = [];
    renderedUserCount: any = 0;

    constructor(public events: EventsService,
                public router: Router,
                public api: ApiQuery) {
    }


    ngOnInit() {

        this.api.showLoad();
        this.api.pageName = 'ArenaPage';
        const user_id = this.api.data.user ? this.api.data.user : '';

        const params = JSON.stringify({
            action: 'arena',
            user_id
        });

        this.api.http.post(this.api.url + '/api/v2/users/results', params, this.api.setHeaders(true)).subscribe((data: any) => {
            console.log(data);
            this.users = data.users;
            this.texts = data.texts;
            this.getUsers();
            // If there's message, than user can't be on this page
            if (data.arenaStatus) {
                this.api.toastCreate(data.arenaStatus);
                this.router.navigate(['/change-photos']);
            }
        });
        this.api.hideLoad();
    }

    slideChanged(event) {

        console.log('in slideChange');
        this.slides.getActiveIndex().then(index => this.index = index);
        if (this.index > this.renderedUserCount - 5 && this.renderedUserCount < this.users.length) {
            this.getUsers();
        }
    }

    getUsers() {
        const rendered = this.renderedUserCount;
        this.renderedUserCount += (this.users.length - this.renderedUserCount > 10) ? 10 : this.users.length - this.renderedUserCount;
        for (let x = rendered; x < this.renderedUserCount; x++) {
            this.renderUsers.push(this.users[x]);
            console.log(this.users);
            console.log(this.renderUsers);
            console.log(this.renderedUserCount);
        }
    }

    setNotifications() {
        this.events.user.pipe(filter(user => user.type === 'created')).subscribe( (user) => {
            console.log('Welcome', user, 'at');
            this.notifications = user.notifications;
        });
    }

    goToSlide(str) {
        const user = this.users[this.index];

        if (str === 'like') {

            const params = JSON.stringify({
                toUser: user.id,
            });

            this.api.http.post(this.api.url + '/api/v2/likes/' + user.id, params, this.api.setHeaders(true)).subscribe(data => {
                console.log(data);
            });

            this.renderUsers.splice(this.index, 1);
            // this.index++;
            this.slides.slideTo(this.index, 300);

        } else {


            this.slides.isEnd().then(end => {
                this.renderUsers.splice(this.index, 1);
                if (end) {
                    this.slides.slideTo(0, 300);
                } else {
                    this.slides.slideTo(this.index + 1, 300);
                }
            });

            // if (this.slides.isEnd()) {
            //   //this.slides.slideNext();
            //   var that = this;
            //   //setTimeout(function () {
            //   this.slides.slideTo(0, 300);
            //   //this.slides.update();
            //   //}, 10);
            // } else {
            //   this.slides.slideTo(this.index + 1, 300);
            // }
        }
    }


    toDialog() {
        this.api.data.user = this.renderUsers[this.index];
        this.router.navigate(['/dialog']);
    }


    toProfile() {
        // this.api.data['user'] = this.users[this.index];
        console.log(this.renderUsers[this.index]);

        // this.renderUsers[this.index].url = this.renderUsers[this.index].image.replace('h_300,w_300', 'h_500,w_500');
        const navigationExtras: NavigationExtras = {
            queryParams: {
                data: JSON.stringify({
                    user: this.renderUsers[this.index]
                })
            }
        };
        this.router.navigate(['/profile'], navigationExtras);
    }

    toNotifications() {
        this.router.navigate(['/notification']);
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad ArenaPage');
    }


    ionViewDidEnter() {
        this.slides.update();
    }

}
