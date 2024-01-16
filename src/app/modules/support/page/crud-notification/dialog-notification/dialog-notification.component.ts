import { Empresa } from './../../../../../data/schema/empresa';
import { EmpresaService } from '@app/data/service/empresa.service';
import { egretAnimations } from './../../../../../shared/animations/egret-animations';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Component, OnInit, Inject, ElementRef, ViewChild } from "@angular/core";
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@env';
import { Food } from '../../contact/dialog-contact/dialog-contact.component';
import { CustomValidators } from 'ngx-custom-validators';
import { Areas } from '@app/data/schema/areas';
import { AreaService } from '@app/data/service/areas.service';

@Component({
  selector: "app-dialog-notification",
  templateUrl: "dialog-notification.component.html",
  styleUrls: ['dialog-notification.component.scss'],
  animations: egretAnimations,
})
export class DialogNotificationComponent implements OnInit {
  public itemForm: FormGroup;
  public idUser: number;
  public progress: number;
  public message: string;
  public empresas: Empresa[];
  areas: Areas[];
  lstAreas: Areas[];
  selectedFile: any;
  displayFileName = '';
  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

  @ViewChild('fileInput')
  fileInput: ElementRef;
  imageURL ='';
  archivoCapturado:any;
  editorOptions= {
    toolbar: [
      [{ 'list': 'bullet' }],
      [ 'bold', 'italic', 'underline'],
    ],
  };
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogNotificationComponent>,
    private sanitizer: DomSanitizer,
    private snack: MatSnackBar,
    private fb: FormBuilder,
    private empresaService: EmpresaService,
    private areaService: AreaService
  ) {
    this.idUser = 0;
  }

  ngOnInit() {
    this.buildItemForm(this.data.payload);
    this.load();
  }

  buildItemForm(item) {

    this.itemForm = this.fb.group({
    idCompany: [item.idCompany || null],
      idArea: [item.idArea || null],
      subject: [item.subject || null, [Validators.required,Validators.pattern('[a-zA-Z0-9-ñÑáéíóúÁÉÍÓÚ ]+')]],
      body: [item.body || "", Validators.required],
      active: [item.active == undefined ? true : item.active],
      id: [item.id || 0]
    });
  }

  submit() {
    this.dialogRef.close(JSON.stringify(this.itemForm.value));
  }

  load() {
    this.loadEmpresas();
    this.loadAreas();
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
    return false;
  }

  changeEmpresa(event) {
    if (event.value != 0) {
      this.areas = this.lstAreas.filter(x => x.idEmpresa == event.value);
    }
  }

  loadEmpresas() {
    this.empresaService.getAll().subscribe(res => this.empresas = res);
  }

  loadAreas() {
    this.areaService.getAll().subscribe((res) => {
      this.lstAreas = res.data;
      this.areas = this.lstAreas;
    });
  }


}
