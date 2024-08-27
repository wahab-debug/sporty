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
    
      if(this.service.isLoggedIn()){
        if(route.url.length>0){
          let menu = route.url[0].path;
          if(menu=='userlist'||'addsport'||'addsession'){
            if(this.service.getUserRole()=='Admin'){
                return true;
            }else{
              this.toastr.warning("No access");
              this.router.navigate(['']);
              return false;
            }
          }else{
            return true;
          }
        }else{
          return true;
        }

      }else{
        this.router.navigate(['login']);
        return false;
      }
      if(this.service.isLoggedIn()){
        return true;  
      }  else{
        this.router.navigate(['login']);
        return false;
      }
  }


}
