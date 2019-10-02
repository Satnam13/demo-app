import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';
import { FriendsService } from 'src/app/services/friends.service';
import { UserModel } from 'src/app/models/user.model';
import { ChatModel } from 'src/app/models/chat.model';
import { FriendModel } from 'src/app/models/friend.model';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css']
})
export class ChatInputComponent implements OnInit {


  @Input('friend')
  friend: FriendModel;
  @Output('newMessage')
  newMessage: EventEmitter<any> = new EventEmitter<any>();
  inputMsg = '';
  constructor(private chatService: ChatService, private userService: UserService, private friendService: FriendsService) { }
  userData: UserModel = null;
  ngOnInit() {
    this.chatService.readyState.subscribe({
      next: () => {
        this.userData = this.userService.userState;
      }
    });
    this.chatService.incomingMessage.subscribe({
      next: value => {
        if (value.to == this.friend.username || value.to == this.userData.username) {
          this.newMessage.emit(value);
        }
      }
    })
    this.chatService.getReadyState();

  }

  onKeyUp() {
    console.log(this.friend.username);
    console.log(this.userData.username);


    if (!this.friend.socketId) {
      console.log('no socket');
      const index = this.friendService.friends.findIndex(friend => friend.username === this.friend.username);
      if (index !== -1) {
        this.friend.socketId = this.friendService.friends[index].socketId;
        this.friend.isOnline = 'online';
      }
    }
    const msgData: ChatModel = {
       from: this.userData.username,
       to: this.friend.username,
       message: this.inputMsg,
       socketId: this.friend.socketId ? this.friend.socketId : null
    }
    this.chatService.sendMessage(msgData);
    this.inputMsg = '';
  }

}
