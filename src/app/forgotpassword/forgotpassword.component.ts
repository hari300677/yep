import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

//for Dialog
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {

  constructor(private toast: ToastrService
    , public dialogRef: MatDialogRef<ForgotpasswordComponent>
  ) { }

  ngOnInit() {
  }

  closeDialog(form: NgForm): void {
    this.dialogRef.close('closed');
  }

  saveData(): void {
    console.log('function called')
  }
}




