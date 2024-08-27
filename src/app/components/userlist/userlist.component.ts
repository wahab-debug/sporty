import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user.model';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrl: './userlist.component.css'
})
export class UserlistComponent implements OnInit{

  userList : User []= []
  constructor(private service: AuthService){

  }
  ngOnInit(): void {
    this.onReq();
  }
  
 
  onReq(){
    this.service.getAllUsers()
    .subscribe(
      {
        next: res=>
        {
          this.userList = res as User[];
        },
        error: err=>
          {
            console.log(err);
            
          }
      }
    );    
  }

}

