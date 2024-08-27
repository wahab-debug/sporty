import { Component, DoCheck } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements DoCheck {
  isLoggedin = false;
  isAdmin = false;
  constructor(private service: AuthService, private router: Router){
    this.isLoggedin = !!this.service.isLoggedIn();
  }
  toggleAuth(){
    if(this.isLoggedin){
      sessionStorage.removeItem('registration_no');
      sessionStorage.removeItem('role');
      this.isLoggedin = false;
      this.router.navigate(['/login']);
    }else{
      this.router.navigate(['/login']);
    }
  }
  ngDoCheck(): void {
   if(this.service.getUserRole()==='Admin'){
    this.isAdmin=true;
   }
   else{
    this.isAdmin=false
   }
  }

}
