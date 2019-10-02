import { Component, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { Router} from '@angular/router';

import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  @ViewChild('firstBlock', {static: true})
  firstBlock: ElementRef;
  @ViewChild('secondBlock', {static: true})
  secondBlock: ElementRef;
  @ViewChild('firstCircle', {static: true})
  firstCircle: ElementRef;
  @ViewChild('secondCircle', {static: true})
  secondCircle: ElementRef;
  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private userService: UserService,
    private router: Router) { }
  registerForm: FormGroup;
  countries = [
    {name: 'India', value: 0},
    {name: 'England', value: 1},
    {name: 'USA', value: 2}
  ];
  ngOnInit() {
    this.registerForm = this.fb.group({
      username: this.fb.control(null, [Validators.required, Validators.minLength(4), Validators.maxLength(12)], this.asyncValidator.bind(this)),
      email: this.fb.control('', [Validators.required, Validators.email], this.asyncValidator.bind(this)),
      dob: this.fb.control('', Validators.required),
      passwordGroup: this.fb.group({
        password: this.fb.control('', Validators.required),
        confirmPassword: this.fb.control('', Validators.required),
      }, { validators: [this.matchPasswords] }),
      country: this.fb.control(0, Validators.required),
    });
  }
  onSubmit() {
    const user = Object.assign({}, this.registerForm.value);
    // const loginComp = this.componentFactory.resolveComponentFactory(LoginComponent);
    // //this.login.clear();
    // this.login.createComponent(loginComp);
    user.password = user.passwordGroup.password;
    delete user.passwordGroup;
    this.userService.registerUser(user).subscribe({
      next: value => {
        if (value) {
          this.router.navigate(['/user/login']);
        }
      },
      error: err => console.log(err)
    });
  }
  asyncValidator(control: AbstractControl) {
     return this.userService.userAsyncValidaor(control.value);
  }
  matchPasswords(control: AbstractControl): {[key: string]: boolean} | null {
    const password  = control.get('password');
    const confirmPassword  = control.get('confirmPassword');
    if (confirmPassword && confirmPassword.dirty && password && password.dirty) {

      if (password.value !== confirmPassword.value) {

        return {match: false};
      }
    }
    return null;
  }

  changeBlock(block) {
    if (block === 'first') {
    this.renderer.setStyle(this.firstBlock.nativeElement, 'display', 'none');
    this.renderer.removeClass(this.firstCircle.nativeElement, 'active-circle');
    this.renderer.setStyle(this.secondBlock.nativeElement, 'display', 'initial');
    this.renderer.addClass(this.secondCircle.nativeElement, 'active-circle');
    }
    else {
      this.renderer.setStyle(this.secondBlock.nativeElement, 'display', 'none');
      this.renderer.removeClass(this.secondCircle.nativeElement, 'active-circle');
      this.renderer.setStyle(this.firstBlock.nativeElement, 'display', 'initial');
      this.renderer.addClass(this.firstCircle.nativeElement, 'active-circle');
    }
    }

}
