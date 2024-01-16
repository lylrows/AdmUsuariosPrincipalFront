import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '@app/data/service/user.service';
import { JwtAuthService } from '@app/shared/services/auth/jwt-auth.service';
import { LocalStoreService } from '@app/shared/services/local-store.service';
import { CustomValidators } from 'ngx-custom-validators';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {



  changePasswordForm: FormGroup;
  errorMsg = '';
  APP_USER = "GRUPOFE_USER";
  constructor(
    private userService: UserService,
    private ls: LocalStoreService,
    private snack: MatSnackBar,
    public jwtAuth: JwtAuthService,
    private route: ActivatedRoute
  ) { }

  userid = 0;
  codereset ='';
  uservalid = false;
  codevalid =false;
  changewithcode = false;

  ngOnInit(): void {


    this.route.queryParams.subscribe((p: any) => {
      
      if (p.user){
        this.userid  =  p.user;
      }
      if (p.tokenresetpassword){
        this.codereset = p.tokenresetpassword;
      }
      });

    if  (this.userid !== undefined && this.userid !== null && this.userid !== 0){
      this.uservalid =true ;
    }
    if  (this.codereset !== undefined && this.codereset !== null){
      this.codevalid =true ;
    }
    if ( this.codevalid && this.uservalid){
      this.changewithcode = true;
    }

    if (this.changewithcode == true){

      this.userService.getValidRessetPassword( this.userid,this.codereset).subscribe(
        (data) => {
  
          if (data !== null && data !== undefined){

            if ( data.stateCode !== 200){
              this.snack.open("Código inválido", 'OK',{ duration: 4000 });
              this.jwtAuth.signout();  
            }
          }else{
            this.snack.open("Código inválido", 'OK',{ duration: 4000 });
            this.jwtAuth.signout();
          }
        },
        (err) => {},
        () => {
          //this.load();
        }
      );
    }


    const password = new FormControl('', 
    [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(12),
    ]);
    const confirmPassword = new FormControl('', CustomValidators.equalTo(password));
    const coderesetcontrol =  new FormControl(this.codereset);



    const iduser = new FormControl(0 );


    this.changePasswordForm = new FormGroup({
      passwordWithoutEncryption: password,
      passwordConfirm: confirmPassword,
      id: iduser,
      codeBase64Url:coderesetcontrol
    });
  }


  changePassword():void{


    if (this.changewithcode){
      this.changePasswordForm.get('id').setValue( parseInt(this.userid.toString() ));
    }else{
      this.changePasswordForm.get('id').setValue(  this.getUser().id );
    }

    this.userService.resetpasswordPatch(this.changePasswordForm.value).subscribe(
      (data) => {
    
        if (data !== null && data !== undefined){
          
          if ( data.stateCode === 200){
            this.snack.open("Se cambió la contraseña correctamente", 'OK',{ duration: 4000 });
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
  getUser() {
    return this.ls.getItem(this.APP_USER);
  }

}
