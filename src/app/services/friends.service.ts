import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  constructor() { }
  friends = [];
  get onlineFriends() {
    return [...this.friends];
  }
}
