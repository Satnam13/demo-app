import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { UserService } from './user.service';
import { Subject, interval } from 'rxjs';
import { FriendsService } from './friends.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private userService: UserService, private friendService: FriendsService) {
  }
  baseUrl = 'http://localhost:5000';
  socket = null;
  chatState = null;
  arrayFirstLoad = false;
  connected: Subject<boolean> = new Subject<boolean>();
  ready = false;
  readyState: Subject<boolean> = new Subject<boolean>();
  friendStatusChange: Subject<any> = new Subject<any>();
  incomingMessage: Subject<any> = new Subject<any>();
  async initialize() {
    console.log('initializing socket');
    try {
      await this.userService.autoLogin();
      this.connect();
    }
    catch(e) {
      console.log('need to login', e);
      return;
    }
  }
  connect() {
    console.log('connecting..');
    this.socket = io(this.baseUrl);
    this.socket.on('connect', (data) => {
      this.work();
  });
  }
  work() {
    this.socket.on('connected', (data) => {
      this.chatState = data;
      console.log('chat-state', data);
      this.socket.emit('userInitialization', /*this.userService.userState.email*/
      {email: this.userService.userState.email, socketId: this.chatState.socketId, username: this.userService.userState.username});
    });

    this.socket.on('incoming-message', (data) => {
      console.log('message received', data);
      this.incomingMessage.next(data);
    });

    this.socket.on('friend-status', (data, renew) => {
      if (Array.isArray(data)) {
        if (!this.arrayFirstLoad) {
          this.arrayFirstLoad = true;
          this.friendService.friends.unshift(...data);
          this.ready = true;
        }
        this.connected.next(true);
      }
      else {
        const index = this.findIndex(data.username);
        if (renew.renew) {
            console.log(renew);
            if (index !== -1) {
              console.log('updating');
              if (this.friendService.friends[index].socketId !== data.socketId) {
                this.friendService.friends[index] = data;
              }
            }
            else {
              console.log('pushing');
              this.friendStatusChange.next({type: 'online', username: data.username});
              this.friendService.friends.push(data);
            }
          }
        else {
          console.log('removing');
          this.friendStatusChange.next({type: 'offline', username: data.username});
          this.friendService.friends.splice(index, 1);
        }
      }

      console.log('friends', this.friendService.friends);
    });

  }
  findIndex(username) {
    return this.friendService.friends.findIndex(friend => friend.username === username);
  }
  sendMessage(msgData) {
    this.socket.emit('outgoing-message', msgData, this.chatState.socketId);
  }
  getReadyState() {
    let interval = null;
    if (this.ready) {
      this.readyState.next(this.ready);
      console.log('giving next');
    }
    else {
      interval = setInterval(() => {
        if (this.ready) {
          this.readyState.next(this.ready);
          clearInterval(interval);
          console.log('clearing interval');
        }
      }, 1000);
    }
  }
}
