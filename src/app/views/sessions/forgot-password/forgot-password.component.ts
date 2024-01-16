import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '@app/data/service/user.service';
import { JwtAuthService } from '@app/shared/services/auth/jwt-auth.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  userEmail;
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;
  constructor(
    private userService: UserService,
    private snack: MatSnackBar,
    public jwtAuth: JwtAuthService
  ) { }
  forgotPasswordForm: FormGroup;
  errorMsg='';

  ngOnInit() {


    const email = new FormControl('', 
    [
      Validators.required,
      Validators.email,
      Validators.maxLength(50),
    ]);
    
    

    this.forgotPasswordForm = new FormGroup({
      email: email
    });


  }
  sendPasswordCode() {
    

    // this.submitButton.disabled = true;
     this.progressBar.mode = 'indeterminate';
    
    this.userService.sendResetPasswordCode(this.forgotPasswordForm.value)
    .subscribe(response => {
      //this.router.navigateByUrl(this.jwtAuth.return);
        if (response.stateCode === 200){
          this.snack.open(response.messageError[0], 'OK',{ duration: 4000 });
          this.jwtAuth.signout();
        }else{
          this.snack.open(response.messageError[0], 'OK',{ duration: 4000 });
        }
      
      this.progressBar.mode = 'determinate';
      this.submitButton.disabled = false;
      
    }, err => {
      
      this.submitButton.disabled = false;
      this.progressBar.mode = 'determinate';
      this.errorMsg = err.message;
      
      
    })
  }
}
