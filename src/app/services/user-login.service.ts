import {Injectable} from '@angular/core';
import {CategoryDto, Configuration, UserDto} from "../openapi-gen";
import { BehaviorSubject } from 'rxjs';
import jwt_decode from 'jwt-decode';


interface  Token {
  sub: string;
  iat: number;
  exp: number;
  ID: string;
}

@Injectable({
  providedIn: 'root'
})

export class UserLoginService {

  private user : UserDto | undefined
  private category : CategoryDto | undefined
  private infoString = new BehaviorSubject('log in first');
  currentInfoStringMessage = this.infoString.asObservable();

  private token : string | undefined
  private tokenId : number | undefined
  private temp : string | undefined

  constructor(private apiConfiguration: Configuration) {}


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
    return this.tokenId
  }

  setCategory(category:CategoryDto){
    this.category = category
    this.updateInfoString()
  }



  setToken(token:string){
    this.token = token
    if(token && !(token==""))
      this.apiConfiguration.accessToken = this.token;
      try {
        let decoded: Token  = jwt_decode(token);

        //let obj : Token = JSON.parse(decoded??"");
        this.tokenId = +decoded.ID;
      } catch(Error) {

      }
  }

  getTokenUserId89(){
    return this.tokenId
}
}
