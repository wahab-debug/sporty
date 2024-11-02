import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn:'root'
})
export class AuthGuard implements CanActivate{
  constructor(private router: Router, private toastr: ToastrService, private service: AuthService){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult>
   {
    const rolePermissions = {
      Admin: ['dashboard', 'add-teams', 'manage-users','userlist','addsession','offergames','addsport','appgames','teams'], // Add more admin permissions as needed
      Mod: ['dashboard', 'add-teams'],
      Captain: ['dashboard','enroll-team'], // Define permissions for Captain
      User: ['dashboard','enroll-team'] // Define permissions for User
    };
      //this is latest access control code that check rolePermission variable
      if (this.service.isLoggedIn()) {
        const userRole = this.service.getUserRole();
        const menu = route.url[0].path;
        //const menu = route.url.map(segment => segment.path).join('/'); // e.g., "teams/team-player"

      
        // Check if the user role is defined in permissions
        if (rolePermissions[userRole]) {
          if (rolePermissions[userRole].includes(menu)) {
            return true; // Allow access
          } else {
            this.toastr.warning("No access");
            this.router.navigate(['']);
            return false; // Deny access
          }
        } else {
          this.toastr.warning("Invalid role");
          this.router.navigate(['']);
          return false; // Handle invalid role
        }
      } else {
        this.router.navigate(['login']);
        return false; // User not logged in
      }



    //this is also not fully working code
        // if(this.service.isLoggedIn()){
        //   const userRole = this.service.getUserRole();
        //   const menu = route.url[0].path;
        //     if (userRole === 'Admin') {
        //       return true;
        //     } else if (menu == 'dashboard' || menu == 'add-teams' && userRole === 'Mod') {
        //       return true;
        //     } else {
        //       this.toastr.warning("No access");
        //       this.router.navigate(['']);
        //       return false;
        //     }
        // }else{
        //   this.router.navigate(['login'])
        //   return false
        // }



        //this is intitial level code with admin/user access control

      // if(this.service.isLoggedIn()){
      //   if(route.url.length>0){
      //     let menu = route.url[0].path;
      //     if(menu=='userlist'||'addsport'||'addsession'){
      //       if(this.service.getUserRole()=='Admin'){
      //           return true;
      //       }else{
      //         this.toastr.warning("No access");
      //         this.router.navigate(['']);
      //         return false;
      //       }
      //     }else{
      //       return true;
      //     }
      //   }else{
      //     return true;
      //   }

      // }else{
      //   this.router.navigate(['login']);
      //   return false;
      // }
      // if(this.service.isLoggedIn()){
      //   return true;  
      // }  else{
      //   this.router.navigate(['login']);
      //   return false;
      // }
  }


}
