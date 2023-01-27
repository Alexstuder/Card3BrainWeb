import {Injectable} from '@angular/core';
import {CategoryDto, Configuration} from "../openapi-gen";
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

  private token : string | undefined
  private tokenId : number | undefined

  loggedUser : string = "NotLoggedIn"
  loggedIn   : boolean = false

  constructor(private apiConfiguration: Configuration) {}

  getUserId(){
    return this.tokenId
  }

  setToken(token:string){
    if(token && !(token==""))
      //this.apiConfiguration.accessToken = this.token;
      try {
        this.apiConfiguration.credentials = {"bearerAuth":  token}
        let decoded: Token  = jwt_decode(token);
        this.tokenId = +decoded.ID;
        this.loggedUser = decoded.sub;
        this.token = token
        this.loggedIn = true
      } catch(Error) {
        this.resetToken()
      }
  }

  tokenSet(){
    if(this.token){
      return true
    }else{
      return false
    }
  }

  resetToken(){
    this.token = undefined
    this.loggedIn = false
    this.loggedUser = "NotLoggedIn"
    this.apiConfiguration.credentials = {"bearerAuth":  "1"}
  }
}
