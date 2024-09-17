import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = environment.apiBaseUrl+'user/';
  constructor(private http: HttpClient) { }
  // view user list of application
  getAllUsers(){
    
    return this.http.get(this.url+'userlist');
  }
  //post data of login obj and return hardcoded status
  getById(inputData:any){
    return this.http.post(this.url+'loginstd', inputData);
  }
  //for video follow up
  getById2(id:any){
    return this.http.get(this.url+'/getById/'+id);
  }
  // add signup data
  registerData(inputData:any){
    return this.http.post(this.url+'postuser',inputData);
  }
  //not used yet
  updateData(id:any, inputData:any){
    return this.http.put(this.url+id, inputData);
  }
  //check whether user loggedin or not
  isLoggedIn(){

    return sessionStorage.getItem('registration_no')!=null;
  }
  //get user role
  getUserRole(){
    
    return sessionStorage.getItem('role')!=null?sessionStorage.getItem('role')?.toString():'';
  }

}
