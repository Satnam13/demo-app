import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './others/home/home.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { ChatMainComponent } from './chat/chat-main/chat-main.component';
import { ChattingComponent } from './chat/chatting/chatting.component';
import { ChatListComponent } from './chat/chat-list/chat-list.component';


const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'user', children: [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent}
  ]},
  {path: 'chat', component: ChatMainComponent,
   children: [
    {path: 'list', component: ChatListComponent},
    {path: ':friend', component: ChattingComponent}
  ]},
  {path: '**', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
