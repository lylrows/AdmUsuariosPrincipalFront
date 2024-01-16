import { MatSnackBar } from "@angular/material/snack-bar";
import { InformationPostulantAllDto } from "./../../../../../data/schema/info-postulant";
import { PostulantDto } from "@app/data/schema/Postulant/postulant";
import { InformationPostulantService } from "./../../../../../data/service/information-postulant.service";
import { UtilService } from "@app/data/service/util.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Route } from "@angular/router";
import { InformationAditionalDto } from "@app/data/schema/info-adicional-postulant";
import { isThisSecond } from "date-fns/esm";
import { InformationExtraDto } from "@app/data/schema/info-extra-postulant";
import { ConfirmDialogComponent } from "../recruitment-detail/dialog/confirm-dialog/confirm-dialog.component";
import { MastertableService } from "@app/data/service/mastertable.service";
import * as _moment from "moment";
import { AppConfirmService } from "@app/shared/services/app-confirm/app-confirm.service";
import { NotificationService } from "@app/data/service/notification.service";

@Component({
  selector: "app-information-general-postulant",
  templateUrl: "recruitment-information-postulant.component.html",
  styleUrls: ["recruitment-information-postulant.component.scss"],
})
export class RecruitmentInformationPostulantComponent implements OnInit {
  sex: any[] = [];
  nacionality: any[] = [];
  civil: any[] = []; 
  person: PostulantDto=
  {
    firstName:'',
    lastName:''
  };
  idPerson: number;
  idEvaluation: number;
  lstinfo= {
    informationFamilyDtos:null

  } as InformationPostulantAllDto;
  birthdate: Date;
  lstwork: any[] = [];
  infoadicional: InformationAditionalDto = {
    id: null,
    idPostulant: null,
    question1: null,
    question2: null,
    question3: null,
    question4: null,
    question5: null,
    espectativeSalary: null,
    bruto: null,
    neto: null,
  };
  infoextra: InformationExtraDto = {
    id: null,
    idPostulant: null,
    afp: null,
    auto: null,
    bankAfp: null,
    bankHaberes: null,
    bankOpen: null,
    categoryBrevete: null,
    company: null,
    createBcp: null,
    moto: null,
    nombreContacto: null,
    nroReferenciaContacto: null,
    parentescoContacto: null,
    placeOfBirth: null,
    rucNumber: null,
    typeSangre: null,
    age: null,
    idDocumentType: null,
    disclaimer: false,
    hasMobility: false,
    hasDisability: false,
    sent: false
  }
  firstDot:boolean = true;
  tipoSalario='';
  hasMovility: boolean = false;
  hasDisability: boolean = false;
  listFiles: any[] = [];
  tipoFile_DocumentoCasado: string = 'DOCUMENTO_CASADO';
  tipoFile_DocumentoCopiaDNI: string = 'DOCUMENTO_COPIA_DNI';
  tipoFile_DocumentoReciboServicio: string = 'DOCUMENTO_COPIA_RECIBO_SERVICIO';
  tipoFile_DocumentoDiscapacidad: string = 'DOCUMENTO_DISCAPACIDAD';
  tipoFile_DocumentoAdicional: string = 'DOCUMENTO_ADICIONAL';
  tooltip_DocumentoCasado: string = 'Adjuntar Documento de Partida';
  tooltip_DocumentoCopiaDNI: string = 'Adjuntar Copia de DNI';
  tooltip_DocumentoReciboServicio: string = 'Adjuntar Copia de Recibo de Servicio';
  tooltip_DocumentoDiscapacidad: string = 'Adjuntar Sustento de Discapacidad';
  filename_DocumentoCasado: string = '';
  path_DocumentoCasado: string = '';
  filename_DocumentoCopiaDNI: string = '';
  path_DocumentoCopiaDNI: string = '';
  filename_DocumentoReciboServicio: string = '';
  path_DocumentoReciboServicio: string = '';
  filename_DocumentoDiscapacidad: string = '';
  path_DocumentoDiscapacidad: string = '';
  isDNI: boolean = false;
  isCasado: boolean = false;
  public lstTipoDocumento:any;
  listDocumentosAdicionales: any[] = [];
  dateBirth: any;
  dateIncomeCountry: any;
  showRequiredFileDomicio: boolean = false;
  showRequiredFileDNI: boolean = false;
  showRequiredFileMarried: boolean = false;
  showRequiredFileDisability: boolean = false;
  rowDocumentoAdicional: any;
  expandedSectionFicha: boolean = false;
  expandedSectionDatosFamiliares: boolean = false;
  expandedSectionFormacionAcademica: boolean = false;
  expandedSectionExperienciaLaboral: boolean = false;
  expandedSectionDocumentosAdicionales: boolean = false;
  maxlenghDoc:number = 8;
  responsive = false;
  screenWidth: number;
  errorAdjunto = false;

  constructor(
    private _serviceUtil: UtilService,
    private personService: InformationPostulantService,
    private route: ActivatedRoute,
    private masterService:MastertableService,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private notificationService: NotificationService
  ) {
      this.screenWidth = window.innerWidth;
        if (this.screenWidth < 600){
        this.responsive = true; 
      } 
  }

  ngOnInit() {
    this.loadDocumentsTypes();
    this.route.paramMap.subscribe((params: any) => {
      if (params) {
        this.idPerson = parseFloat(params.get("id"));
        this.idEvaluation = parseFloat(params.get("idEvaluation"));
        this.getPerson(this.idPerson);
        this.getInfoAll(this.idPerson, this.idEvaluation);
      }
    });
    this.getSex();
    this.getNationality();
    this.getCivil();
  }

  loadDocumentsTypes() {
    this.masterService.getByIdFather(50).subscribe(res => {
      this.lstTipoDocumento = res;
      
    })
  }

  getSex(): void {
    this._serviceUtil.getSex().subscribe((resp) => (this.sex = resp));
  }

  getNationality(): void {
    this._serviceUtil
      .getNationality()
      .subscribe((resp) => (this.nacionality = resp));
  }

  getCivil(): void {
    this._serviceUtil.getCivil().subscribe((resp) => (this.civil = resp));
  }

  getPerson(idperson) {
    this.personService.getInfoPerson(idperson).subscribe((res) => {
      this.person = res.data;
      
      
      if (this.person.birthDate != null && typeof this.person.birthDate != 'undefined'){
        const fechaBirth = this.person.birthDate.split("/");
        const dayBirth = Number(fechaBirth[0]);
        const monthBirth = Number(fechaBirth[1]);
        const yearBirth = Number(fechaBirth[2]);
        const fechaDateBirth = new Date(yearBirth, monthBirth - 1, dayBirth);
        this.dateBirth = fechaDateBirth;
      } 
      this.ChangeCivilStatus();
    });
  }

  getInfoAll(idperson, idEvaluation) {
    
    this.personService.getInfoAll(idperson, idEvaluation).subscribe((res) => {
      
      this.lstinfo = res.data;
      /** 
      this.lstinfo.informationFamilyDtos.map(x => {
        x.disabled = true;
        x.tryToSendAndShowError = typeof x.tryToSendAndShowError == 'undefined' ? false : x.tryToSendAndShowError;
     });*/
      try
      {
        const infoAditional = this.lstinfo.informationAditionalDtos;
        if(infoAditional != null){
           this.infoadicional = infoAditional;
           if (this.infoadicional.bruto === true)
           {
            this.tipoSalario='bruto';
           }else{
            this.tipoSalario='neto';
           }
          }


        const infoExtra = this.lstinfo.informationExtraDto;
        
        const lstDocumentos = this.lstinfo.listaDocumentos;
        if (infoExtra  != null)
        {
          this.infoextra = infoExtra;
          this.hasDisability = this.infoextra.hasDisability;
          this.hasMovility = this.infoextra.hasMobility;
          if (this.infoextra.incomeCountryDate != null && typeof this.infoextra.incomeCountryDate != 'undefined'){
            const fechaIncome = this.infoextra.incomeCountryDate.split("/");
            const dayIncome = Number(fechaIncome[0]);
            const monthIncome = Number(fechaIncome[1]);
            const yearIncome = Number(fechaIncome[2]);
            const fechaIncomeDate = new Date(yearIncome, monthIncome - 1, dayIncome);
            this.dateIncomeCountry = fechaIncomeDate;
          }
          if (this.infoextra.idDocumentType == 0) {
            this.infoextra.idDocumentType = this.person.idTypeDocument;
          }
          this.ChangeDocumentType();
        }

        
        if (lstDocumentos != null) {
          this.listFiles = lstDocumentos;
          this.SetFilesNamesPathDocuments();
          if (lstDocumentos.length < 2) {
              this.SetearArrayInicial(this.listFiles[0]);
          }
        } else this.SetearArrayInicial(null); 
        this.listDocumentosAdicionales = this.lstinfo.listaDocumentosAdicionales;
        this.listDocumentosAdicionales.map(x => x.disabled = true);
        const typeDoc = this.lstTipoDocumento.find(x => x.id == this.infoextra.idDocumentType);
        this.lstinfo.informationEducationDtos.sort( function(a,b){ b.dateStart -  a.dateStart});
        switch(typeDoc.shortValue) {
          case "01":
            this.maxlenghDoc = 8;
            break;
          case "04":
            this.maxlenghDoc = 12;
            break;
          case "06":
            this.maxlenghDoc = 11;
            break;
          case "07":
            this.maxlenghDoc = 12;
            break;
          case "09":
              this.maxlenghDoc = 15;
          break;
          case "11":
              this.maxlenghDoc = 15;
          break;
          case "22":
            this.maxlenghDoc = 15;
          break;
    
          case "23":
            this.maxlenghDoc = 15;
          break;
          case "24":
            this.maxlenghDoc = 15;
          break;
        }
      }
      catch(e){console.log(e)}
    });
  }

  updatelisteducation($event) {
    this.lstinfo.informationEducationDtos = $event;
  }

  updatelistwork($event) {
    this.lstinfo.informationWorkDtos = $event;
  }

  updatelistskills($event) {
    this.lstinfo.informationComputerSkillsDtos = $event;
  }

  updatelistlang($event) {
    this.lstinfo.informationLangDtos = $event;
  }

  updatelistfamily($event) {
    this.lstinfo.informationFamilyDtos = $event;
  }

  changesueldo($event) {
    if ($event.value == "bruto") {
      this.infoadicional.bruto = true;
      this.infoadicional.neto = false;
    } else {
      this.infoadicional.bruto = false;
      this.infoadicional.neto = true;
    }
  }


  valideKey(evt) {
    
    var code = evt.which ? evt.which : evt.keyCode;

    if (code == 8) {
        
        return true;
    } else if (code >= 48 && code <= 57 ) {
        
        
        return true;
    }
    else if(code == 46)
    {
        
        try{
          if(this.infoadicional.espectativeSalary.split('.').length>1) {
            return false;
            
          }
          else
            return true;
        }
        catch(e) {}
    } else {
        
        return false;
    }
  }

  submit(send: boolean) {
    this.errorAdjunto = false;
    if(send){
      const _result = this.ValidarEnvio();
      if (!_result.isValid){
        this.snack.open(_result.mensaje, "OK", { duration: 4000 });
        return;
      }      
    }
    
    if(this.dateBirth != null && typeof this.dateBirth != 'undefined') {
      this.person.birthDate = _moment(this.dateBirth).format("DD/MM/YYYY");
    }
    if(this.dateIncomeCountry != null && typeof this.dateIncomeCountry != 'undefined') {
      this.infoextra.incomeCountryDate = _moment(this.dateIncomeCountry).format("DD/MM/YYYY");
    }
    this.infoextra.sent = send;
    this.infoadicional.idPostulant = this.idPerson;
    this.lstinfo.informationAditionalDtos = this.infoadicional;
    this.lstinfo.informationPerson = this.person;
    this.infoextra.idPostulant = this.idPerson;
    this.infoextra.hasDisability = this.hasDisability;
    this.infoextra.hasMobility = this.hasMovility;
    this.lstinfo.informationExtraDto = this.infoextra; 
    this.lstinfo.listaDocumentos =  this.listFiles;
    this.lstinfo.listaDocumentosAdicionales =  this.listDocumentosAdicionales;
    this.lstinfo.idEvaluation = this.idEvaluation;

    if(send) {
      this.confirmService
        .confirm({
          title: "Confirmación",
          message: "¿Esta seguro de enviar la Información?",
        })
        .subscribe((result) => {
          if (result) {
            this.personService.saveinformation(this.lstinfo).subscribe((data) => {
              if (data.stateCode == 200) {           
                this.SendNotification();     
                if(send) this.snack.open("Se envío la información correctamente", "OK", { duration: 4000 });
                else this.snack.open("Grabado correctamente", "OK", { duration: 4000 });
              } else {
                this.snack.open(data.messageError[0], "Error", { duration: 4000 });
              }
            });
          } else {
            this.infoextra.sent = false;
          }
        })
    } else {
      this.personService.saveinformation(this.lstinfo).subscribe((data) => {
        if (data.stateCode == 200) {
          this.snack.open("Grabado correctamente", "OK", { duration: 4000 });
        } else {
          this.snack.open(data.messageError[0], "Error", { duration: 4000 });
        }
      });
    }
  }

  
  checkMovilidad($event, type: number) {
    if (type == 1) {
      if ($event.checked) this.hasMovility = true;
      else this.hasMovility = false;
    } else {
      if ($event.checked) this.hasMovility = false;
      else this.hasMovility = true;
    }
  }

  checkDiscapacidad($event, type: number) {
    if (type == 1) {
      if ($event.checked) this.hasDisability = true;
      else this.hasDisability = false;
    } else {
      if ($event.checked) this.hasDisability = false;
      else this.hasDisability = true;
    }
  }

  CargarDocumento(eventoRetorno) {
    if(this.listFiles == null || typeof this.listFiles == 'undefined') this.listFiles = [];
    const _indexExistente = this.listFiles.findIndex(x => x.tipo_archivo == eventoRetorno.tipo_archivo);
    

    if(eventoRetorno.archivo != null) {
      
      this.listFiles[_indexExistente].archivo_base64 = eventoRetorno.archivo_base64;
      this.listFiles[_indexExistente].filename = eventoRetorno.file_name;
      this.listFiles[_indexExistente].extension = eventoRetorno.extension;
      this.listFiles[_indexExistente].ruta_archivo = '';
      switch(eventoRetorno.tipo_archivo) {
        case this.tipoFile_DocumentoReciboServicio:
          this.showRequiredFileDomicio = false;
          break;
        case this.tipoFile_DocumentoCopiaDNI:
          this.showRequiredFileDNI = false;
          break;
        case this.tipoFile_DocumentoCasado:
          this.showRequiredFileMarried = false;
          break;
        case this.tipoFile_DocumentoDiscapacidad:
          this.showRequiredFileDisability = false
          break;
      }
    } else {
      switch(eventoRetorno.tipo_archivo) {
        case this.tipoFile_DocumentoReciboServicio:
          this.filename_DocumentoReciboServicio = '';
          this.path_DocumentoReciboServicio = '';
          break;
        case this.tipoFile_DocumentoCopiaDNI:
          this.filename_DocumentoCopiaDNI = '';
          this.path_DocumentoCopiaDNI = '';
          break;
        case this.tipoFile_DocumentoCasado:
          this.filename_DocumentoCasado = '';
          this.path_DocumentoCasado = '';
          break;
        case this.tipoFile_DocumentoDiscapacidad:
          this.filename_DocumentoDiscapacidad = '';
          this.path_DocumentoDiscapacidad = '';
          break;
      }
      
      this.listFiles[_indexExistente].archivo_base64 = '';
      this.listFiles[_indexExistente].filename = '';
      this.listFiles[_indexExistente].extension = '';
      this.listFiles[_indexExistente].ruta_archivo = '';
    }
    
  }
  OnChangeDocumentType(){
   this.person.documentNumber = "";
   this. ChangeDocumentType();
  }


  ChangeDocumentType() { 
    const _obj = this.lstTipoDocumento.filter(x => x.id == this.infoextra.idDocumentType);
    if (_obj != null && typeof _obj != 'undefined') {
      if (_obj.length == 0) return;
      const cod_exactus = _obj[0].shortValue;
      this.isDNI = cod_exactus == '01';
      if (!this.isDNI) {
        this.DeleteFileByType(this.tipoFile_DocumentoCopiaDNI);
      } else {
        this.dateIncomeCountry = null;
        this.infoextra.incomeCountryDate = "";
      }
    }  
    const typeDoc = this.lstTipoDocumento.find(x => x.id == this.infoextra.idDocumentType);
    switch(typeDoc.shortValue) {
      case "01":
        this.maxlenghDoc = 8;
        break;
      case "04":
        this.maxlenghDoc = 12;
        break;
      case "06":
        this.maxlenghDoc = 11;
        break;
      case "07":
        this.maxlenghDoc = 12;
        break;
      case "09":
          this.maxlenghDoc = 15;
      break;
      case "11":
          this.maxlenghDoc = 15;
      break;
      case "22":
        this.maxlenghDoc = 15;
      break;

      case "23":
        this.maxlenghDoc = 15;
      break;
      case "24":
        this.maxlenghDoc = 15;
      break;
    }
   
  }

  DeleteFileByType(type_file: string){
    const _indexExistente = this.listFiles.findIndex(x => x.tipo_archivo == type_file);
    if (_indexExistente > -1) this.listFiles.splice(_indexExistente, 1);
  }

  ChangeCivilStatus() {
    this.isCasado = this.person.idCivilStatus == 16;
    if (!this.isCasado) {
      this.DeleteFileByType(this.tipoFile_DocumentoCasado);
    }
  }

  ValidarEnvio() : any {
    this.expandedSectionFicha = false;
    this.expandedSectionDatosFamiliares = false;
    this.expandedSectionFormacionAcademica = false;
    this.expandedSectionExperienciaLaboral = false;
    this.expandedSectionDocumentosAdicionales = false;
    let isValid = true;
    let mensaje = "";
    if (this.IsNullOrEmptyOrUndefined(this.person.firstName)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.person.lastName)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.person.motherLastName)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.person.address)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.person.cellPhone)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.person.email)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.person.birthDate)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.infoextra.idDocumentType)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.person.documentNumber)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.person.idCivilStatus)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.infoextra.bankHaberes)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.infoextra.bankAfp)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.infoextra.afp)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.infoextra.typeSangre)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.infoextra.nombreContacto)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.infoextra.nroReferenciaContacto)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.infoextra.parentescoContacto)) isValid = false; 
    if (!isValid) {
      mensaje = "Debe completar todos los datos obligatorios";
      return {
        isValid,
        mensaje
      }
    }

    
    var _objDomicilio = this.listFiles.find(x => x.tipo_archivo == this.tipoFile_DocumentoReciboServicio);
    if ((_objDomicilio.archivo_base64 == null || _objDomicilio.archivo_base64 == '') && (_objDomicilio.ruta_archivo == null ||
    _objDomicilio.ruta_archivo == '')) {
      isValid = false; this.showRequiredFileDomicio = true;
      this.expandedSectionFicha = true;
    }

    if (this.isDNI) {
      var _objDNI = this.listFiles.find(x => x.tipo_archivo == this.tipoFile_DocumentoCopiaDNI);
      if ((_objDNI.archivo_base64 == null || _objDNI.archivo_base64 == '') && (_objDNI.ruta_archivo == null ||
        _objDNI.ruta_archivo == '')) {
        isValid = false; this.showRequiredFileDNI = true;
        this.expandedSectionFicha = true;
      }
    }    

    if (this.isCasado) {
      var _objCasado = this.listFiles.find(x => x.tipo_archivo == this.tipoFile_DocumentoCasado);
      if ((_objCasado.archivo_base64 == null || _objCasado.archivo_base64 == '') && (_objCasado.ruta_archivo == null ||
        _objCasado.ruta_archivo == '')) {
        isValid = false; this.showRequiredFileMarried = true;
        this.expandedSectionFicha = true;
      }
    }

    if (this.hasDisability) {
      var _objDisability = this.listFiles.find(x => x.tipo_archivo == this.tipoFile_DocumentoDiscapacidad);
      if ((_objDisability.archivo_base64 == null || _objDisability.archivo_base64 == '') && (_objDisability.ruta_archivo == null ||
        _objDisability.ruta_archivo == '')) {
        isValid = false; this.showRequiredFileDisability = true;
        this.expandedSectionFicha = true;
      }
    }

    
    this.lstinfo.informationFamilyDtos.map(x => {
      x.tryToSendAndShowError = x.informationFile == null;
      if (x.informationFile == null) {
        isValid = false;
        this.expandedSectionDatosFamiliares = true;
      }
    });
    
    this.lstinfo.informationEducationDtos.map(x => {
      x.tryToSendAndShowError = x.informationFile == null;
      if (x.informationFile == null) {
        isValid = false;
        this.expandedSectionFormacionAcademica = true;
      }
    });
    
    this.lstinfo.informationWorkDtos.map(x => {
      x.tryToSendAndShowError = x.informationFile == null;
      if (x.informationFile == null) {
        isValid = false;
        this.expandedSectionExperienciaLaboral = true;
      }
    });
    
    this.listDocumentosAdicionales.map(x => {
      if (x.indicadorFile) {
        let _isNotDocument = (x.nombreFile == null || x.nombreFile == '') && (x.fileBase64 == null || x.fileBase64 == '');
        x.tryToSendAndShowError = _isNotDocument;
        if (_isNotDocument) {
          isValid = false;
          this.expandedSectionDocumentosAdicionales = true;
        }
      }
    });
    

    if (!isValid) {
      mensaje = "Debe cargar todos los documentos obligatorios";
      this.errorAdjunto = true;
    }
    return {
      isValid,
      mensaje
    }
  }

  SetearArrayInicial(obj) {
    
    if(this.listFiles == null || typeof this.listFiles == 'undefined') this.listFiles = [];
    this.listFiles = [];
    var _objFile = {
      nidinformationfile: 0,
      tipo_archivo: this.tipoFile_DocumentoCasado,
      archivo_base64: '',
      filename: '',
      extension: '',
      ruta_archivo: ''
    };

    var _obj2 = Object.assign({}, _objFile);
    var _obj3 = Object.assign({}, _objFile);
    var _obj4 = Object.assign({}, _objFile);
    if(obj == null){
      _obj4.tipo_archivo = this.tipoFile_DocumentoDiscapacidad;
      this.listFiles.push(_obj4);
    } else {
      this.listFiles.push(obj);
    }
    this.listFiles.push(_objFile);
    _obj2.tipo_archivo = this.tipoFile_DocumentoCopiaDNI;
    this.listFiles.push(_obj2);
    _obj3.tipo_archivo = this.tipoFile_DocumentoReciboServicio;
    this.listFiles.push(_obj3);
    
  }

  IsNullOrEmptyOrUndefined(value: any) : boolean {
    if (value == null || value == "" || value == '0' || typeof value == 'undefined') return true;
    return false;
  }

  SetFilesNamesPathDocuments(){
    if (this.listFiles == null || typeof this.listFiles == 'undefined') return;
    let _index = 0;
    
    _index = this.listFiles.findIndex(x => x.tipo_archivo == this.tipoFile_DocumentoReciboServicio);
    if (_index > -1) {
      this.filename_DocumentoReciboServicio = this.listFiles[_index].filename;
      this.path_DocumentoReciboServicio = this.listFiles[_index].ruta_archivo;
    }
    
    _index = 0;
    _index = this.listFiles.findIndex(x => x.tipo_archivo == this.tipoFile_DocumentoCopiaDNI);
    if (_index > -1) {
      this.filename_DocumentoCopiaDNI = this.listFiles[_index].filename;
      this.path_DocumentoCopiaDNI = this.listFiles[_index].ruta_archivo;
    }
    
    _index = 0;
    _index = this.listFiles.findIndex(x => x.tipo_archivo == this.tipoFile_DocumentoCasado);
    if (_index > -1) {
      this.filename_DocumentoCasado = this.listFiles[_index].filename;
      this.path_DocumentoCasado = this.listFiles[_index].ruta_archivo;
    }
    
    _index = 0;
    _index = this.listFiles.findIndex(x => x.tipo_archivo == this.tipoFile_DocumentoDiscapacidad);
    if (_index > -1) {
      this.filename_DocumentoDiscapacidad = this.listFiles[_index].filename;
      this.path_DocumentoDiscapacidad = this.listFiles[_index].ruta_archivo;
    }
  }

  CargarDocumentoAdicional(eventoRetorno) {    
    
    if(eventoRetorno.archivo != null) {
      this.listDocumentosAdicionales.map(x => {
        if (x.idMaster == eventoRetorno.tipo_archivo) {
          x.nombreFile = eventoRetorno.file_name;
          x.fileBase64 = eventoRetorno.archivo_base64;
          x.tryToSendAndShowError = false;
        }
      });
    } else {
      this.listDocumentosAdicionales.map(x => {
        if (x.idMaster == eventoRetorno.tipo_archivo) {
          x.nombreFile = '';
          x.fileBase64 = '';
          x.tryToSendAndShowError = false;
        }
      });
    }
    
  }

  checkDocumentoAdicional($event, item) {
    item.checked = $event.checked;
  }

  
  descargarPlantilla(item) {
    const _ext = this.GetFileExtension(item.pathPlantilla);
    let contentType = '';
    switch(_ext) {
      case 'pdf':
        contentType = 'application/pdf';
        break;
      case 'doc':
      case 'docx':
        contentType = 'application/octet-stream';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'jpg':
        contentType = 'image/jpg';
        break;
      case 'xlsx':
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
    }

    this._serviceUtil.downloadDocumentByPath({
      path_file: item.pathPlantilla
    }).subscribe(res => {
          const b64Data = res.data;          
          const blob = this.b64toBlob(b64Data, contentType);          
          const blobUrl = URL.createObjectURL(blob);          
          const _afile = document.getElementById('afile') as HTMLAnchorElement;
          _afile.href = blobUrl;
          _afile.download = item.document + '.' + _ext;
          _afile.click();
          window.URL.revokeObjectURL(blobUrl);
    });
  }

  GetFileExtension(filename: string) {
    const _lastIndex = filename.lastIndexOf('.');
    const _ext = filename.substring(_lastIndex + 1);
    return _ext;
  };

  b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  onEditAditionalDocument(item, index) {
    this.rowDocumentoAdicional = Object.assign({}, item);
    this.listDocumentosAdicionales[index].disabled = false;
  }

  isDisabledRow(row: any){
    if (row == null || typeof row == 'undefined') return true;
    if (row.disabled == null || typeof row.disabled == 'undefined') return true;
    return row.disabled;
  }

  onCancelAditionalDocument(index){
    
    this.listDocumentosAdicionales[index] = this.rowDocumentoAdicional;
    this.rowDocumentoAdicional = null;
  }

  onSaveAditionalDocument(item, index) {
    var _obj = this.listDocumentosAdicionales[index];
    if (_obj.indicadorFile) {
      let _isNotDocument = (_obj.nombreFile == null || _obj.nombreFile == '') && (_obj.fileBase64 == null || _obj.fileBase64 == '');
      if (_isNotDocument) {
        this.snack.open("Debe adjuntar el documento solicitado", "OK", { duration: 4000 });
        return;
      }
    }    
    this.listDocumentosAdicionales[index].disabled = true;
    this.lstinfo.listaDocumentosAdicionales =  this.listDocumentosAdicionales;
    this.lstinfo.listaDocumentosAdicionales.map(x => {
      x.IdEvaluation = this.idEvaluation,
      x.IdPostulant = this.idPerson
    });
    this.personService.saveAditionalDocuments(this.lstinfo.listaDocumentosAdicionales).subscribe((data) => {
      
    });
  }

  validateShowErrorFile(row: any){
    if(!row.indicadorFile) return false;
    if (row == null || typeof row == 'undefined') return false;
    if (row.tryToSendAndShowError == null || typeof row.tryToSendAndShowError == 'undefined') return false;
    return row.tryToSendAndShowError;
  }

  SendNotification() {
    var _notification = {
      idEvaluation: this.idEvaluation,
      idPostulant: this.idPerson,
      postulantType: 'EXTERNA',
      level: 1,
      completeName: this.person.firstName + ' ' + this.person.lastName + ' ' + this.person.motherLastName
    };
    this.notificationService.AddNotificationFichaPersonal(_notification).subscribe(res => {
      
    });
  }
}
