import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UserModel } from 'src/app/models/user.model';
import { ChatService } from 'src/app/services/chat.service';
import { RequestService } from 'src/app/services/request.service';
import { FriendsService } from 'src/app/services/friends.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-chat-main',
  templateUrl: './chat-main.component.html',
  styleUrls: ['./chat-main.component.css']
})
export class ChatMainComponent implements OnInit {
  state: UserModel;
  friends = [];
  timer = null;
  loader = false;
  err = null;
  searchResult = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private chatService: ChatService,
    private requestService: RequestService,
    private friendService: FriendsService) {
  }

        async ngOnInit() {
        try {
          await this.userService.autoLogin();
          this.state = this.userService.userState;
          this.chatService.initialize();
          // this.state.friends.forEach((friend) => {
          //   const state = {name: friend, isOnline: false};
          //   this.friends.push(state);
          // });
          this.chatService.getReadyState();
          this.chatService.readyState.pipe(take(1)).subscribe({
            next: value => {
              const online = this.friendService.onlineFriends;
              // mapping
              this.state.friends.forEach(friend => {
                const index = online.findIndex(friendObj => friendObj.username == friend);
                if (index !== -1) {
                  this.friends.push({username: friend, isOnline: true});
                }
                else {
                  this.friends.push({username: friend, isOnline: false});
                }
              });
            }
          });
          this.chatService.friendStatusChange.subscribe({
            next: value => {
              console.log('friend status change', value);
              const index = this.friends.findIndex(friend => friend.username === value.username);
              if (value.type === 'online') {
                this.friends[index].isOnline = true;
              }
              else{
                this.friends[index].isOnline = false;
              }
            }
          });



        }
        catch(err) {
          console.log('err is', err);
        }
  }
  onFriendChosenForChat(friend) {
    this.router.navigate(['/chat', friend]);
  }

  // funtion for search typing
  onType(value: string) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.loader = true;
    this.timer = setTimeout(() => {
      this.searchResult = [];
      this.err = null;
      this.requestService.searchPeople(value).subscribe({
  next: values => {
    if (values.length > 0) {
      this.searchResult.push(...values);
    } else {
      this.err = `no result for ${value}`;
    }
  },
  error: err => {
    this.err = "request not sent";
    this.loader = false;
  },
  complete: () => {
    this.loader = false;
  }
      });
    }, 600);
  }

  // map friends
  friendsMapping(value): boolean {
    const index = this.userService.userState.friends
    .findIndex(friend => friend === value);
    if (index !== -1) {
      return false;
    }
    return true;
  }

  // send friend request

  onAddRequest(receiver) {
    this.requestService.sendRequest(receiver).subscribe({
      next: value => {
  console.log(value);
  if (!value['sent']) {
    this.err = `request already sent to ${receiver}`;
    return;
  }
  this.err = 'request sent successfully';
      },
      error: err => {
  this.err = `request not sent to ${receiver}`;
      }
    });
  }

  // accept friend request
  onAcceptRequest(requester, index) {
    console.log(requester);
    this.requestService.acceptRequest(requester).subscribe({
      next: value => {
  console.log(value);
  this.userService._userState.requests.splice(index, 1);
  this.state.requests.splice(index, 1);
      },
      error: err => {
  console.log(err);
      }
    })
  }

}
