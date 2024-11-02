import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../service/auth.service';
import { User } from '../../../model/user.model';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit{
  constructor(private router: ActivatedRoute, private toastr: ToastrService, private service: AuthService){}
  ngOnInit(): void {
   this.loadForm();
  }
  userDetail: User = {
        id:0,
        name: '',
        registration_no: '',
        password: '',
        role: ''
    
  }
  onSubmit(){
    this.service.updateData(this.userDetail.registration_no,this.userDetail).subscribe({
      next:res=>{
        this.toastr.success("updated successfully");
      },
      error:err=>{
        this.toastr.warning("Error updating user");
      }
    })
    
  }
  loadForm(){
    this.router.paramMap.subscribe({
      next: (res)=>{
        const id = res.get('registration_no');                
        if(id){
          this.service.getById(id).subscribe({
            next: (response)=>{
              this.userDetail = response as User;
            }
          })
        }
      }
    })
  }
}
