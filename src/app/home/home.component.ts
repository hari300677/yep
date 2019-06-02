import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { RegisterComponent } from '../register/register.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  screenHeight: any;
  screenWidth: any;
  usrname: string;
  usrpasswd: string

  constructor(private dialog: MatDialog, private router: Router) {
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;

  }


  ngOnInit() {
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
    dialogConfig.panelClass = "register-panel";

    const dialogRef = this.dialog.open(RegisterComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
