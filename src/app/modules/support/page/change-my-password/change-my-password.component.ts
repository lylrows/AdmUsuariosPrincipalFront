import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '@app/data/service/user.service';
import { JwtAuthService } from '@app/shared/services/auth/jwt-auth.service';
import { LocalStoreService } from '@app/shared/services/local-store.service';
import { CustomValidators } from 'ngx-custom-validators';

@Component({
  selector: 'app-change-my-password',
  templateUrl: './change-my-password.component.html',
  styleUrls: ['./change-my-password.component.scss']
})
export class ChangeMyPasswordComponent implements OnInit {

  APP_USER = "GRUPOFE_USER";
  constructor(
    public dialogRef: MatDialogRef<ChangeMyPasswordComponent>,
    private fb: FormBuilder,
    private ls: LocalStoreService,
    private userService: UserService,
    public jwtAuth: JwtAuthService,
    private snack: MatSnackBar,
  ) { }
  public changePasswordForm: FormGroup;

  ngOnInit(): void {
    this.buildItemForm();
  }
  getUser() {
    return this.ls.getItem(this.APP_USER);
  }
  buildItemForm() {

    
    const niduser: number = parseInt(this.getUser().id);


    const oldpassword = new FormControl('', 
    [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(12),
    ]);


    const password = new FormControl('', 
    [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(12),
      Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{5,}")
    ]);
    const confirmPassword = new FormControl('', CustomValidators.equalTo(password));

    const iduser = new FormControl(niduser);


    this.changePasswordForm = new FormGroup({
      passwordWithoutEncryptionOld: oldpassword,
      passwordWithoutEncryption: password,
      passwordConfirm: confirmPassword,
      id: iduser
    });

 
  }

  changePassword():void{



    this.userService.changemypassword(this.changePasswordForm.value).subscribe(
      (data) => {
    
        if (data !== null && data !== undefined){
          
          if ( data.stateCode === 200){
            this.snack.open("Se cambió la contraseña correctamente", 'OK',{ duration: 4000 });
            this.dialogRef.close(false)
            this.jwtAuth.signout();  
          }else{
            this.snack.open(data.messageError[0], 'OK',{ duration: 4000 });
          }
        }else{
          this.snack.open("Ocurrió un error", 'OK',{ duration: 4000 });
        }

      },
      (err) => {},
      () => {
        //this.load();
      }
    );

  }

}
