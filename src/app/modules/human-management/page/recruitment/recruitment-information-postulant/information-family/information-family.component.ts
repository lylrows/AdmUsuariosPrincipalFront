import { MatSnackBar } from '@angular/material/snack-bar';
import { InformationPostulantService } from './../../../../../../data/service/information-postulant.service';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { UtilService } from '@app/data/service/util.service';
import * as moment from 'moment';
import { InformationFilesModel } from '@app/data/schema/files/informationfiles.model';

@Component({
    selector: 'app-information-family',
    templateUrl: 'information-family.component.html',
    styleUrls: ['information-family.component.scss']
})

export class InformationFamilyComponent implements OnInit {
    @Input() infofamily: any[] = [];
    @Input() idPostulant: number;
    @Input() idEvaluation: number;
    @Input() isReadOnly: boolean = false;
    @Output() afterchangerow = new EventEmitter();
    param: InformationFilesModel = new InformationFilesModel();

    constructor(private service: InformationPostulantService,
        private snack: MatSnackBar,
        private _utilService: UtilService) { }

    familytypelist: any[];
    typedocumentlist: any[];
    rowSelected: any;
    filaAgregadaModificada: boolean = false;
    index: number;
    listFiles: any[] = [];
    listFilesFamily: any[] = [];
    tipoFile_DocumentoCopiaDNI: string = 'DOCUMENTO_COPIA_DNI';
    maxlenghDoc:number = 0;
    ngOnInit() {
        this.getexactusfamilytype();
        this.loadInfoFamily();
        this.loadTypeDocument();
    }

    ngAfterViewChecked() {
        if (this.filaAgregadaModificada) {
            if (this.index == -1) {
                const _cantidad = this.infofamily.length;
                let _element = <HTMLElement>document.querySelectorAll('.init-edit')[_cantidad - 1];
                _element.click();
            } else {
                let _element = <HTMLElement>document.querySelectorAll('.init-edit')[this.index];
                _element.click();
            }
            this.filaAgregadaModificada = false;
        }
    }

    getexactusfamilytype(): void {
        this._utilService.getexactusfamilytype().subscribe((resp) => {
            this.familytypelist = resp.data;
        });
    }
    onRowEditInit(row, ri) {
        this.changetypeDoc(row);
        this.cloneFamily = { ...row };
        if (row.informationFile !== null) {
            this.listFilesFamily.push({
                tipo_archivo: row.informationFile.stypeFile,
                archivo_base64: '',
                filename: row.informationFile.snamefile,
                extension: 'pdf'
            });
        }
        this.rowSelected = Object.assign({}, row);
        this.index = ri;
        this.infofamily[ri].disabled = false;
        this.infofamily[ri].tryToSendAndShowError = false;
        this.cloneFamily = { ...row };
    }
    cloneFamily = null;

    onRowEditSave(item, action = '', index) {
        
        if (this.listFilesFamily.length === 0 && action != 'Eliminar') {
            this.snack.open("Debe adjuntar el documento solicitado.", "OK", { duration: 4000 });
            this.filaAgregadaModificada = true;
            this.listFilesFamily = [];
        }
        else {
            this.infofamily[index].disabled = true;
          
            
            if (action != 'Eliminar') {
                
                if (item.fullName == "" || item.lastName == "" ||
                    item.motherLastName == "" || item.documentNumber == "" ||
                    item.birthDate == null || item.birthDate == "") {
                    this.snack.open("Todos los datos son obligatorios", "OK", { duration: 4000 });
                    this.filaAgregadaModificada = true;
                    return;
                }

                const _date = moment(item.birthDate, 'YYYY-MM-DD');
                const nowDate = new Date();
                const _dateToday = moment(new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate()));
                if (_date > _dateToday) {
                    this.snack.open("La fecha de nacimiento no puede ser mayor a la fecha actual", "OK", { duration: 4000 });
                    
                    this.filaAgregadaModificada = true;
                    return;
                }

                if ((this.param.base64 == "" || this.param.base64 == null || typeof this.param.base64 == 'undefined') &&
                    (this.param.path_complete == "" || this.param.path_complete == null || typeof this.param.path_complete == 'undefined')) {
                    if (item.id == 0) this.infofamily.splice(index, 1);
                    
                }
            }
            this.service.saveinformationfamily(item).subscribe(res => {
                if (res.stateCode == 200) {
                    this.param.nidreferences = res.data.id;
                    if (this.param.nidreferences > 0) {
                        this.service.saveinformationfiles(this.param).subscribe(res => {
                            if (res.stateCode == 200) {
                               
                                
                                if (action === '') {
                                    this.snack.open("Grabado correctamente", "OK", { duration: 4000 });
                                } else {
                                    this.snack.open("Eliminado correctamente", "OK", { duration: 4000 });
                                }
                                this.listFilesFamily = [];
                                this.param = new InformationFilesModel();
                                this.loadInfoFamily();
                            }
                        });
                    }
                    else {
                        if (action === '') {
                            this.snack.open("Grabado correctamente", "OK", { duration: 4000 });
                        } else {
                            this.snack.open("Eliminado correctamente", "OK", { duration: 4000 });
                        }
                        this.loadInfoFamily();
                    }
                }
            });
        }
    }


   
    onRowEditCancel(item, ri) {
        if (item.id === 0) {
            this.infofamily.splice(ri, 1)
            this.cloneFamily = null; 
        }
        else{
            this.infofamily[ri] = this.cloneFamily;
            this.cloneFamily = null; 
            this.setValuesInitial(item);
        }
        this.infofamily[ri].disabled = true;
    } 

    setValuesInitial(item) {
        if (this.rowSelected != null) {
            item.familyType = this.rowSelected.familyType;
            item.fullName = this.rowSelected.fullName;
            item.lastName = this.rowSelected.lastName;
            item.motherLastName = this.rowSelected.motherLastName;
            item.birthDate = this.rowSelected.birthDate;
            item.documentNumber = this.rowSelected.documentNumber;
            item.typeDocument = this.rowSelected.typeDocument;
            item.informationFile = this.rowSelected.informationFile;
            item.disabled = true;
        }
       
    }

    loadInfoFamily() {
        this.service.getInfoFamily(this.idPostulant, this.idEvaluation).subscribe(res => {
            this.infofamily = res.data;
            this.infofamily.map(x => {
                x.disabled = true;
                x.tryToSendAndShowError = typeof x.tryToSendAndShowError == 'undefined' ? false : x.tryToSendAndShowError;
            });
            
            this.afterchangerow.emit(this.infofamily);
        })
    }

    loadTypeDocument() {
        this._utilService.getTypeDocument().subscribe((resp) => {
            this.typedocumentlist = resp;
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

    addRow() {
        
        let familytypedefault = this.familytypelist[0].code;
        const obj: any = {
            id: 0,
            kinship: "",
            idPostulant: this.idPostulant,
            fullName: "",
            birthDate: null,
            age: null,
            ocupation: "",
            company: "",
            lastName: "",
            motherLastName: "",
            familyType: familytypedefault,
            documentNumber: "",
            typeDocument: "01",
            informationFile: null,
            idEvaluation: this.idEvaluation
        };
        this.infofamily.push(obj);
        this.filaAgregadaModificada = true;
        this.index = -1;
        this.maxlenghDoc = 8;
    }

    deleteRow(index) {
        this.infofamily[index].familyType = "";
        this.param = new InformationFilesModel();
        this.listFilesFamily = [];
        this.onRowEditSave(this.infofamily[index], 'Eliminar', index);
    }


    CargarDocumento(eventoRetorno, idrefences, index) {
        if(eventoRetorno.file_name === null){
            this.listFilesFamily = [];
        }
        if (this.listFilesFamily == null || typeof this.listFilesFamily == 'undefined') this.listFilesFamily = [];
        const _indexExistente = this.listFilesFamily.findIndex(x => x.tipo_archivo == eventoRetorno.tipo_archivo);
        if (_indexExistente > -1) this.listFilesFamily.splice(_indexExistente, 1);

        if (eventoRetorno.archivo != null) {
            this.listFilesFamily.push({
                tipo_archivo: eventoRetorno.tipo_archivo,
                archivo_base64: eventoRetorno.archivo_base64,
                filename: eventoRetorno.file_name,
                extension: eventoRetorno.extension
            });
        }
        else{
            this.infofamily[index].informationFile.path_complete = null;
            this.infofamily[index].informationFile.snamefile = null;
        }
        this.param.nidinformationextra = this.idPostulant;
        this.param.nidreferences = idrefences;
        this.param.snamefile = eventoRetorno.file_name;
        this.param.ntypefile = 1;
        this.param.bactive = true;
        this.param.base64 = eventoRetorno.archivo_base64;
        this.param.stypeFile = eventoRetorno.tipo_archivo;
        this.param.path_complete = '';
        this.infofamily.map(x => x.tryToSendAndShowError = false);
    }

    isDisabledRow(row: any) {
        if (row == null || typeof row == 'undefined') return true;
        if (row.disabled == null || typeof row.disabled == 'undefined') return true;
        return row.disabled;
    }

    validateShowErrorFile(row: any) {
        if (row == null || typeof row == 'undefined') return false;
        if (row.tryToSendAndShowError == null || typeof row.tryToSendAndShowError == 'undefined') return false;
        return row.tryToSendAndShowError;
    }

    changetypeDoc(item:any){
        switch(item.typeDocument) {
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
    onchangeDocumentSelect(item:any){
        item.documentNumber = "";
        this.changetypeDoc(item);
    }
}