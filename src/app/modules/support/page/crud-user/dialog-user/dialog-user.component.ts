import { Empresa } from './../../../../../data/schema/empresa';
import { EmpresaService } from '@app/data/service/empresa.service';
import { egretAnimations } from './../../../../../shared/animations/egret-animations';
import { UserService } from "./../../../../../data/service/user.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Component, OnInit, Inject, ElementRef, ViewChild } from "@angular/core";
import { UserRequest } from "app/data/schema/user/UserRequest";
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@env';
import { Food } from '../../contact/dialog-contact/dialog-contact.component';
import { CustomValidators } from 'ngx-custom-validators';
import { Profile } from '@app/data/schema/user/Profile';

@Component({
  selector: "app-dialog-user",
  templateUrl: "dialog-user.component.html",
  styleUrls: ['dialog-user.component.scss'],
  animations: egretAnimations,
})
export class DialogUserComponent implements OnInit {
  public itemForm: FormGroup;
  public idUser: number;
  public progress: number;
  public message: string;
  selectedFile: any;
  displayFileName = '';
  profile: Profile[];
  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

  @ViewChild('fileInput')
  fileInput: ElementRef;
  imageURL ='';
  archivoCapturado:any;
  contrasenias_iguales: boolean= true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogUserComponent>,
    private sanitizer: DomSanitizer,
    private snack: MatSnackBar,
    private fb: FormBuilder,
    private userService: UserService,
  ) {
    this.idUser = 0;
  }

  ngOnInit() {
    this.buildItemForm(this.data.payload);
    this.load();
  }

  buildItemForm(item) {
    this.imageURL= item.photo;

    let password;
    let confirmPassword;

    if (item.id== 0){
      password = new FormControl(null, [Validators.required]);
      confirmPassword = new FormControl('', CustomValidators.equalTo(password));
    }
    else{
      password = new FormControl('');
      confirmPassword = new FormControl('');
    }
    this.idUser = item.id || 0;
    this.itemForm = this.fb.group({
      firstName: [item.firstName || null, [Validators.required]],
      secondName: [item.secondName || null],
      lastName: [item.lastName || "", [Validators.required]],
      motherLastName: [item.motherLastName || "", Validators.required],
      phone: [item.phone || null,[Validators.required,Validators.pattern('[0-9]*'), Validators.minLength(9), Validators.maxLength(9)]], //[Validators.pattern(/^[0-9]\d*$/), Validators.minLength(9), Validators.maxLength(9)]
      // email: [item.email || null,[Validators.required,Validators.email]],
      // email: [item.email || null,[Validators.required,Validators.pattern(' ^[a-z]+[a-z0-9._-]+@[a-z]+\.[a-z.]{2,5}$')]],
      email: [item.email || null,[Validators.required, Validators.pattern('[a-zA-Z0-9-._ñÑáéíóúÁÉÍÓÚ@, ]*')]],
      userName: [item.userName || "", [Validators.required,Validators.pattern('[a-zA-Z0-9 ]*')]],
      passwordwithoutencryption: password,
      passwordconfirm: confirmPassword,
      active: [item.active == undefined ? true : item.active],
      photo_url: [item.photo || ""],
      idProfile:[item.idProfile || null, [Validators.required]],
      idPerson: [item.idPerson || 0],
      id: [item.id || 0],
    });
  }
  public findInvalidControls() {
    debugger;
    const invalid = [];
    const controls = this.itemForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
  }
  submit(files) {
    debugger;
    if (this.itemForm.controls['passwordwithoutencryption'].value !== this.itemForm.controls['passwordconfirm'].value) {
      return;
    }
    const formData = new FormData();
    for (let file of files){
      formData.append(file.name, file);
    }
    formData.append('data', JSON.stringify(this.itemForm.value));
    this.dialogRef.close(formData);
  }

  load() {
    this.loadProfile();
  }

  validContrasenias() {
    this.contrasenias_iguales = true;
    if (this.itemForm.controls['passwordwithoutencryption'].value==="" && this.itemForm.controls['passwordconfirm'].value==="") {
    }
    else {
      if (this.itemForm.controls['passwordwithoutencryption'].value === this.itemForm.controls['passwordconfirm'].value) {
        this.contrasenias_iguales = true;
      }else{
        this.contrasenias_iguales = false;
      }
    }
  }

  lettersOnly(event) {
    if (event.charCode > 32 && event.charCode < 65 || event.charCode > 90 && event.charCode < 97 || event.charCode > 122) return false;
  }

  NumbersOnly(event) {
    if (!(event.charCode > 32 && event.charCode < 65 || event.charCode > 90 && event.charCode < 97 || event.charCode > 122)) {
      return false;
    }
  }

  onFileChanged(event) {
    if (event.target.files.length === 0) {
      return;
    } 
    
    this.selectedFile = event.target.files[0];
    const nombreArchivo = this.selectedFile.name;

    this.displayFileName = "<span>" + nombreArchivo + "</span>";
    
    if (parseInt((event.target.files[0].size / 1024 / 1024).toFixed(1)) > environment.MaxFileSizeMB) {
      this.selectedFile = "";
      this.displayFileName = "";
      this.snack.open('El tamaño máximo permitido es: ' + environment.MaxFileSizeMB + "MB", 'OK',{ duration: 4000 });

      return;
    }
    this.archivoCapturado=event.target.files[0];
    this.blobFile(this.archivoCapturado).then((res: any) => {
      this.imageURL = res.base;

    });
  }

  blobFile = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          blob: $event,
          image,
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          blob: $event,
          image,
          base: null
        });
      };

    } catch (e) {
      return null;
    }
  })

  deletefile() {
    this.selectedFile = "";
    this.displayFileName = "";
    this.fileInput.nativeElement.value = "";
    this.imageURL="";
    return false;
  }

  loadProfile() {
    this.userService.getProfileList().subscribe((res) =>{ 
      this.profile = res.data;
    });
  }
}
