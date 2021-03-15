import {Component, OnInit} from '@angular/core';
import {ApiQuery} from '../api.service';
import {Platform} from '@ionic/angular';
import {InAppPurchase} from '@ionic-native/in-app-purchase/ngx';

@Component({
    selector: 'app-subscription',
    templateUrl: './subscription.page.html',
    styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit {

    page: any;
    public platform: string;

    constructor(public api: ApiQuery, private platformService: Platform, private iap: InAppPurchase) {
        this.platform = this.platformService.is('android') ? 'android' : 'ios';
        if (this.platform !== 'ios') {
            this.api.http.get(api.url + '/app_dev.php/api/v2/user/subscribe', this.api.setHeaders(true)).subscribe((data: any) => {
                this.page = data;
            });
        } else {
            this.iap.getProducts(['1', '2', '3', '4']).then(prods => console.log(prods));
        }
    }


    ngOnInit() {
    }

    subscribe(payment) {
        window.open(this.page.url + '&payPeriod=' + payment.period + '&prc=' + btoa(payment.amount), '_blank');
        return false;
    }

    subscribeIos() {
        console.log('subscribing to ios')
    }

    ionViewWillEnter() {
        this.api.pageName = 'SubscriptionPage';
    }
}
