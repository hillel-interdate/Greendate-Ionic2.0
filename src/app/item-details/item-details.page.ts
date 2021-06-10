import {Component, OnInit} from '@angular/core';
import { ApiQuery } from '../api.service';


@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.page.html'
})
export class ItemDetailsPage implements OnInit{

  selectedItem: any;

  constructor(public api: ApiQuery) {}

  ngOnInit() {
    this.selectedItem = this.api.data.item;
  }

  ionViewWillEnter() {
    this.api.pageName = 'InboxPage';
  }
}