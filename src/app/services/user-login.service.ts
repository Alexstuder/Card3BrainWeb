import {Injectable} from '@angular/core';
import {CategoryDto, Configuration} from "../openapi-gen";
import jwt_decode from 'jwt-decode';

const USER_KEY : string ="auth-user"

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

  private tokenId : number | undefined

  loggedUser : string = "NotLoggedIn"
  loggedIn   : boolean = false

  constructor(private apiConfiguration: Configuration) {}

  getUserId(){
    return this.tokenId
  }

  setToken(token:string){
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, token);
    console.log("token saved: "+token)
    this.readToken()
  }

  private readToken(){
    let token = window.sessionStorage.getItem(USER_KEY);
    console.log("token readed: "+token)
    if(token && !(token=="")) {
      //this.apiConfiguration.accessToken = this.token;
      try {
        this.apiConfiguration.credentials = {"bearerAuth": token}
        let decoded: Token = jwt_decode(token);
        this.tokenId = +decoded.ID;
        this.loggedUser = decoded.sub;
        this.loggedIn = true
      } catch (Error) {
        this.resetToken()
      }
    }else{
      this.resetToken()
    }
  }

  isTokenSet(){
    this.readToken()
    return this.loggedIn
  }

  resetToken(){
    window.sessionStorage.clear()
    this.loggedIn = false
    this.loggedUser = "NotLoggedIn"
    this.apiConfiguration.credentials = {"bearerAuth":  "1"}
  }
}
