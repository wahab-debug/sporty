import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user.model';
import { AuthService } from '../../service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrl: './userlist.component.css'
})
export class UserlistComponent implements OnInit{

  userList : User []= []
  constructor(private service: AuthService, private toastr: ToastrService){

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
  removeUser(id:any){
    if(confirm("Are you sure?")){
      this.service.removeData(id).subscribe({
        next:res=>{
          this.toastr.success("deleted");
        },
        error:err=>{
          this.toastr.warning(err.message)
        }
      })
    }
    
  }

}

