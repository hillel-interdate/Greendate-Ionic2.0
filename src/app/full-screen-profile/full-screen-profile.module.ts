import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FullScreenProfilePage } from './full-screen-profile.page';

const routes: Routes = [
  {
    path: '',
    component: FullScreenProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FullScreenProfilePage]
})
export class FullScreenProfilePageModule {}
