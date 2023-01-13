import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UsersComponent} from "./users/users.component";
import {CategoryComponent} from "./category/category.component";
import {ManageCardsComponent} from "./manage-cards/manage-cards.component";
import {PlayCardsComponent} from "./play-cards/play-cards.component";
import {OverviewComponent} from "./overview/overview.component";

const routes: Routes = [
  {
    path: 'home',
    component: OverviewComponent
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
    path: 'cards',
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
