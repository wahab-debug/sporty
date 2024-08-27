import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {


  signupObj: Signup;

  constructor(private router: Router, private toastr: ToastrService, private service: AuthService){
    this.signupObj = new Signup();
  }


  onSignup(){
    this.service.registerData(this.signupObj)
    .subscribe(
      {
        next: res=>
        {          
          this.toastr.success("Contact chairperson for approval");
          this.router.navigateByUrl('dashboard');
        },
        
        error: err=>
        {
          this.toastr.warning(err.message)
        }
      }
    );
  }

}

export class Signup{
  name: string;
  registration_no: string;
  password: string;
  role: string;
  constructor(){
    this.name = '';
    this.registration_no = '';
    this.password = '';
    this.role = 'User';
  }
}