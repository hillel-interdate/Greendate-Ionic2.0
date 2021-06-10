import {Component, ViewChild} from '@angular/core';
import { AdvancedSearchPage } from '../advanced-search/advanced-search.page';
import { HomePage } from '../home/home.page';
import { ApiQuery } from '../api.service';
import {Router, NavigationExtras} from '@angular/router';
import {SelectModalPage} from '../select-modal/select-modal.page';
import {ModalController} from '@ionic/angular';
import {IonContent} from '@ionic/angular';

declare var $:any;

/*
 Generated class for the Search page.
 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-search',
  templateUrl: 'search.page.html',
  styleUrls: ['./search.page.scss']
})
export class SearchPage {

  @ViewChild(IonContent) content: IonContent;

  usersChooses: any = {};

  age: any;
  areas: Array<{ title: any }>;
  ages: Array<{ num: number }> = [];

  type_search: any = '';
  form: { form: any } = {
    form: {
      username: {},
      region: { choices: [[]], },
      ageFrom: {choices: [[]], label: ''},
      ageTo: {choices: [[]], label: ''},
    }
  } ;


  ageLower: any = 20;
  ageUpper: any = 50;

  default_range: any = { lower: this.ageLower, upper: this.ageUpper }

  constructor(
      public router: Router,
      public api: ApiQuery,
      public modalCtrl: ModalController
  ) {

    this.age = {
      lower: this.form.form.ageFrom.value,
      upper: this.form.form.ageTo.value
    };

    for (let i = 18; i <= 80; i++) {
      this.ages.push({num: i});
    }

    // this.form.form.ageFrom.value = 20;
    // this.form.form.ageTo.value = 50;

    this.api.http.get( api.url + '/api/v2/search?advanced=0', api.setHeaders(true) ).subscribe(data => {

      this.form.form = data;
      this.form.form.ageFrom.label = 'גיל מ';
      this.form.form.ageTo.label = 'גיל עד';
      this.form.form.heightFrom.label = 'גובה מ';
      this.form.form.heightTo.label = 'גובה עד';
      console.log(this.form);

    },err => {
      console.log('Oops!');
    });

    window.addEventListener('keyboardWillShow', this.onKeyboardShow);
    window.addEventListener('keyboardWillHide', this.onKeyboardHide);

  }

  onKeyboardShow() {
    $('.footerMenu').hide();
    $('.search-container').css({
      'max-height': 'calc(100% + 70px)'
    });
    setTimeout(()=>{
      this.content.scrollToBottom(100);
    }, 300);
  }

  onKeyboardHide() {
    $('.search-container').css({
      'max-height': 'calc(100% - 60px)'
    });
    $('.footerMenu').show();
  }

  SeachForm1(search_type) {
    console.log(this.form);
    this.toSearchResultsPage('search-form-1');
  }


  ionViewDidLoad() {
    this.type_search = 'search-1';
    $('.input-wrapper').delegate('.search-1','click', () => {
    });
  }

  async openSelect2(field, fieldTitle, search = false) {

    console.log(field);
    const modal = await this.modalCtrl.create({
      component: SelectModalPage,
      componentProps: {
        choices: field.choices,
        title: field.label,
        choseNow: this.usersChooses[fieldTitle],
        search
      }
    });
    await modal.present();

    modal.onDidDismiss().then(data => {
      console.log(data);
      if(data.data){
        this.form.form[fieldTitle].value = data.data.value;
        this.usersChooses[fieldTitle] = data.data.label;
        console.log(this.usersChooses);
      }
    });

  }

  toSearchResultsPage(search_type){
    let params;
    if( search_type === 'search-form-1' ) {
      console.log(this.ageLower);
      console.log(this.ageUpper);

      params = JSON.stringify({
        action: 'search',
        filter: 'lastActivity',
        quick_search: {
          region: this.form.form.region.value,
          ageFrom: this.form.form.ageFrom.value,
          ageTo: this.form.form.ageTo.value,
        }
      });
      // this.api.data['params'] = params;
      // this.router.navigate(['/home']);
    }else{
      params = JSON.stringify({
        action: 'search',
        filter: 'lastActivity',
        quick_search: {
          username: this.form.form.username.value
        }
      });
      // this.api.data['params'] = params;
      // this.router.navigate(['/home']);
    }

    const navigationExtras: NavigationExtras = {
      queryParams: {
        params
      }
    };
    this.router.navigate(['/home'], navigationExtras);
  }



  getAgeValues(event) {
    if( event.value.upper !== 0) {
      this.ageUpper = event.value.upper;
    }
    if( event.value.lower !== 0) {
      this.ageLower = event.value.lower;
    }
  }

  showFooter() {
    $('.footerMenu').show();
  }

  hideFooter() {
    $('.footerMenu').hide();
  }


  toAdvancedPage() {
    this.router.navigate(['/advanced-search']);
  }

  ionViewWillEnter() {
    this.api.pageName = 'SearchPage';
  }

  ionViewWillLeave() {
    $('.footerMenu').show();
    window.removeEventListener('keyboardWillShow', this.onKeyboardShow);
    window.removeEventListener('keyboardWillHide', this.onKeyboardHide);
  }

}
