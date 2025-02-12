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
      Admin: ['dashboard', 'add-teams', 'manage-users','userlist','addsession','offergames','addsport','appgames','teams','rules','sessionsummary'], // Add more admin permissions as needed
      Mod: ['dashboard', 'add-teams','teams','mod-rules','schedules','scoring'],
      Captain: ['dashboard','enroll-team','my-team'], // Define permissions for Captain
      User: ['dashboard','enroll-team','my-team'] // Define permissions for User
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

  }


}
