import { Component, OnInit, HostListener } from '@angular/core';
import { Observable, of as ObservableOf, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { RegisterComponent } from '../register/register.component';
import { ForgotpasswordComponent } from '../forgotpassword/forgotpassword.component';
import { RegisterService } from 'src/app/shared/services/register.service'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  screenHeight: any;
  screenWidth: any;
  usrname: string;
  usrpasswd: string

  constructor(private dialog: MatDialog, private router: Router, private registerservice: RegisterService, private toastr: ToastrService) {
    this.getScreenSize();
  }

  ngOnInit() {
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;

  }

  openRegisterDialog(): void {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '95%';
    if (this.screenWidth > 768) {
      dialogConfig.width = '45%';
    }
    else if (this.screenWidth > 500 && this.screenWidth < 768) {
      dialogConfig.width = '70%';
    }
    else if (this.screenWidth < 500) {
      dialogConfig.width = '95%';
    }

    dialogConfig.panelClass = 'register-panel';
    const dialogRef = this.dialog.open(RegisterComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  openForgotPasswordDialog(): void {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '45%';
    if (this.screenWidth > 768) {
      dialogConfig.width = '45%';
    }
    else if (this.screenWidth > 500 && this.screenWidth < 768) {
      dialogConfig.width = '70%';
    }
    else if (this.screenWidth < 500) {
      dialogConfig.width = '90%';
    }

    const dialogRef = this.dialog.open(ForgotpasswordComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  checkLogin(username: string, passwd: string) {
    if ((username != '' && username != null && username != undefined) && (passwd != '' && passwd != null && passwd != undefined)) {
      this.registerservice.checkLogin(username, passwd).subscribe(res => {
        if (res.toString() == 'success') {
          this.toastr.success('Login Successful', 'Login');
        }
        else {
          this.toastr.error('Invalid Credentials', 'Login')
        }
      })
    }
    else {
      this.toastr.error('Invalid Credentials', 'Login')
    }
  }

}
