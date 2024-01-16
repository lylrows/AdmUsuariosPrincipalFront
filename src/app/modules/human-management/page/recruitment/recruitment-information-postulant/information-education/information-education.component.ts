import { MatSnackBar } from '@angular/material/snack-bar';
import { InformationPostulantService } from './../../../../../../data/service/information-postulant.service';
import { Input, Output, EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MastertableService } from '@app/data/service/mastertable.service';
import { InformationFilesModel } from '@app/data/schema/files/informationfiles.model';
import * as moment from 'moment';

@Component({
    selector: 'app-information-education',
    templateUrl: 'information-education.component.html',
    styleUrls: ['information-education.component.scss']
})

export class InformationEducationComponent implements OnInit {
    @Input() infoeducation: any;
    @Input() isReadOnly: boolean = false;
    @Input() idPostulant: number;
    @Input() idEvaluation: number;
    @Output() afterchangerow = new EventEmitter();
    constructor(private service: InformationPostulantService,
        private snack: MatSnackBar,
        private masterService: MastertableService,
    ) { 
        this.screenWidth = window.innerWidth;
        if (this.screenWidth < 600){
        this.responsive = true; 
        } 
    }

    lstInstruction: any[] = [];
    lstCycles: any[] = [];
    isNoConcluido: boolean = false;
    listFiles: any[] = [];
    listFilesEducation: any[] = [];
    param: InformationFilesModel = new InformationFilesModel();
    tipoFile_DocumentoSustento: string = 'DOCUMENTO_SUSTENTO';
    index: number;
    filaAgregadaModificada: boolean = false;
    datainfo:[];
    responsive = false;
    screenWidth: number;

    ngOnInit() {
        this.loadTypesInstruction();
        this.loadTypesCycles();
        this.loadInfoEducation();
    }

    ngAfterViewChecked() {
        if(this.filaAgregadaModificada) {
            if (this.index == -1) {
                const _cantidad = this.infoeducation.length;
                let  _element = <HTMLElement>document.querySelectorAll('.init-edit-studie')[_cantidad - 1];
                _element.click();                
            } else {
                let  _element = <HTMLElement>document.querySelectorAll('.init-edit-studie')[this.index];
                _element.click();     
            }
            this.filaAgregadaModificada = false;
        }
    }

    RoxIndexEducation = null;

    onRowEditSave(item, action = '', rowindex) {
        if (this.listFilesEducation.length === 0 && action != 'Eliminar') {
            this.snack.open("Debe adjuntar el documento solicitado.", "OK", { duration: 4000 });
            this.listFilesEducation = [];
            this.filaAgregadaModificada = true;
            this.index = rowindex;
        } else{
            this.infoeducation[rowindex].disabled = true;
            if (action === '') {
                //let carreras = this.infoeducation.filter(x => x.carrer === item.carrer && x.id === 0);
                let contador = 0;
                // let carreras = this.infoeducation.find(x => x.software === item.software && x.id !== 0 &&  x.id !== item.id);
                
                /**this.infoeducation.map(x => {
                    if (x.carrer === item.carrer && x.id !== 0 &&  x.id !== item.id) contador ++;
                });*/
                const data = this.infoeducation.filter(x => x.carrer === item.carrer);
                if (data.length >= 2) {
                    this.snack.open("No se puede agregar dos carreras iguales", "OK", { duration: 4000 });
                    this.RoxIndexEducation = rowindex;
                    this.filaAgregadaModificada = true;
                    this.index = rowindex;
                    return false;
                }

                const _date = moment(item.dateStart, 'YYYY-MM-DD');
                const nowDate = new Date();
                const _dateToday = moment(new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate()));
                if (_date > _dateToday) {
                    this.snack.open("La fecha de inicio no puede ser mayor a la fecha actual", "OK", { duration: 4000 });
                    // this.setValuesInitial(item);
                    this.RoxIndexEducation = rowindex;
                    this.filaAgregadaModificada = true;
                    this.index = rowindex;
                    return;
                }
            }
    
            item.isNoConcluido = this.isNoConcluido;
            this.service.saveinformationEducation(item).subscribe(res => {
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
                                this.listFilesEducation = [];
                                this.param = new InformationFilesModel();
                                this.loadInfoEducation();
                            }
                        });
                    }
                    else {
                        if (action === '') {
                            this.snack.open("Grabado correctamente", "OK", { duration: 4000 });
                        } else {
                            this.snack.open("Eliminado correctamente", "OK", { duration: 4000 });
                        }
                        this.listFilesEducation = [];
                        this.param = new InformationFilesModel();
                        this.loadInfoEducation();
                    }
                }
            });
        }
    }

    loadInfoEducation() {
        this.service.getInfoEducation(this.idPostulant, this.idEvaluation).subscribe(res => {
            this.infoeducation = res.data;
            this.infoeducation.map(x => {
                x.disabled = true;
                x.tryToSendAndShowError = typeof x.tryToSendAndShowError == 'undefined' ? false : x.tryToSendAndShowError;
                var item = this.lstCycles.find(o =>o.id == x.currentCycle);
                if(item !== undefined){
                    if(item.shortValue === "03"){
                        x.dateFinish = "";
                      }
                }
            });
            this.afterchangerow.emit(this.infoeducation);
        })
    }


    loadTypesInstruction() {
        this.masterService.getByIdFather(932).subscribe(res => {
            this.lstInstruction = res;
        })
    }
    loadTypesCycles() {
        this.masterService.getByIdFather(110).subscribe(res => {
            this.lstCycles = res;
        })
    }


    valideKey(evt) {
        // code is the decimal ASCII representation of the pressed key.
        var code = evt.which ? evt.which : evt.keyCode;

        if (code == 8) {
            // backspace.
            return true;
        } else if (code >= 48 && code <= 57) {
            // is a number.
            return true;
        } else {
            // other keys.
            return false;
        }
    }


    addRow() {
        let idInstructionDefault = this.lstInstruction[0].id;
        let currentCycleDefault = this.lstCycles[0].id;

        const obj: any = {
            instruction: '',
            city: '',
            studyCenter: '',
            speciality: '',
            dateStart: null,
            dateFinish: null,
            IdPostulant: this.idPostulant,
            idInstruction: idInstructionDefault,
            currentCycle: currentCycleDefault,
            id: 0,
            informationFile: null,
            idEvaluation: this.idEvaluation
        };
        this.infoeducation.push(obj);
        this.filaAgregadaModificada = true;
        this.index = -1;
    }

    deleteRow(index) {
        this.infoeducation[index].idInstruction = 0;
        this.param = new InformationFilesModel();
        this.onRowEditSave(this.infoeducation[index], 'Eliminar', index);
    }

    onRowEditCancel(item, index) {
        this.infoeducation[index].disabled = true;
        if (item.id === 0) {
            this.infoeducation.splice(index, 1)
            this.cloneEducation = null;
        } else {
            this.infoeducation[index] = this.cloneEducation;
            this.cloneEducation = null;
        }
    }

    onRowEditInit(item, index) {
        this.changeCurrentCycle(item.currentCycle);
        this.cloneEducation = { ...item };
        this.infoeducation[index].disabled = false;
        this.infoeducation[index].tryToSendAndShowError = false;
        if (item.informationFile !== null) {
            this.listFilesEducation.push({
                tipo_archivo: item.informationFile.stypeFile,
                archivo_base64: '',
                filename: item.informationFile.snamefile,
                extension: 'pdf'
            });
        }
    }

    changeCurrentCycle(currentCycle: number) {
        const item = this.lstCycles.find(x => x.id === currentCycle);
        if (item == null || typeof item == 'undefined') return;
        if (item.shortValue === '03') {
            this.isNoConcluido = true;
        }
        else {
            this.isNoConcluido = false;
        }
    }

    CargarDocumento(eventoRetorno, idrefences,index) {
        if(eventoRetorno.file_name === null){
            this.listFilesEducation = [];
        }
        if (this.listFilesEducation == null || typeof this.listFilesEducation == 'undefined') this.listFilesEducation = [];
        const _indexExistente = this.listFilesEducation.findIndex(x => x.tipo_archivo == eventoRetorno.tipo_archivo);
        if (_indexExistente > -1) this.listFilesEducation.splice(_indexExistente, 1);

        if (eventoRetorno.archivo != null) {
            this.listFilesEducation.push({
                tipo_archivo: eventoRetorno.tipo_archivo,
                archivo_base64: eventoRetorno.archivo_base64,
                filename: eventoRetorno.file_name,
                extension: eventoRetorno.extension
            });
        }
        else{
            this.infoeducation[index].informationFile.path_complete = null;
            this.infoeducation[index].informationFile.snamefile = null;
        }
        this.param.nidinformationextra = this.idPostulant;
        this.param.nidreferences = idrefences;
        this.param.snamefile = eventoRetorno.file_name;
        this.param.ntypefile = 2;
        this.param.bactive = true;
        this.param.base64 = eventoRetorno.archivo_base64;
        this.param.stypeFile = eventoRetorno.tipo_archivo;
        this.param.path_complete = '';
    }
    cloneEducation = null;

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
}