import { Injectable } from '@angular/core';
import {UserDto} from "../openapi-gen";

@Injectable({
  providedIn: 'root'
})
export class UserLoginService {
  infoString : String = "1"

  private user : UserDto | undefined

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
}
