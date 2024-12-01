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
  //class of login type is created at the end of this file
  loginObj: Login;
  //form data is being captured in this
  userData:any;
  
 
  //when const is called user will be logged out & new Login object is created
  constructor( private http: HttpClient, private router: Router, private toastr: ToastrService, private service: AuthService){
    this.loginObj = new Login();
    sessionStorage.clear();

  }
  //no code executed in this yet
  ngOnInit(): void {
    
  }


  onLogin(){
    
    //youtube method, send reg no verify credentials
    this.service.getById(this.loginObj.registration_no).subscribe(
      {
        next:(res)=>
          {
            //assigned returned user as result to userData
            this.userData= res;
        
          if(this.userData.password===this.loginObj.password){
            //if user is authenticated session is created based on role and reg no and redireted to dashboard
            sessionStorage.setItem('registration_no',this.userData.registration_no);
            sessionStorage.setItem('role',this.userData.role);
            sessionStorage.setItem('id',this.userData.id);
            if(this.userData.role == 'Admin' || this.userData.role == 'Mod'){
               //create initital route and redirect to it
                this.router.navigate(['']).then(()=>{
                  location.reload();
                });
            }
            else if(this.userData.role=='Captain'){
                //create initital route and redirect to it
                this.router.navigate(['my-team']).then(()=>{
                  location.reload();
                });
            }
            else if(this.userData.role=='User'){
              //create initital route and redirect to it
              this.router.navigate(['allsports']).then(()=>{
                location.reload();
              });
          }
            
           
          }
          else{
            this.toastr.warning("invalid username or password");
          }
          
          },
        error:(err)=>
          {
                    this.toastr.error("Network error, could not connect to server. Please try again later. ");
          }
      }
    );
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
