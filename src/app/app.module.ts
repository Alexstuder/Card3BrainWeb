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
import {ToastComponent} from "./components/toast/toast.component";
import {ToasterComponent} from "./components/toaster/toaster.component";
import { OverviewComponent } from './overview/overview.component';
import { SignupComponent } from './signup/signup.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    CategoryComponent,
    ManageCardsComponent,
    PlayCardsComponent,
    ToastComponent,
    ToasterComponent,
    OverviewComponent,
    SignupComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ApiModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
