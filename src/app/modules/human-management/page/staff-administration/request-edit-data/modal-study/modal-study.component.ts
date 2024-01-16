import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IDetailEmployee } from '@app/data/schema/employee';
import { IPerson } from '@app/data/schema/person';
import { EmployeeService } from '@app/data/service/employee.service';
import { UtilService } from '@app/data/service/util.service';
import { StylePaginatorDirective } from '@app/shared/directives/style-paginator.directive';
import { AppConfirmService } from '@app/shared/services/app-confirm/app-confirm.service';
import { PageEvent } from '@angular/material/paginator';
import { CargoQueryFilter } from '@app/data/schema/Cargo/CargoQueryFilter';

@Component({
  selector: 'app-modal-study',
  templateUrl: './modal-study.component.html',
  styleUrls: ['./modal-study.component.scss']
})
export class ModalStudyComponent implements OnInit {
  idEmployee: number = 0;
  idPerson: number = 0;
  isNewStuden: boolean = false;
  studen: any[] = [];
  formStuden: FormGroup;
  idStuden: number = null;
  totalRows = 0;
  pageSize = 5;
  currentPage= 0;
  pageSizeOptions: number[] = [5, 10, 25];

  departament: any[] = [];
  province: any[] = [];
  district: any[] = [];
  listinstruccion: any[] = [];

  blockProvince: boolean = false;
  blockDistrict: boolean = false;

  person: IPerson;
  employee: IDetailEmployee;
  maxDate = new Date();

  fileName: string = '';
  lstStateStudy: any[] = [];

  initFormStuden(): void {
    this.formStuden = this._fs.group({
      nid_employee: [''],
      nid_instruction: ['', [Validators.required]],
      nid_district: ['', [Validators.required]],
      nid_province: ['', [Validators.required]],
      nid_departament: ['', [Validators.required]],
      sstudy_center: ['', [Validators.required,Validators.pattern('[A-Za-zÁÉÍÓÚáéíóúñÑ ]*')]],
      scarreer: ['', [Validators.required,Validators.pattern('[A-Za-zÁÉÍÓÚáéíóúñÑ ]*')]],
      scurrent_cycle: ['', [Validators.required]],
      dateStart: ['', [Validators.required]],
      dateEnd: ['', [Validators.required]],
    })
  }

  file: File = null;

  @ViewChild(StylePaginatorDirective, { static: true }) paginatorx: StylePaginatorDirective;
  studenDT: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginatorstudent: MatPaginator;
  @ViewChild(MatSort) sortstudent: MatSort;
  displayedColumnstudent: string[] = [
    'option',
    'instruccion',
    'scarreer',
    'sstudy_center',
    'scurrent_cycle',
    'dateStart',
    'dateEnd',
    'state'
  ];

  cargoFilter= <CargoQueryFilter>{pagination:{
    currentPage:1,
    itemsPerPage:this.pageSize,
    totalItems:0,
    totalPages:1,
    totalRows:0
  }};

  constructor(
    private dialogRef: MatDialogRef<ModalStudyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _serviceEmployee: EmployeeService,
    private _serviceUtil: UtilService,
    private confirmService: AppConfirmService,
    private _fs: FormBuilder,
    private snack: MatSnackBar,
  ) {
    this.idPerson = this.data.person;
    this.idEmployee = this.data.employee;
    this.initFormStuden();
  }

  ngOnInit(): void {
    this.studenDT.paginator = this.paginatorx.matPag;
    this.loadStateStudy();
    this.load();
    // this.ListStudenEmployee(this.idEmployee);
    this.getDepartament();
    this.getListInstruccion();
    this.getDetailtEmployee();

    this.formStuden.get('nid_departament').valueChanges.subscribe(() => {
      const id: number = this.formStuden.get('nid_departament').value;
      if (id > 0) {
        this.getProvince(id);
        this.blockProvince = true;
      }
    })

    this.formStuden.get('nid_province').valueChanges.subscribe(() => {
      const id: number = this.formStuden.get('nid_province').value;
      if (id > 0) {
        this.getDistrict(id)
        this.blockDistrict = true;
      }
    })
  }

  loadStateStudy() {
    this._serviceEmployee.ListGeneric(110).subscribe((res) => {
      this.lstStateStudy = res;
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  addstuden(): void {
    this.isNewStuden = true;
    this.idStuden = null;
  }

  onFileSelected(event: any) {

    const pddf = event.target.files[0] as File;
    
    if (['application/pdf','image/jpeg', 'image/jpg', 'image/png'].includes(pddf.type)) {
      
      this.file = pddf;
      this.fileName = this.file.name;
    } else {
      this.snack.open('Solo son permitidos los archivos pdf, jpeg, jpg y png', "OK", {
        duration: 4000,
      });

    }
  }

  deleteStuden(row): void {
    this.confirmService.confirm({ message: `Desea eliminar este estudio seleccionado?` })
      .subscribe(res => {
        if (res) {
          if ( this.file != null  ) {
            const payload = {
              nid_typerequest: 12,
              nid_collaborator: Number(this.idEmployee),
              description: null,
              nid_address: null,
              saddress: null,
              nid_district: Number(row.nid_district),
              nid_phone: null,
              phone: null,
              nid_statecivil:null,
              nid_education: Number(this.idStuden),
              nid_instruction:Number(row.nid_instruction),
              sstudy_center:row.sstudy_center,
              scarreer: row.scarreer,
              scurrent_cycle:row.scurrent_cycle,
              dateStart:row.dateStart,
              dateEnd:row.dateEnd,
              snamewife_partner:null,
              ddateofmarriage:null,
              nid_son:null,
              sfullname:null,
              ddateofbirth:null,
              nyear:null,
              ntypeaction: 3, // 1 INSERT 2 - UPDATE - 3 DELETE
              ntypeseccion: 5,
              sheavymachinerylicense: null,
              sddriverlicense: null,
              slastname: null,
              smotherslastname: null,
              nid_person: this.idPerson,
            }
   
            const formData = new FormData();
            formData.append('files', this.file);
            formData.append('request', JSON.stringify(payload));
  
            this._serviceEmployee.InsertRequestEmployee(formData).subscribe(resp => {
              this.dialogRef.close();
              this.snack.open('Se registro correctamente su solicitud', "OK", {
                duration: 4000,
              });
            })
          } else {
            this.snack.open('Es obligatorio  adjuntar un archivo pdf', "OK", {
              duration: 4000,
            });
          }
          
        }
      })
  }

  getDepartament(): void {
    this._serviceUtil.getDepartament().subscribe(resp => {
      this.departament = resp;
    })
  }

  getDetailtEmployee(): void {
    this._serviceEmployee.getDetailtEmployee(this.idEmployee).subscribe(resp => {
      this.employee = resp;
      
    })
  }

  editStuden(row): void {
    this.isNewStuden = true;
    this.formStuden.reset({
      nid_employee: row.nid_employee,
      nid_instruction: row.nid_instruction,
      nid_district: row.nid_district,
      nid_province: row.nid_province,
      nid_departament: row.nid_department,
      sstudy_center: row.sstudy_center,
      scarreer: row.scarreer,
      scurrent_cycle: row.scurrent_cycle,
      dateStart: row.dateStart,
      dateEnd: row.dateEnd
    })
    this.idStuden = row.nid_education
  }

  getProvince(id: number): void {
    this._serviceUtil.getProvince(id).subscribe(resp => {
      this.province = resp;
    })
  }

  getDistrict(id: number): void {
    this._serviceUtil.getDistrit(id).subscribe(resp => {
      this.district = resp;
    })
  }

  getListInstruccion(): void {
    this._serviceEmployee.getListInstruccion().subscribe(resp => {
      this.listinstruccion = resp;
    })
  }


  cancelStuden(): void {
    this.formStuden.reset({
      nid_employee: '',
      nid_instruction: '',
      nid_district: '',
      sstudy_center: '',
      scarreer: '',
      scurrent_cycle: '',
      dateStart: '',
      dateEnd: '',
    })
    this.formStuden.updateValueAndValidity();
    this.isNewStuden = false;;
    this.idStuden = null;
  }

  saveStuden(): void {
    if ( this.formStuden.invalid ) {
      return Object.values(this.formStuden.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }
    let payload;

    if ( this.file != null  ) {
      if ( this.idStuden === null ) {
      
        const payload = {
          nid_typerequest: 12,
          nid_collaborator: Number(this.idEmployee),
          description: null,
          nid_address: null,
          saddress: null,
          nid_district: Number(this.formStuden.get('nid_district').value),
          nid_phone:null,
          phone: null,
          nid_statecivil: null,
          nid_education: null,
          nid_instruction: Number(this.formStuden.get('nid_instruction').value),
          sstudy_center:this.formStuden.get('sstudy_center').value,
          scarreer:this.formStuden.get('scarreer').value,
          scurrent_cycle:this.formStuden.get('scurrent_cycle').value,
          dateStart:this.formStuden.get('dateStart').value,
          dateEnd:this.formStuden.get('dateEnd').value,
          snamewife_partner:null,
          ddateofmarriage:null,
          nid_son:null,
          sfullname:null,
          ddateofbirth:null,
          nyear:null,
          ntypeaction: 1, // 1 INSERT 2 - UPDATE - 3 DELETE
          ntypeseccion: 5,
          sheavymachinerylicense: null,
          sddriverlicense: null,
          slastname: null,
          smotherslastname: null,
          nid_person: this.idPerson,
        }

        const formData = new FormData();
        formData.append('files', this.file);
        formData.append('request', JSON.stringify(payload));

        this._serviceEmployee.InsertRequestEmployee(formData).subscribe(resp => {
          this.dialogRef.close();
          this.snack.open('Se registro correctamente su solicitud', "OK", {
            duration: 4000,
          });
        })
  
      } else {
        const payload = {
          nid_typerequest: 12,
          nid_collaborator: Number(this.idEmployee),
          description: null,
          nid_address: null,
          saddress: null,
          nid_district: Number(this.formStuden.get('nid_district').value),
          nid_phone:null,
          phone: null,
          nid_statecivil: null,
          nid_education: this.idStuden,
          nid_instruction: Number(this.formStuden.get('nid_instruction').value),
          sstudy_center:this.formStuden.get('sstudy_center').value,
          scarreer:this.formStuden.get('scarreer').value,
          scurrent_cycle:this.formStuden.get('scurrent_cycle').value,
          dateStart:this.formStuden.get('dateStart').value,
          dateEnd:this.formStuden.get('dateEnd').value,
          snamewife_partner:null,
          ddateofmarriage:null,
          nid_son:null,
          sfullname:null,
          ddateofbirth:null,
          nyear:null,
          ntypeaction: 2, // 1 INSERT 2 - UPDATE - 3 DELETE
          ntypeseccion: 5,
          sheavymachinerylicense: null,
          sddriverlicense: null,
          slastname: null,
          smotherslastname: null,
          nid_person: this.idPerson,
        }

        const formData = new FormData();
        formData.append('files', this.file);
        formData.append('request', JSON.stringify(payload));
  
        this._serviceEmployee.InsertRequestEmployee(formData).subscribe(resp => {
          this.dialogRef.close();
          this.snack.open('Se registro correctamente su solicitud', "OK", {
            duration: 4000,
          });
        })
      }
    } else {
      this.snack.open('Es obligatorio  adjuntar un archivo pdf', "OK", {
        duration: 4000,
      });
    }

    
  }

  







  
  load() {
    this.paginatorx._rangeStart = 0;
    this.paginatorx._rangeEnd = 2;
    this.changedPageNumber(0);
  }

  ListStudenEmployee(IdEmployee: number): void {
    this._serviceEmployee.getListStuden(IdEmployee).subscribe(resp => {
      this.studen = resp;
      // this.studenDT = new MatTableDataSource(this.studen);
      if (this.studenDT.data != null) {
        this.studenDT.paginator = this.paginatorstudent;
        this.studenDT.sort = this.sortstudent;
      }
    },
    (err) => {},
    () => {
      this.studenDT = new MatTableDataSource<any>(this.studen);
      setTimeout(() => {
        this.paginatorx.initPageRange();
      });
      this.ngAfterViewInit();
    })
  }

  ngAfterViewInit() {
    this.studenDT.paginator = this.paginatorx.matPag;
  }

  changedPageSize(event: PageEvent) {
    this.setPage(event.pageSize, event.pageIndex);
  }

  changedPageNumber(pagina: number) {
    this.setPage(this.pageSize, pagina);
  }

  setPage(pageSize: number, pageIndex: number) {
    if (this.pageSize !== pageSize){
      this.pageSize = pageSize;  
      this.cargoFilter.pagination.itemsPerPage = this.pageSize;
      this.cargoFilter.pagination.currentPage = 1;
      this.currentPage = 0;
    }else{
      this.cargoFilter.pagination.currentPage = pageIndex + 1;
      this.currentPage = pageIndex;
    }
    this.studenDT.paginator = this.paginatorx.matPag;
    this.ListStudenEmployee(this.idEmployee);
  }






}
