import {Component, OnInit} from '@angular/core';
import {ApiQuery} from '../api.service';
import {Platform} from '@ionic/angular';
import {InAppPurchase} from '@ionic-native/in-app-purchase/ngx';
import {HomePage} from '../home/home.page';
import {AppRoutingEnum} from '../../appRoutingEnum';
import {Router} from '@angular/router';

@Component({
    selector: 'app-subscription',
    templateUrl: './subscription.page.html',
    styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit {

    page: any;
    public platform: string;

    constructor(public api: ApiQuery, private platformService: Platform, private iap: InAppPurchase, private  router: Router) {
        this.platform = this.platformService.is('ios') ? 'ios' : 'android';
        this.api.http.get(api.url + '/app_dev.php/api/v2/user/subscribe', this.api.setHeaders(true)).subscribe((data: any) => {
            this.page = data;
            if (this.platformService.is('ios')) {
                this.iap.getProducts(this.page.productsList)
                    .then(prods => {
                        this.page.payments = prods;
                        console.log(prods);
                    })
                    .catch(err => console.log(err));
            }
        });
    }


    ngOnInit() {
    }

    async subscribe(product) {
        if (this.platform === 'ios') {
            this.iap.subscribe(product.productId).then(async success => {
                console.log(success);
                const history = await this.iap.restorePurchases();
                console.log(history);
                if (history) {
                    this.api.http.post(this.api.url + this.api.apiUrl + '/subs',
                        {history, month: 'new'}, this.api.setHeaders(true))
                        .subscribe(data => {
                            this.router.navigate([AppRoutingEnum.HOME_PAGE]).then();
                        }, err => console.log(err));
                }
            }).catch(err => console.log(err));
        } else {
            window.open(this.page.url + '&payPeriod=' + product.period + '&prc=' + btoa(product.amount), '_blank');
        }
        return false;
    }


    ionViewWillEnter() {
        this.api.pageName = 'SubscriptionPage';
    }
}
