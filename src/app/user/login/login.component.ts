import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router) { }
  loginForm: FormGroup;
  err: string;
  ngOnInit() {
    this.loginForm = this.fb.group({
      username: this.fb.control(null, [Validators.required, Validators.minLength(4), Validators.maxLength(12)]),
      password: this.fb.control(null, [Validators.required])
    });
  }
  onSubmit() {
    this.userService.loginUser(this.loginForm.value).subscribe({
      next: value => {
        this.userService.token = value.token;
        console.log('user login successfully');
        this.router.navigate(['/chat', 'list']);
      },
      error: err => {
        console.log(err);
        this.err = err;
      }
    });
  }

}
