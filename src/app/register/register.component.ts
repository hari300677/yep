import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RegisterService } from 'src/app/shared/services/register.service';
import { Register } from 'src/app/shared/class/register.model'
import { HostListener } from '@angular/core';
import { Observable, of as ObservableOf, merge } from 'rxjs';
//for Dialovice
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material'
import { NullTemplateVisitor } from '@angular/compiler';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private toast: ToastrService
    , public dialogRef: MatDialogRef<RegisterComponent>,
    private registerservice: RegisterService, private http: HttpClient
  ) { }

  checkpasswd: boolean;
  cnfpasswd: string;
  passwderr: string;
  mnumerr: string;
  emailerr: string;
  usererr: string;
  os_token: string;
  os_user_create_status: string;
  os_user_id: string;
  selectedCountryId: string;
  selectedCountry: string;
  selectedCountryCode: string;
  countryData: any;

  ngOnInit() {
    this.resetForm();
    this.getCountryData();

  }

  getCountryData() {
    this.registerservice.getCountrydetails().subscribe(res => {
      this.countryData = res;
      console.log(this.countryData);
    })
  }

  getSelectedCountry() {

    this.selectedCountry = this.countryData[Number(this.selectedCountryId) - 1].country;
    this.selectedCountryCode = this.countryData[Number(this.selectedCountryId) - 1].countrycode;
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();

    this.registerservice.formData = {
      country: null,
      login_user_name: null,
      login_user_password: null,
      first_name: null,
      last_name: null,
      email: null,
      created_by: 'dbo',
      created_dt: null,
      modified_dt: null,
      modified_by: 'dbo',
      mobile_number: null,
      os_user_id: null,
      os_user_project: null,
      user_status: 'active'
    }

  }
  closeDialog(form: NgForm): void {
    this.dialogRef.close('closed');
  }

  saveData(form: NgForm): void {

    // Step 1 : Get the Token
    this.registerservice.getOStoken().subscribe((res: any) => {
      this.os_token = res.headers.get('X-Subject-Token');
      if (this.os_token != '') {
        //Step 2 : Create Users on Open Stack
        this.registerservice.saveUserDetailsToOS(this.os_token, this.registerservice.formData.login_user_name,
          this.registerservice.formData.login_user_password,
          this.registerservice.formData.email).subscribe((resp: any) => {
            this.os_user_create_status = resp.headers.get('statusText'); // Getting the Status
            let respbody = JSON.parse(JSON.stringify(resp.body));
            this.registerservice.formData.os_user_id = respbody.user.id; //getting user id
            this.registerservice.formData.os_user_project = respbody.user.domain_id; //getting domain id

            //Update Role
            this.registerservice.updateRole(this.os_token, this.registerservice.formData.os_user_id).subscribe((res: any) => {
              //Appending Phone Number Code with Phoen Number
              this.registerservice.formData.country = this.selectedCountry;
              this.registerservice.formData.mobile_number = this.selectedCountryCode + this.registerservice.formData.mobile_number;
              //Saving to MYSQL

              this.registerservice.saveUser(this.registerservice.formData).subscribe((res: any) => {
                this.toast.success('User Registered Succesfully', 'User Registration')
                this.dialogRef.close('closed');

                //Creating Server
                this.registerservice.createServer(this.os_token).subscribe(res => {
                  console.log(res);
                })
                //Send SMS
                this.registerservice.sendSMS(this.selectedCountryCode + this.registerservice.formData.mobile_number, this.registerservice.formData.first_name).subscribe(res => {
                  //console.log(res);
                });

                //Sending email
                this.registerservice.sendmail(this.registerservice.formData.first_name, this.registerservice.formData.email).subscribe(res => {
                  //console.log(res);
                });
              }, error => {
                this.toast.error('Error Occured While Register User.Please Contact Administrator!', 'Register');

              });
            }, error => {
              this.toast.error('Error Occured While Register User.Please Contact Administrator!', 'Register');
            });
          }, error => {
            this.toast.error('Error Occured While Register User.Please Contact Administrator!', 'Register');

          })
      }
    }, error => {
      this.toast.error('Error Occured While Register User.Please Contact Administrator!', 'Register');

    })
    { }

    // Step 2 : Register it in Open Stack

    // Step 3 : If we got the reponse as created, then save it in our mysql with userid

    /*  this.registerservice.saveUser(this.registerservice.formData).subscribe((res: any) => {
        this.toast.success('User Registered Succesfully', 'User Registration')
        this.dialogRef.close('closed');
      }, error => {
        this.toast.error('Error Occured While Register User.Please Contact Administrator!', 'Register');
  
      });*/
  }

  checkpassword(form: NgForm, cnfpassword: string) {
    if (this.registerservice.formData.login_user_password == cnfpassword) {
      this.checkpasswd = true;
    }
    else {
      this.checkpasswd = false;
      form.controls['cnfpassword'].setErrors({ 'incorrect': true });

      if (cnfpassword == '') {
        this.passwderr = 'Please Retype Password';
      }
      else {
        this.passwderr = 'Password do not match';
      }
    }

  }

  checkemail(form: NgForm, email: string) {
    this.emailerr = 'Please Enter a Valid E-Mail';
    if (email == '' || email == null) {

      form.controls['email'].setErrors({ 'incorrect': true });
    }
    else {
      this.registerservice.checkEmail(email).subscribe(res => {

        if (res.toString() == 'exists') {
          this.emailerr = 'E-Mail Already Exists';
          form.controls['email'].setErrors({ 'incorrect': true });
        }
      })
    }
  }

  checkmobilenumber(form: NgForm, mobilenumber: string) {
    this.mnumerr = 'Invalid Mobile Number';
    if (mobilenumber == '' || mobilenumber == null) {

      form.controls['mobile_number'].setErrors({ 'incorrect': true });
    }
    else {
      this.registerservice.checkMobileNumber(mobilenumber).subscribe(res => {

        if (res.toString() == 'exists') {
          this.mnumerr = 'Mobile Number Already Exists';
          form.controls['mobile_number'].setErrors({ 'incorrect': true });
        }
      })
    }
  }

  checkuser(form: NgForm, username: string) {
    if (username == '' || username == null) {
      this.usererr = 'Please Enter User Name';
      form.controls['login_user_name'].setErrors({ 'incorrect': true });
    }
    else {
      this.registerservice.checkUser(username).subscribe(res => {

        if (res.toString() == 'exists') {

          this.usererr = 'User Name Already Exists';
          form.controls['login_user_name'].setErrors({ 'incorrect': true });
        }
      })
    }
  }


}
