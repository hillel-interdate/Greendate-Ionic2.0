import {Component} from '@angular/core';
import {ApiQuery} from '../api.service';

/*
 Generated class for the Faq page.
 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

import {Router} from '@angular/router';


@Component({
  selector: 'page-faq',
  templateUrl: 'faq.page.html',
  styleUrls: ['faq.page.scss']
})
export class FaqPage {

  page: any;

  hightlightStatus: any = [];


  constructor(public api: ApiQuery,
              public router: Router) {}


  status(name, quest) {
    this.hightlightStatus[name][quest] = !this.hightlightStatus[name][quest];
  }

  ngOnInit() {
    this.api.pageName = 'FaqPage';
    this.api.http.get(this.api.url + '/open_api/faq', this.api.header).subscribe((data:any) => {
      this.page = data.content;
      console.log(this.page);



      /**
       *  set to hightlightStatus a view status of each question by default (false)
       *
       */
      for(const qa of this.page) {
        this.hightlightStatus[qa.name] = [];
        for(const a of qa) {
          this.hightlightStatus[qa.name][a].push('false');
        }
      }

      console.log(this.hightlightStatus);
    });
  }

}
