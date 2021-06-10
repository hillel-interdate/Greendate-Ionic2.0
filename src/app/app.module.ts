import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {IonicStorageModule} from '@ionic/storage';
import {HttpClientModule} from '@angular/common/http';
import {SelectModalPageModule} from './select-modal/select-modal.module';
import {Market} from '@ionic-native/market/ngx';

import {LoadingController} from '@ionic/angular';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Push} from '@ionic-native/push/ngx';
import {FileTransfer} from '@ionic-native/file-transfer/ngx';
import {HttpClientModule as HttpModule} from '@angular/common/http';
import {ImagePicker} from '@ionic-native/image-picker/ngx';
import {EventsService} from './events.service';
import {InAppPurchase} from '@ionic-native/in-app-purchase/ngx';


@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        HttpModule,
        BrowserModule,
        IonicModule.forRoot({
            animated: false,
            scrollAssist: true,
        }),
        AppRoutingModule,
        HttpClientModule,
        IonicStorageModule.forRoot(),
        SelectModalPageModule
    ],
    providers: [
        EventsService,
        Push,
        StatusBar,
        SplashScreen,
        LoadingController,
        Geolocation,
        Market,
        FileTransfer,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        ImagePicker,
        InAppPurchase,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}





