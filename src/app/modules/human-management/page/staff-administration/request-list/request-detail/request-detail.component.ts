import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IDetailEmployee, IEmployeeFile } from '@app/data/schema/employee';
import { IPerson } from '@app/data/schema/person';
import { EmployeeService } from '@app/data/service/employee.service';
import { PerformanceService } from '@app/data/service/performance.service';
import { UtilService } from '@app/data/service/util.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ModalCommentComponent } from './../../modal-comment/modal-comment.component';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss']
})
export class RequestDetailComponent implements OnInit {

  detail = null;
  requestId: number = 0;
  type: number = 0;
  ntypeseccion: number = 0;
  state: number = 0;
  nid_collaborator: number = 0;
  IdPerson: number = 0;

  person: IPerson;
  employee: IDetailEmployee;
  employeeFile: IEmployeeFile;

  civil: any[] = [];
  address: any[] = [];
  civilname: string = '';
  collaborator: string = '';
  estadoAction: number = 0;
  estadoName: string = '';

  idPosition: number = 0;

  isaccept: boolean = false;

  studen = [];
  sons = [];
  listmonth: any[] = [];

  showDataAntiguua: boolean = false;
  addressAntiguo = null;
  phoneAntiguo = null;
  statecivilAntiguo = null;
  licenciaMaquinariaAntigua = null;
  licenciaConducirAntigua = null;
  centrostudioAntiguo = null;
  estadooAntiguo = null;
  fechaInicioAntiguo = null;
  fechaFinAntiguo = null;
  esposaAntigua = null;
  esposaActual = '';
  esposaFechaAntigua = null;
  nombrerHijoAngitua = null;
  apmaternoAntigua = null;
  appaternoAntgua = null;
  fechasonAntgua = null;

  idemisorEmployee : number = 0;
  idemisorPerson : number = 0;
  idemisorArea: number = 0;

  nameMonth: string = '';
  yearData: number = 0;
  
  inputArea: any;
  inputPuesto: string = '';
  inputJefe: string = '';
  area: any[] = [];
  nid_profile : number = 0;
  date;

  constructor(
    private dialogRef: MatDialogRef<RequestDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _serviceEmployee: EmployeeService,
    private snack: MatSnackBar,
    private _serviceUtil: UtilService,
    private _service: PerformanceService,
    public _dialog: MatDialog
  ) {
    
    this.requestId = this.data.request;
    this.type = this.data.type;
    this.state = this.data.state;
    this.nid_collaborator = this.data.nid_collaborator;
    this.date = this.data.date;
    this.getDetailtEmployee();

    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.nid_profile = storage.nid_profile;
    
    this.idemisorEmployee = storage.nid_employee;
  }

  ngOnInit(): void {
    this.getEmployeeByEmisor();
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.idPosition = storage.nid_position;
    if ( this.nid_profile === 4 || this.nid_profile === 10 || this.nid_profile === 11 || this.nid_profile === 20  ) {
      this.isaccept= true;
    } else {
      this.isaccept= false
    }
  }

  
  getDetailtEmployee(): void {
    this._serviceEmployee.getDetailtEmployee(this.nid_collaborator).subscribe(resp => {
      this.employee = resp;
      
      this.IdPerson = this.employee.nid_person;
      this.idemisorArea = this.employee.nid_area;
      this.inputArea = this.employee.nid_area;
      this.inputPuesto = this.employee.snamecharge
      this.inputJefe = this.employee.snameboss
      this.getMonth();
      this.getDetailRequest();
      this.getArea()
    })
  }

  getArea(): void {
    this._serviceUtil.getArea().subscribe(resp => {
      this.area = resp
      const areaData = this.area.find(e => e.nid_area === this.employee.nid_area);
      this.inputArea = areaData.snamearea;
    })
  }

  getMonth(): void {
    this.listmonth = this._service.getListMonth();
    console.log("🚀 ~ RequestDetailComponent ~ getMonth ~ this.listmonth:", this.listmonth)
    
  }

  getEmployeeByEmisor(): void {
    this._serviceEmployee.getDetailtEmployee(this.idemisorEmployee).subscribe(resp => {
      
      this.idemisorPerson = resp.nid_person;
    });
  }

  getPerson(IdPerson: number): void {
    this._serviceEmployee.getPerson(IdPerson).subscribe(resp => {
      this.person = resp;
      
    })
  }

  getEmployeeFile(IdPerson): void {
    this._serviceEmployee.getEmployeeFile(IdPerson).subscribe(resp => {
      this.employeeFile = resp;
      
       
    });
  }

  getDetailRequest(): void {
    this._serviceEmployee.RequestDetail(this.requestId).subscribe(resp => {
      console.log("🚀 ~ RequestDetailComponent ~ this._serviceEmployee.RequestDetail ~ resp:", resp)
      
      this.getPerson(this.IdPerson);
      this.getEmployeeFile(this.IdPerson);
      this.detail = resp;
      this.ntypeseccion = this.detail.ntypeseccion;
      
      this.collaborator = this.detail.scollaborator;
      this.estadoAction = this.detail.ntypeaction;
      
  

      if ( this.ntypeseccion === 8 || this.ntypeseccion === 9 ) {
        const dataMonth = this.listmonth.find(e => e.code === this.detail.nmonth)
        this.nameMonth = dataMonth.name;

        this.yearData = this.detail.nyear
      }

      if ( this.detail.ntypeaction === 2 ) {
        switch (this.ntypeseccion) {
          case 1:
            
            this._serviceEmployee.getListAddress(this.IdPerson).subscribe(resp => {
                this.address = resp;
                
                const dataAntigua = this.address.find(e => e.nid_address === this.detail.nid_address)
                this.showDataAntiguua = true;
                this.addressAntiguo = dataAntigua;

              })
            break;
          case 2: 

              this.showDataAntiguua = true;
              this.phoneAntiguo = this.detail.phone;

            break;

          case 3:

            this._serviceUtil.getCivil().subscribe(resp => {
              this.civil = resp

              const civildataantigua = this.civil.find(e => e.nid_mastertable ===  this.person.nid_civilstatus)
              const civildata = this.civil.find(e => e.nid_mastertable ===  this.detail.nid_statecivil)
              if ( civildata ) {
                this.civilname = civildata.sdescription_value;
              }
              this.showDataAntiguua = true;
              this.statecivilAntiguo = civildataantigua.sdescription_value;
            });
            
            break;
          case 4:

            this.showDataAntiguua = true;
            this.licenciaConducirAntigua = this.employee.sddriverlicense
            this.licenciaMaquinariaAntigua = this.employee.sheavymachinerylicense

            break;

          case 5:

            this.showDataAntiguua = true;
            this._serviceEmployee.getListStuden(this.employee.nid_employee).subscribe(resp => {
              this.studen = resp;

              const studenActual = this.studen.find(e => e.nid_education === this.detail.nid_education)

              
              this.centrostudioAntiguo = studenActual.sstudy_center;
              this.estadooAntiguo = studenActual.scurrent_cycle;
              this.fechaInicioAntiguo = studenActual.dateStart;
              this.fechaFinAntiguo = studenActual.dateEnd

            });
            
            break;

          case 6:

            this.showDataAntiguua = true;
            this.esposaAntigua = this.employee.snamewife_partner;
            this.esposaFechaAntigua = this.employee.ddateofmarriage;
            this.esposaActual = this.detail.slastname_partnet + ' ' + this.detail.smotherlastname_partnet + ' ' + this.detail.snamewife_partner
            break;

          case 7:

            this.showDataAntiguua = true;
            this._serviceEmployee.ListSon(this.employee.nid_employee).subscribe(resp => {
              this.sons = resp;

              
              const sonsActual = this.sons.find(e => e.nid_son === this.detail.nid_son);

              this.nombrerHijoAngitua = sonsActual.sfullname;
              this.apmaternoAntigua = sonsActual.smotherslastname;
              this.appaternoAntgua = sonsActual.slastname;
              this.fechasonAntgua = sonsActual.ddateofbirth;

            })

            break;
          default:
            break;
        }
      }
      switch (this.detail.ntypeaction) {
        case 1:
          this.estadoName = 'Nuevo ingreso'
          break;
        case 2:
          this.estadoName = 'Edicion'
          break;
        case 3:
          this.estadoName = 'Eliminacion'
          break;
        default:
          break;
      }

      

     
    })
  }

  AcceptRequest(): void {
    const payload = {
      nid_request: this.requestId,
      nid_emisor: this.idemisorPerson,
      nid_reseptor: this.IdPerson,
      nid_area: this.idemisorArea,
      type: this.type,
      name: this.collaborator,
      dni: this.person.sidentification,
      charger: this.inputPuesto,
      date: this.employee.dregister,
      ntypeseccion: this.ntypeseccion
    }
        this._serviceEmployee.AcceptRequest(payload).subscribe((resp: any )=> {
          
          this.dialogRef.close();
          this.snack.open(resp.data, "OK", {
            duration: 4000,
          });
        })
  }

  

  RejectRequest(): void {
    const payload = {
      form: 'RequestDetailComponent',
      nid_request: this.requestId,
      nid_collaborator: this.nid_collaborator,
      nid_reseptor: this.IdPerson,
      nid_area: this.idemisorArea,
      type: this.type,
      lectura: false,
      scomment: ''
    }

    const config = new MatDialogConfig();
    config.disableClose = true,
    config.width = '700px'
    config.data = { request: payload }

    const modal = this._dialog.open(ModalCommentComponent, config);

    modal.afterClosed().subscribe(resp => {
      this.cancel();
    })
    
  }

  cancel(): void {
    this.dialogRef.close();
  }
 

  upload(files: File[]) {
    var formData = new FormData();
    Array.from(files).forEach(f => formData.append('file', f))
    
  }

  ViewAdjunto(): void {
    const url = this.detail.sFile;
 
    const payload = {
      FileName: '',
      FileUrl: url,
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
  }

  
  public base64ToBlob(b64Data, contentType='', sliceSize=512) {
    b64Data = b64Data.replace(/\s/g, ''); 
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

}
