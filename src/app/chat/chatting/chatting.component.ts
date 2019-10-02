import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatInitService } from 'src/app/services/chat-init.service';
import { FriendsService } from 'src/app/services/friends.service';
import { UserService } from 'src/app/services/user.service';
import { FriendModel } from 'src/app/models/friend.model';
import { ChatModel } from 'src/app/models/chat.model';
import { ChatService } from 'src/app/services/chat.service';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-chatting',
  templateUrl: './chatting.component.html',
  styleUrls: ['./chatting.component.css']
})
export class ChattingComponent implements OnInit {

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private initialize: ChatInitService,
    private friendService: FriendsService,
    private chatService: ChatService) { }
  friend: FriendModel = {
    isOnline: 'offline',
  };
  chats = [];
  username;
  date = '';
  previousFriend = '';
  ngOnInit() {
    this.initializeChats();
    console.log('inbox init');
  }
  initializeChats() {
    this.chatService.readyState.pipe(take(1)).subscribe({
      next: (value) => {
        this.username = this.userService.userState.username;
        this.route.paramMap.subscribe({
          next: (values) => {
            this.friend.username = values.get('friend');
            if (this.friend.username == this.previousFriend) {
              return;
            }
            console.log('updating chat as user changed');
            this.previousFriend = this.friend.username.slice();
            this.friend.isOnline = 'offline';
            this.chatService.friendStatusChange.subscribe({
              next: status => {
                if (status.username === this.friend.username) {
                  console.log(status);

                  this.friend.isOnline = status.type;
                }
              }
            });
            this.initialize.initializeChats(this.username, this.friend.username, 0)
            .subscribe({
              next: value => {
                this.chats = (value as Array<ChatModel>).reverse();
                let tempDate = '';
                this.chats.forEach((chat: ChatModel) => {
                  if ((<string>chat['stamp']).substr(0, 10) !== tempDate) {
                    tempDate = (<string>chat['stamp']).substr(0, 10);
                    chat.isNewDate = true;
                  }
                });
                const chatsDom = document.querySelector('.chats');
                chatsDom.scrollTo(0, chatsDom.scrollHeight);
              },
              error: err => console.log(err)
            });
            const index = this.friendService.friends.findIndex(friend => friend.username === this.friend.username);
            if (index !== -1) {
              this.friend = Object.assign({}, this.friendService.friends[index], {isOnline: true});
            }
          }
        });
      }
    });
    this.chatService.getReadyState();

  }
  getOlderChats() {
    console.log('getting mr');
    console.log(this.chats.length);

    this.initialize.initializeChats(this.username, this.friend.username, this.chats.length)
      .subscribe({
        next: value => {
          if ((value as Array<ChatModel>).length > 0) {
            const chatArray = (value as Array<ChatModel>).reverse();
            this.chats.unshift(...chatArray);
          }
        }
      });
  }
  onNewMessage(event) {
    document.querySelector('.chats').scrollTo(0, document.querySelector('.chats').scrollHeight);
    console.log('scroll', document.querySelector('.chats').scrollHeight + 300);

    this.chats.push(event);
  }

}
