import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {UsersComponent} from "./users/users.component";
import {HttpClientModule} from "@angular/common/http";
import {ApiModule, Configuration, ConfigurationParameters} from "./openapi-gen";
import { CategoryComponent } from './category/category.component';
import { ManageCardsComponent } from './manage-cards/manage-cards.component';
import { PlayCardsComponent } from './play-cards/play-cards.component';
import {ToastComponent} from "./components/toast/toast.component";
import {ToasterComponent} from "./components/toaster/toaster.component";
import { SignupComponent } from './signup/signup.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { LoginComponent } from './login/login.component';
import {MatTableModule} from "@angular/material/table";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import 'hammerjs'
import {
  HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG}
  from '@angular/platform-browser';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatButtonModule} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import { InfoComponent } from './info/info.component';


export function apiConfigFactory (): Configuration  {
  const params: ConfigurationParameters = {
    // set configuration parameters here.
  }
  return new Configuration(params);
}

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    CategoryComponent,
    ManageCardsComponent,
    PlayCardsComponent,
    ToastComponent,
    ToasterComponent,
    SignupComponent,
    LoginComponent,
    InfoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ApiModule.forRoot(apiConfigFactory),
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
