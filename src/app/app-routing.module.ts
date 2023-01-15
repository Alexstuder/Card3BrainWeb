import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UsersComponent} from "./users/users.component";
import {CategoryComponent} from "./category/category.component";
import {ManageCardsComponent} from "./manage-cards/manage-cards.component";
import {PlayCardsComponent} from "./play-cards/play-cards.component";
import {OverviewComponent} from "./overview/overview.component";
import {SignupComponent} from "./signup/signup.component";
import {LoginComponent} from "./login/login.component";

const routes: Routes = [
  {
    path: 'home',
    component: LoginComponent
  },
  {
    path: 'category',
    component: CategoryComponent
  },
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'managecards',
    component: ManageCardsComponent
  },
  {
    path: 'play',
    component: PlayCardsComponent
  },
  {
    path: 'overview',
    component: OverviewComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
