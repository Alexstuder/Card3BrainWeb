import {Injectable} from '@angular/core';
import {CategoryDto, UserDto} from "../openapi-gen";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserLoginService {

  private user : UserDto | undefined
  private category : CategoryDto | undefined
  private infoString = new BehaviorSubject('log in first');
  currentInfoStringMessage = this.infoString.asObservable();

  constructor() {}


  private updateInfoString(){
    let info = ""
    if(this.user){
      info = info + this.user.mailAddress?? ""
    }
    if (this.category){
      info = info + " / " + this.category.categoryName ?? ""
    }
    this.infoString.next(info)
  }

  setUser(user: UserDto){
    this.user = user
    this.updateInfoString()
  }

  getUserId(){
    return this.user?.id
  }

  setCategory(category:CategoryDto){
    this.category = category
    this.updateInfoString()
  }
}
