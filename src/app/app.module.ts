import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {UsersComponent} from "./users/users.component";
import {HttpClientModule} from "@angular/common/http";
import {ApiModule} from "./openapi-gen";
import { CategoryComponent } from './category/category.component';
import { ManageCardsComponent } from './manage-cards/manage-cards.component';
import { PlayCardsComponent } from './play-cards/play-cards.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    CategoryComponent,
    ManageCardsComponent,
    PlayCardsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ApiModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
