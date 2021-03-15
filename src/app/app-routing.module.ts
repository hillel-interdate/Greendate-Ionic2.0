import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {path: '', redirectTo: '/home',  pathMatch: 'full'},
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'password-recovery', loadChildren: './password-recovery/password-recovery.module#PasswordRecoveryPageModule' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'registration', loadChildren: './registration/registration.module#RegistrationPageModule' },
  { path: 'select-modal', loadChildren: './select-modal/select-modal.module#SelectModalPageModule' },
  { path: 'page', loadChildren: './page/page.module#PagePageModule' },
  { path: 'password-recovery', loadChildren: './password-recovery/password-recovery.module#PasswordRecoveryPageModule' },
  { path: 'dialog', loadChildren: './dialog/dialog.module#DialogPageModule' },
  { path: 'search', loadChildren: './search/search.module#SearchPageModule' },
  { path: 'advanced-search', loadChildren: './advanced-search/advanced-search.module#AdvancedSearchPageModule' },
  { path: 'arena', loadChildren: './arena/arena.module#ArenaPageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'full-screen-profile', loadChildren: './full-screen-profile/full-screen-profile.module#FullScreenProfilePageModule' },
  { path: 'bingo', loadChildren: './bingo/bingo.module#BingoPageModule' },
  { path: 'contact-us', loadChildren: './contact-us/contact-us.module#ContactUsPageModule' },
  { path: 'faq', loadChildren: './faq/faq.module#FaqPageModule' },
  { path: 'freeze-account', loadChildren: './freeze-account/freeze-account.module#FreezeAccountPageModule' },
  { path: 'inbox', loadChildren: './inbox/inbox.module#InboxPageModule' },
  { path: 'notifications', loadChildren: './notifications/notifications.module#NotificationsPageModule' },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
  { path: 'item-details', loadChildren: './item-details/item-details.module#ItemDetailsPageModule' },
  { path: 'change-photos', loadChildren: './change-photos/change-photos.module#ChangePhotosPageModule' },
  { path: 'change-password', loadChildren: './change-password/change-password.module#ChangePasswordPageModule' },
  { path: 'edit-profile', loadChildren: './edit-profile/edit-profile.module#EditProfilePageModule' },
  { path: 'subscription', loadChildren: './subscription/subscription.module#SubscriptionPageModule' },
  /*

   { path: 'activation', loadChildren: './activation/activation.module#ActivationPageModule' },

   */

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { } { }
