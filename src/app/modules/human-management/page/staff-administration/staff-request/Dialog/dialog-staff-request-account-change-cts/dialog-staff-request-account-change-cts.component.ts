import { MatDatepicker } from "@angular/material/datepicker";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Component, OnInit, ViewChild, OnDestroy, Inject, ElementRef } from "@angular/core"
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatTable, MatTableModule } from "@angular/material/table";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { OthersModule } from "@app/views/others/others.module";
import { StaffRequestPermitService } from "@app/data/service/staff-request-permit.service";
import { environment } from "environments/environment.prod";
import { DomSanitizer } from "@angular/platform-browser";
import { StaffRequestJustificationTardinessService } from "@app/data/service/staff-request-justification-tardiness.service";
import { StaffRequestAccountChangeCtsService } from "@app/data/service/staff-request-account-change-cts.service";
import { PostulantFileService } from "@app/data/service/PostulantFileService";
import { EmployeeService } from "@app/data/service/employee.service";
import { StaffRequestApproverService } from "@app/data/service/staff-request-approver.service";

@Component({
  selector: "app-dialog-staff-request-account-change-cts",
  templateUrl: "dialog-staff-request-account-change-cts.component.html",
  styleUrls: ["./dialog-staff-request-account-change-cts.component.scss"],
})
export class DialogStaffRequestAccountChangeCtsComponent implements OnInit {
  public itemForm: FormGroup;
  @ViewChild(MatTable) tableApprover: MatTable<any>;
  @ViewChild('fileInput')
  fileInput: ElementRef;
  public progress: number;
  public message: string;
  imageURL ='';
  archivoCapturado:any;
  selectedFile: any;
  displayFileName = '';
  lstTypeCurrency: any[] = [];
  lstTypeDestinCurrencyCTS: any[] = [];
  lstTypeBanking: any[];
  lstTypeBankingDestin: any[];
  idTypeStaffRequest: number

  codeEmployee: string = '';
  dateAdmission: string = '';
  fullname: string = '';
  dni: string = '';
  area: string = '';
  charge: string = '';
  fileName = ''
  payload;
  showMessageCaja = false;
  
  allowed_banks=["BBVA","BCP","SBK","IBK"];
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogStaffRequestAccountChangeCtsComponent>,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private _serviceEmployee: EmployeeService,
    private staffRequestApproverService: StaffRequestApproverService,
    private staffRequestAccountChangeCtsService: StaffRequestAccountChangeCtsService,
    private staffRequestJustificationTradiness: StaffRequestJustificationTardinessService,
    private postulantFileService: PostulantFileService
  ) {
    this.payload = this.data.payload.staffRequest;

  }

  ngOnInit() {
    this.load();
    this.itemForm.controls["bankingEntityChange"].setValue(this.payload.codeBankCts);
    this.itemForm.controls["accountNewNumberCts"].setValue(this.payload.accountCts);
    this.itemForm.controls["accountCCINewNumberCts"].setValue('');
    if(this.payload.currencyCts==="0"){
      this.itemForm.controls["idCurrencyAccountChange"].setValue("1");

    }else{
      this.itemForm.controls["idCurrencyAccountChange"].setValue("2");

    }
  }

  stopProp(e) {
    e.stopPropagation();
  }

  update(item) {
    item.favorite = true;
  }

  buildItemForm(item) {
    this.idTypeStaffRequest = item.idTypeStaffRequest;

    this.codeEmployee = this.data.payload.staffRequest.codeEmployee
    this.dateAdmission = this.data.payload.staffRequest.dateAdmission
    this.fullname = this.data.payload.staffRequest.lastName + ' ' + this.data.payload.staffRequest.motherLastName + ' ' + this.data.payload.staffRequest.names
    this.dni = this.data.payload.staffRequest.dni
    this.area = this.data.payload.staffRequest.area
    this.charge = this.data.payload.staffRequest.charge

    this.itemForm = this.fb.group({
      title: [item.title || null],
      idTypeStaffRequest: item.idTypeStaffRequest,
      staffRequest: [null],
      idEmployee: [item.staffRequest.idEmployee || null],
      idPerson:[item.staffRequest.idPerson || null],
      idCharge: [item.staffRequest.idCharge || null],
      idArea: [item.staffRequest.idArea || null],
      lastName: [item.staffRequest.lastName || null],
      motherLastName: [item.staffRequest.motherLastName || null],
      names: [item.staffRequest.names || null],
      dateAdmission: [item.staffRequest.dateAdmission],
      charge: [item.staffRequest.charge || null],
      dni:[item.staffRequest.dni || null],
      // idBankingEntityCurrent:['', Validators.required],
      // accountNumberCts:['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(18)]],
      // idCurrencyAccountCurrent: [item.idCurrencyAccountCurrent || null, Validators.required],
      bankingEntityChange: ['', Validators.required],
      idCurrencyAccountChange: ['', Validators.required],
      area: [item.staffRequest.area || null],            
      detailReasonLoan: [item.detailReasonLoan || null],   
      hasFileDni: null,
      hasFileDocument: null,
      idStaffRequest: [item.staffRequest.id || 0],
      accountNewNumberCts:['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(10), Validators.maxLength(25)]],
      // accountCCINewNumberCts:['', [Validators.pattern('[0-9]*'), Validators.minLength(20), Validators.maxLength(20)]],
      accountCCINewNumberCts:[''],
      DestinCurrencyCts: ['', Validators.required],
      BankingDestinCts: ['', Validators.required]
    });
  }

  submit(files) {

    if (this.itemForm.invalid || this.showMessageCaja) {
      this.snack.open("¡Es necesario ingresar todos los datos!", "OK", { duration: 4000, panelClass: 'center-alert' });
      return Object.values(this.itemForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    if ( files.length === 0 ) {
      this.snack.open("¡Es requerido adjuntar el documento!", "OK", { duration: 4000, panelClass: 'center-alert' });
      return;
    }

    let staffRequest = {
      idTypeStaffRequest: this.itemForm.value.idTypeStaffRequest,
      TypeStaffRequest: this.data.payload.TypeStaffRequest,
      staffRequestEmployee : {
        idEmployee: this.itemForm.value.idEmployee,
        idPerson: this.itemForm.value.idPerson,
        idCharge: this.itemForm.value.idCharge,
        idArea : this.itemForm.value.idArea,
        dateAdmission:this.itemForm.value.dateAdmission,
        names: this.itemForm.value.names,
        lastName: this.itemForm.value.lastName,
        motherLastName:this.itemForm.value.motherLastName,
        charge:this.itemForm.value.charge,
        dni:this.itemForm.value.dni
      }
    };
    this.itemForm.controls["staffRequest"].setValue(staffRequest);

    const formData = new FormData();
    if (files.length === 0){
      this.snack.open('Debe de adjuntar su DNI', "OK", {
        duration: 4000,panelClass: 'center-alert'
      });

      return;
    }
    for (let file of files){
      formData.append(file.name, file);
    }
    formData.append('data', JSON.stringify(this.itemForm.value));
    this.staffRequestAccountChangeCtsService.add(formData).subscribe(
        (res) => {
          if (res.stateCode == 200) {
            this.snack.open("¡Registro Agregado!", "OK", { duration: 4000 });
            this.dialogRef.close(false);
          } else if (res.stateCode == 2) {
            this.snack.open(res.messageError[0], "OK", { duration: 4000, panelClass: 'center-alert' });
          } else {
            this.snack.open("Ocurrio un error en el servidor", "Error", {
              duration: 4000,panelClass: 'center-alert'
            });
          }
        },
        (err) => {},
        () => {
          this.load();
        }
      );
    
  }

  deletefile() {
    this.selectedFile = "";
    this.displayFileName = "";
    this.fileInput.nativeElement.value = "";
    this.itemForm.controls["hasFileDni"].setValue("");
    return false;
  }

  onFileChanged(event) {
    
    if (this.itemForm.invalid) {
      this.snack.open("¡Es necesario ingresar todos los datos!", "OK", { duration: 4000, panelClass: 'center-alert' });
      return Object.values(this.itemForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    if (event.target.files.length === 0) {
      return;
    } 
    
    this.selectedFile = event.target.files[0];
    const nombreArchivo = this.selectedFile.name;
    this.fileName = nombreArchivo
    this.displayFileName = "<span>" + nombreArchivo + "</span>";
    
    if (parseInt((event.target.files[0].size / 1024 / 1024).toFixed(1)) > environment.MaxFileSizeMB) {
      this.selectedFile = "";
      this.displayFileName = "";
      this.snack.open('El tamaño máximo permitido es: ' + environment.MaxFileSizeMB + "MB", 'OK',{ duration: 4000, panelClass: 'center-alert' });

      return;
    }
    this.itemForm.controls["hasFileDni"].setValue("SI");
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

  load() {
    this.loadCurrency();
    this.loadDestinCurrency();
    this.loadBankingEntity();
    this.loadDestinBankingEntity();
    this.buildItemForm(this.data.payload);
  }

  loadBankingEntity() {
    this.postulantFileService.getexactusbank().subscribe(resp => {
      this.lstTypeBanking = resp.data;
    });
  }

  loadDestinBankingEntity() {
    this.postulantFileService.getexactusbank().subscribe(resp => {
      console.log("🚀 ~ DialogStaffRequestAccountChangeCtsComponent ~ this.postulantFileService.getexactusbank ~ resp:", resp)
      this.lstTypeBankingDestin=resp.data;
    });
  }

  loadCurrency(){
    //   this.lstTypeCurrency.push({
    //       id:1,
    //       description:'Soles'
    //   });
    //   this.lstTypeCurrency.push({
    //     id:2,
    //     description:'Dólares'
    // });
    this._serviceEmployee.ListGenericByKey(environment.keyCurrency).subscribe(resp => {
      this.lstTypeCurrency = resp;
    })
  }

  loadDestinCurrency(){
    this._serviceEmployee.ListGenericByKey(environment.keyCurrency).subscribe(resp => {
      this.lstTypeDestinCurrencyCTS=resp;
    })
  }

  NumbersOnly(event) {
    if (!(event.charCode > 32 && event.charCode < 65 || event.charCode > 90 && event.charCode < 97 || event.charCode > 122)) {
      return false;
    }
  }

  downloadFormato(type): void {
    this.staffRequestApproverService.getdocumentURL(type).subscribe(resp => {
      this.ViewAdjuntoURL(resp)
    } )
  }

  ViewAdjuntoURL(url): void {
    const urlFile = url;

    if (urlFile != null) {

      const payload = {
        FileName: '',
        FileUrl: urlFile,
        ContentType: '',
        File: ''
      }

      this._serviceEmployee.GetByFile(payload).subscribe(resp => {
        let link = document.createElement('a');
        let blobArchivo = this.base64ToBlob(resp.data.file, resp.data.contentType);
        let blob = new Blob([blobArchivo], { type: resp.data.contentType })
        link.href = URL.createObjectURL(blob);
        link.download = resp.data.fileName;
        link.click();

      })

    } else {
      this.snack.open('No se pudo descargar el archivo', "OK", {
        duration: 4000,
      });
    }
  }

  public base64ToBlob(b64Data, contentType='', sliceSize=512) {
    b64Data = b64Data.replace(/\s/g, ''); //IE compatibility...
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, {type: contentType});
  }

  changeBanco() {   
    // this.showMessageCaja =  this.itemForm.controls["BankingDestinCts"].value == 'CAJA' ;
   if(this.allowed_banks.includes(this.itemForm.controls["BankingDestinCts"].value))
   {
    this.showMessageCaja = false;
   }else {
    this.showMessageCaja = true;
   }
  }
}
