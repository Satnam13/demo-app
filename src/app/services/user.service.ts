import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }
  loggedInCurrently = false;
  loggSuccess: Subject<boolean> = new Subject<boolean>();
  baseurl = 'http://localhost:5000';
  private _token = null;
  _userState: UserModel = null;
  // register
  registerUser(user): Observable<any> {
    return this.http.post(`${this.baseurl}/user/register`, user);
  }
  // login
  loginUser(user): Observable<any> {
    return this.http.post(`${this.baseurl}/user/login`, user);
  }
  // get user info
  userInfo(token: string): Observable<any> {
    return this.http.get(`${this.baseurl}/user/info`, {
      headers: new HttpHeaders({
        'x-auth-token': token
      })
    });
  }

  autoLogin() {
    return new Promise((resolve, reject) => {
      if (!this.loggedInCurrently) {
        if (this.token) {
          this.userInfo(this.token).subscribe({
            next: (value) => {
              this._userState = value;
              this.loggedInCurrently = true;
              resolve(this.loggedInCurrently);
              this.loggSuccess.next(true);
              console.log('auto login started user is', value);
            }
          });
        }
        else {
          reject(this.loggedInCurrently)
          console.log('no token, need to login');
        }
      }
      else {
        resolve(this.loggedInCurrently);
      }
    });
  }

  // getter and setter for token
  get token() {
    if (!this._token) {
      const token = localStorage.getItem('token');
      if (token) {
        this._token = token;
      }
      else {
        return null;
      }
    }
    return this._token.slice();
  }
  set token(token) {
    this._token = token;
    localStorage.setItem('token', token);
  }
  clearUser() {
    this._token = null;
    localStorage.removeItem('token');
    localStorage.clear();
    this.loggSuccess.next(false);
  }


  // get user state
  get userState() {
    return {...this._userState};
  }

  userAsyncValidaor(info: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseurl}/user/account`, {
      headers: new HttpHeaders().set('info', info)
    });
  }
}
