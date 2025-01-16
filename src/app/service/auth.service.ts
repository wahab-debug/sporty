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
  //view event managers list of curent session
  getEventManagers(){
    return this.http.get(this.url+'getEventManagers');
  }
  HandleUser(userId){
    return this.http.get(this.url+'HandleUser?userId='+userId);
  }
  //work base on registration number and return user
  getById(id:any){
    return this.http.get(this.url+'getById/'+id);
  }
  // add signup data
  registerData(inputData:any){
    return this.http.post(this.url+'postuser',inputData);
  }
  //update user based on reg number
  updateData(id:any, inputData:any){
    return this.http.post(this.url+'updateUser/'+id, inputData);
  }
  //delete user based on reg number
  removeData(id:any){
    return this.http.delete(this.url+'deleteUser/'+id);
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
