import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginObj: Login;
  url = environment.apiBaseUrl;
  userData:any;
  
 
  
  constructor( private http: HttpClient, private router: Router, private toastr: ToastrService, private service: AuthService){
    this.loginObj = new Login();
    sessionStorage.clear();

  }

  ngOnInit(): void {
    
  }


  onLogin(){
    //youtube method
    this.service.getById2(this.loginObj.registration_no).subscribe(
      res=>{
        this.userData= res;
        
        if(this.userData.password===this.loginObj.password){
          sessionStorage.setItem('registration_no',this.userData.registration_no);
          sessionStorage.setItem('role',this.userData.role);
          this.router.navigate(['']);
        }
        else{
          this.toastr.warning("invalid username or password");
        }
      }
    );
    //my method
      // this.service.getById(this.loginObj)
      // .subscribe(
      // {
      //   next: res=>{
      //     this.userData = res;
      //     sessionStorage.setItem('registration_no',this.userData.registration_no);
      //     sessionStorage.setItem('role',this.userData.role);
      //     this.router.navigate(['']);
      //   },
      //   error:err=>{
      //     this.toastr.warning("invalid username or password");
      //   }        
      // }
      // );
  }

}


export class Login{
  registration_no: string;
  password: string;
  constructor(){
    this.registration_no = '';
    this.password = '';
  }
}
