import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Register } from 'src/app/shared/class/register.model'
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  formData: Register;
  data: any;
  os_token: string;

  constructor(private http: HttpClient, private toast: ToastrService) {
  }

  saveUser(form: Register) {
    this.data = JSON.stringify(form);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let options = {
      headers: headers
    }

    return this.http.post("api/users/create", this.data, options);
  }

  getOStoken() {
    let authURL = "/osapi/identity/v3/auth/tokens";
    let body = {
      "auth": {
        "identity": {
          "methods": [
            "password"
          ],
          "password": {
            "user": {
              "id": "a70a6c0967204692b752cec1b9b83651",
              "password": "secret"
            }
          }
        },
        "scope": {
          "project": {
            "id": "269b0053fe624dfab1f0203be0be83be"
          }
        }
      }
    }

    let bodystring = JSON.stringify(body);
    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
      'Content-Type': 'application/json',
      'Accept': 'application/json',

    });
    let options = {
      headers: headers,
      observe: 'response' as 'response'
    };
    return this.http.post(authURL, bodystring, options);
  }

  updateRole(os_token: string, user_id: string) {

    let authUrl = "osapi/identity/v3/projects/cc905a7c3a0145fc955c6e95a5773617/users/" + user_id + "/roles/ed8f56a54bd847f88e2eb3d3d8a9dbf9"

    //console.log(authUrl);
    //console.log(os_token);

    // to authenticate the token
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Auth-Token': os_token
    });

    let options = {
      headers: headers,
      observe: 'response' as 'response'
    };
    return this.http.put(authUrl, null, options)
  }
  saveUserDetailsToOS(os_token: string, user_name: string, passwd: string, email: string) {

    let authURL = "/osapi/identity/v3/users";

    // to authenticate the token
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Auth-Token': os_token
    });
    let body = {
      "user": {
        "name": user_name,
        "password": passwd,
        "email": email,
        "project_name": "y-project-commercial",
        "role_name": "y_role_commercial"
      }
    }
    let bodystring = JSON.stringify(body);
    let options = {
      headers: headers,
      observe: 'response' as 'response'
    };
    // console.log(bodystring);

    return this.http.post(authURL, bodystring, options);
  }

  getUserDetails() {
    return this.http.get("/api/users/get").pipe(
      map(res => res));

  }

  checkEmail(email: string) {



    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let options = {
      headers: headers
    }
    let body = {
      "email": email
    }

    return this.http.post("api/users/checkemail", JSON.stringify(body), options);
  }

  checkUser(username: string) {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let options = {
      headers: headers
    }
    let body = {
      "user": username
    }

    return this.http.post("api/users/checkuser", JSON.stringify(body), options);
  }

  checkMobileNumber(mobilenumber: string) {

    //console.log(this.data);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let options = {
      headers: headers
    }
    let body = {
      "mobile_number": mobilenumber
    }

    return this.http.post("api/users/checkmobile", JSON.stringify(body), options);
  }


  checkLogin(username: string, password: string) {

    //console.log(this.data);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let options = {
      headers: headers
    }
    let body = {
      "user": username,
      "passwd": password
    }

    // console.log(JSON.stringify(body));
    return this.http.post("api/users/checklogin", JSON.stringify(body), options);
  }


  sendmail(username: string, email: string) {

    //console.log(this.data);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    let options = {
      headers: headers
    }
    let body = {
      "name": username,
      "email": email
    }

    return this.http.post("api/users/sendmail", JSON.stringify(body), options);
  }


  getCountrydetails() {
    return this.http.get("api/country/getcountry");
  }

  sendSMS(toMobileNumber: string, username: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-profile-secret': 'zjh6d6vrng3EsZ31fMskiSaa'
    });

    let options = {
      headers: headers
    }



    let message = "Hi " + username + ",This is a message from yoota. Thank you for registering with us. Below is the Server Details and it its valid for 30 days "
    let body = {
      "from": "yooota",
      "to": toMobileNumber,
      "body": message
    }

    //console.log(JSON.stringify(body));
    return this.http.post("smsapi", JSON.stringify(body), options);
  }

  createServer(ostoken: string) {
    let authURL = "/osapi/compute/v2.1/servers";

    //this.getOStoken(); //GETTING THE OS TOKEN

    //headers
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Auth-Token': ostoken,
      'User-Agent': 'python-novaclient',
      'X-OpenStack-Nova-API-Version': '2.1'
    });

    let options = {
      headers: headers
    }

    let body =
    {
      "server": {
        "name": "yserver8",
        "imageRef": "0a297515-1f3e-4b78-bb66-d858824ad85e",
        "key_name": "t1",
        "flavorRef": "2",
        "max_count": 1,
        "min_count": 1,
        "security_groups": [{ "name": "30b15a98-7b29-4c7a-b1dc-eb9e015bbccd" }]
      }
    }


    //console.log(JSON.stringify(body));
    return this.http.post(authURL, JSON.stringify(body), options);

  }
}
