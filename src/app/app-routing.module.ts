import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FirstCardComponent} from "./first-card/first-card.component";
import {UsersComponent} from "./users/users.component";
import {CategoryComponent} from "./category/category.component";

const routes: Routes = [
  {
    path: 'home',
    component: CategoryComponent
  },
  {
    path: 'myfirst',
    component: FirstCardComponent
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
