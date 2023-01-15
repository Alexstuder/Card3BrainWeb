import { Injectable } from '@angular/core';
import {CategoryDto, UserDto} from "../openapi-gen";

@Injectable({
  providedIn: 'root'
})
export class UserLoginService {
  infoString : String = "1"

  private user : UserDto | undefined
  private category : CategoryDto | undefined

  constructor() { }

  setUser(user: UserDto){
    this.user = user
    if(this.user !== undefined && this.user !== null){
      this.infoString = this.user.userName + " " + this.user.firstName
    }
  }

  getUserId(){
    return this.user?.id
  }

  setCategory(category:CategoryDto){
    this.category = category
    if(this.category !== undefined && this.category !== null){
      this.infoString = this.user + "/" + this.category
    }
  }
}
