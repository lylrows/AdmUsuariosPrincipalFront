import { environment } from 'environments/environment';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Areas } from '@app/data/schema/areas';
import { Empresa } from '@app/data/schema/empresa';
import { FilterPostulantRequest, PostulantRequest } from '@app/data/schema/Postulant/postulant';
import { AreaService } from '@app/data/service/areas.service';
import { EmployeeService } from '@app/data/service/employee.service';
import { EmpresaService } from '@app/data/service/empresa.service';
import { InformationPostulantService } from '@app/data/service/information-postulant.service';
import { MastertableService } from '@app/data/service/mastertable.service';
import { SalaryBandService } from '@app/data/service/salaryband.service';
import { UtilService } from '@app/data/service/util.service';
import { ModalBossComponent } from '../../staff-administration/profile/modal-boss/modal-boss.component';
import * as _moment from "moment";

@Component({
  selector: 'app-recruitment-information-request',
  templateUrl: './recruitment-information-request.component.html',
  styleUrls: ['./recruitment-information-request.component.scss']
})
export class RecruitmentInformationRequestComponent implements OnInit {
  @Input() filter: FilterPostulantRequest;
  @Input() showExactusDescription: boolean = false;
  @Output() updateModel = new EventEmitter();

  
  postulantRequest: PostulantRequest = {
    idPostulantRequest: 0,
    idEvaluation: 0,
    idPostulant: 0,
    type: '',
    firstName: '',
    secondName: '',
    lastName: '',
    motherLastName: '',
    documentType: '',
    documentNumber: '',
    birthDate: '',
    idCompany: 0,
    idManagement: 0,
    idArea: 0,
    idSubArea: 0,
    idCostCenter: 0,
    position: '',
    incomeDate: '',
    endDate: '',
    contractType: 0,
    vacantType: 0,
    schedule: '',
    boss: '',
    idBoss: 0,
    idSalaryCategory: 0,
    idCampus: 0,
    user: 0,
    confirmed: false
  };

  public empresas: Empresa[];
  gerencias:[]; 
  areas: Areas[];
  subAreas: Areas[];
  lstSede: any[] = [];
  lstcategorias: any[] = [];
  constCenter: any[] = [];
  public lstTipoDocumento:any;
  
  dateEnd: any;
  dateIncome: any;
  dateBirth: any;
  listHorarios: any[];
  listHorariosSelected: any[];
  
  constructor(    
    private empresaService: EmpresaService,
    private areaService: AreaService,
    private _employeeService: EmployeeService,
    private salaryBandService: SalaryBandService,
    private masterService: MastertableService,
    private _serviceUtil: UtilService,
    public _dialog: MatDialog,
    private personService: InformationPostulantService
  ) { }

  ngOnInit(): void {
    this.loadInformationPostulantRequest();
  }

  
 loadInformationPostulantRequest() {
  this.loadDocumentsTypes();
  this.loadEmpresas();
  this.GetListHorarios();
  this.loadSede();
  this.getListGroupSalary();
  this.getConstcenter();
  this.GetInformationPostulantRequest(this.filter);
}

loadEmpresas() {
  let idUser =0; 
    const payload = {
      IdUser: idUser
    }
    this.areaService.getCompanyByUser(payload).subscribe((res) => {
      this.empresas = res.data;
    });
}

changeEmpresa(): void {
  this.loadGerencia();
  this.SendParentInformation();
  this.getConstcenter();
} 

loadGerencia() {
  const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
  let idUser = storage.id;
  const payload = {
    IdCompany: Number(this.postulantRequest.idCompany),
    IdUser:idUser
  }
  this.areaService.getGerenciasByUser(payload).subscribe((res) => {
    this.gerencias = res.data;
  });
}

changeGerencia(): void {
  this.loadAreas();
  this.SendParentInformation();
}

loadAreas() {
  const payload = {
    IdArea: Number(this.postulantRequest.idManagement)
  }
  this.areaService.getSubAreasByArea(payload).subscribe((res) => {
    this.areas= res.data;
  });
}

changeArea(): void {
  this.loadSubAreas();
  this.SendParentInformation();
}

loadSubAreas() {
  const payload = {
    IdArea: Number(this.postulantRequest.idArea)
  }
  this.areaService.getSubAreasByArea(payload).subscribe((res) => {
    this.subAreas= res.data;
  });
}

loadSede() {
  this._employeeService.ListGeneric(990).subscribe((res) => {
    this.lstSede = res;
  });
}

getListGroupSalary() {
  this.salaryBandService.getListGroupSalary().subscribe((resp) => {
    this.lstcategorias = resp.data;
  });
}

getConstcenter(): void {
  this._serviceUtil.getCostCenter(this.postulantRequest.idCompany).subscribe(resp => this.constCenter = resp);
}

loadDocumentsTypes() {
  this.masterService.getByIdFather(50).subscribe(res => {
    this.lstTipoDocumento = res;
    
  })
}

openDialogAssignBoss(): void {
  const dialogRef = this._dialog.open(ModalBossComponent, {
    width: '656px',
    height:'420px',
    data:{message: "Asignar Jefe", result: true, idBossArea: 0, textButton: "Aceptar", nameBoss: ''},
  });

  dialogRef.afterClosed().subscribe(resp => {
    if(resp.result){
      this.postulantRequest.idBoss = resp.idBossArea;
      if (resp.nameBoss !== ''){
        this.postulantRequest.boss = resp.nameBoss;
      };
      this.SendParentInformation();
    }
  });
}

GetInformationPostulantRequest(filter: any) {
  this.personService.GetPostulantRequest(filter).subscribe(res => {
    
    if(res.data != null) {
      this.postulantRequest = res.data;
      
      if(this.postulantRequest.birthDate != null && this.postulantRequest.birthDate != "") {
        const fechaBirth = this.postulantRequest.birthDate.split("/");
        const dayBirth = Number(fechaBirth[0]);
        const monthBirth = Number(fechaBirth[1]);
        const yearBirth = Number(fechaBirth[2]);
        const fechaBirthDate = new Date(yearBirth, monthBirth - 1, dayBirth);
        this.dateBirth = fechaBirthDate;
      }

      
      if(this.postulantRequest.incomeDate != null && this.postulantRequest.incomeDate != "") {
        const fechaStart = this.postulantRequest.incomeDate.split("/");
        const dayStart = Number(fechaStart[0]);
        const monthStart = Number(fechaStart[1]);
        const yearStart = Number(fechaStart[2]);
        const fechaStartDate = new Date(yearStart, monthStart - 1, dayStart);
        this.dateIncome = fechaStartDate;
      }

      if(this.postulantRequest.endDate != null && this.postulantRequest.endDate != "") {
        const fechaEnd = this.postulantRequest.endDate.split("/");
        const day = Number(fechaEnd[0]);
        const month = Number(fechaEnd[1]);
        const year = Number(fechaEnd[2]);
        const fechaEndDate = new Date(year, month - 1, day);
        this.dateEnd = fechaEndDate;
      }
      
      if (this.postulantRequest.idCompany > 0) {
        this.changeEmpresa();
        this.changeGerencia();
        this.getConstcenter();
      };
    }
  });
}

valideKey(evt) {
    
    var code = evt.which ? evt.which : evt.keyCode;

    if (code == 8) {
      
      return true;
    } else if (code >= 48 && code <= 57) {
      
      return true;
    } else {
      
      return false;
    }
  }
  
  SendParentInformation() {
    
    if(this.dateIncome != null && typeof this.dateIncome != 'undefined') {
      this.postulantRequest.incomeDate = _moment(this.dateIncome).format(
        "DD/MM/YYYY"
      );
    }
    if(this.dateEnd != null && typeof this.dateEnd != 'undefined') {
      this.postulantRequest.endDate = _moment(this.dateEnd).format(
        "DD/MM/YYYY"
      );
    }
    if(this.dateBirth != null && typeof this.dateBirth != 'undefined') {
      this.postulantRequest.birthDate = _moment(this.dateBirth).format(
        "DD/MM/YYYY"
      );
    }
    this.updateModel.emit(this.postulantRequest);
  }
  
  GetListHorarios() {
    this._employeeService.ListGenericByKey(environment.keyHorarioExactus).subscribe(resp => {
      this.listHorarios = resp;
      this.listHorariosSelected = this.listHorarios;
      
    })
  }

  onKeyHorario(value) { 
    this.listHorariosSelected = this.searchHorario(value);
  }

  searchHorario(value: string) { 
    let filter = value.toLowerCase();
    return this.listHorarios.filter(option => (option.sshort_value + ' - '+ option.sdescription_value).toLowerCase().includes(filter));
  }
}
