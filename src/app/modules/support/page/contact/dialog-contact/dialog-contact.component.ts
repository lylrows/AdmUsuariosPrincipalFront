import { egretAnimations } from '@shared/animations/egret-animations';
import { ContactService } from "@data/service/contact.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Component, OnInit, Inject, ViewChild, ElementRef } from "@angular/core";
import { environment } from "environments/environment";
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from '@app/shared/services/app-confirm/app-confirm.service';
import { DomSanitizer } from '@angular/platform-browser';
import { EmployeeService } from '@app/data/service/employee.service';
import { EmployeeQueryFilter } from '@app/data/schema/employee/EmployeQueryFilter';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from "rxjs/operators";
import { MatSelect } from "@angular/material/select";

export interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: "app-dialog-contact",
  templateUrl: "dialog-contact.component.html",
  styleUrls: ['dialog-contact.component.scss'],
  animations: egretAnimations,
})
export class DialogContactComponent implements OnInit {
  public itemForm: FormGroup;
  public progress: number;
  public message: string;
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
  idContact = 0;
  archivoCapturado:any;
  employees: any[] = [];
  
  employeeFilter= <EmployeeQueryFilter>{
    nid_company:0,
    nid_position:0,
    sidentification:'',
    sfullname:''  
  };
  selectedEmployee= 0;
  storage = null;
  // Campañas
  employeesMultiCtrl: FormControl = new FormControl();
  employeesMultiFilterCtrl: FormControl = new FormControl();
  filteredEmployeesMulti: ReplaySubject<any> = new ReplaySubject(1);
  @ViewChild("multiSelectEmployee", { static: true }) multiSelectCampana: MatSelect;
 
 
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogContactComponent>,
    private fb: FormBuilder,
    private contactService: ContactService,
    private snack: MatSnackBar,
    public confirmService: AppConfirmService,
    private sanitizer: DomSanitizer,
    private _serviceEmployee: EmployeeService
  ) {
    this.storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    
  }

  ngOnInit() {
    this.getEmployee();
    this.buildItemForm(this.data.payload);
    this.load();
  }


  getEmployee(): void {
    this._serviceEmployee.getAllNoPagination().subscribe(resp => {
      this.employees = resp.data.list;
      console.log("🚀 ~ this._serviceEmployee.getAllNoPagination ~ this.employees:", this.employees)
      this.employeesMultiCtrl.setValue([]);
      this.employeesMultiCtrl.setValue([this.employees[1]]);
      this.filteredEmployeesMulti.next(this.employees.slice());
      this.employeesMultiCtrl.setValue([]);
      this.employeesMultiFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterCampanasMulti();
      }); 
    })
  }
//this.formEmployee.get('nid_position').setValue('');

  buildItemForm(item) {
    
    
    this.imageURL= item.photo_url;
    if( typeof item.id === 'undefined' || item.id === null ){
      item.id=0;
      item.id_Employee=0;
     }
    this.idContact = item.id;
    this.selectedEmployee = item.id_Employee;

    
    if( typeof item.active === 'undefined' || item.active === null ){
      item.active=true;
     }
    

    this.itemForm = this.fb.group({
      id: [item.id || 0],
      name: new FormControl(item.name || "", [
        Validators.required,
        Validators.maxLength(50)
      ]),
      position: new FormControl(item.position || "", [
        Validators.required,
        Validators.maxLength(50)
      ]),
      phone: new FormControl(item.phone || "", [
        Validators.required,
        Validators.maxLength(20)
      ]),
      reason: new FormControl(item.reason || "", [
        Validators.required,
        Validators.maxLength(50)
      ]),
      extension: new FormControl(item.extension || "", [
        Validators.maxLength(7)
      ]),
      email: new FormControl(item.email || "", [
        Validators.maxLength(50),
        Validators.email
      ]),
      id_Employee: [item.id_Employee || 0],
      photo_url: [item.photo_url || ""],
      active: [item.active  ]
    });
  }
 
  submit(files) {
    const formData = new FormData();
    for (let file of files)
      formData.append(file.name, file);
      // Setea el valor
      if (
        this.employeesMultiCtrl.value !== null &&
        this.employeesMultiCtrl.value != []
      ) {
        const value = this.employeesMultiCtrl.value;
        this.itemForm.get('id_Employee').setValue(value.nid_employee);
      }
      // if (this.itemForm.get('id').value > 0) {
      if (this.itemForm.get('id_Employee').value > 0) {
        let url_photo=this.employees.find( emp => emp.nid_employee === this.itemForm.get('id_Employee').value);
        this.itemForm.get('photo_url').setValue(url_photo.simg);
      }
      
      formData.append('data', JSON.stringify(this.itemForm.value));
      
      this.contactService.upload(formData).subscribe(result => {
        
        this.dialogRef.close();
        
        if (this.idContact === 0 )
        {
          this.snack.open("Se registró de manera correcta", 'OK',{ duration: 4000 });
        }else{
          this.snack.open("Se actualizó de manera correcta", 'OK',{ duration: 4000 });
        }
        

      });    
  }

  load() {
    // this.contactService.getAll().subscribe((res) => {
    //   //this.items = res;
    // });
  }
  deletefile() {
    this.selectedFile = "";
    this.displayFileName = "";
    this.fileInput.nativeElement.value = "";
    this.imageURL="";
    return false;
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
  });

  changeEmployee(event){
    const emp = this.employees.find( emp => emp.nid_employee === event.value);
    this.itemForm.get('name').setValue(emp.snames + ' ' + emp.ssurnames );
    this.itemForm.get('position').setValue(emp.snamecharge );

  }

  protected _onDestroy = new Subject();

  /**
  * Write code on Method
  *
  * method logical code
  */
 ngAfterViewInit() {
   this.setInitialValue();
 }
 /**
  * Write code on Method
  *
  * method logical code
  */
 ngOnDestroy() {
   this._onDestroy.next();
   this._onDestroy.complete();
 }
/**
  * Write code on Method
  *
  * method logical code
  */
protected setInitialValue() {
   this.filteredEmployeesMulti.pipe(take(1), takeUntil(this._onDestroy))
   .subscribe(() => {
     this.multiSelectCampana.compareWith = (a: any, b: any) =>
       a && b && a.nid_employee === b.nid_employee;
   });  
}
 /**
  * Write code on Method
  *
  * method logical code
  */
 protected filterCampanasMulti() {
   if (!this.employees) {
     return;
   }

   let search = this.employeesMultiFilterCtrl.value;
   if (!search) {
     this.filteredEmployeesMulti.next(this.employees.slice());
     return;
   } else {
     search = search.toLowerCase();
   }

   this.filteredEmployeesMulti.next(
     this.employees.filter(
       (emp) => emp.sfullname.toLowerCase().indexOf(search) > -1
     )
   );
 }
  
}
