import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { ChatMainComponent } from './chat/chat-main/chat-main.component';
import { ChatSidebarComponent } from './chat/chat-sidebar/chat-sidebar.component';
import { ChatListComponent } from './chat/chat-list/chat-list.component';
import { ChatInputComponent } from './chat/chat-input/chat-input.component';
import { ChattingComponent } from './chat/chatting/chatting.component';
import { NavbarComponent } from './views/navbar/navbar.component';
import { FooterComponent } from './views/footer/footer.component';
import { HomeComponent } from './others/home/home.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScrollDirective } from './scroll.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ChatMainComponent,
    ChatSidebarComponent,
    ChatListComponent,
    ChatInputComponent,
    ChattingComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    ScrollDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, ReactiveFormsModule, HttpClientModule, FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
