import { PostulantInternalDto, PostulantInternalInfoDto } from './../../../../../../../../data/schema/PostulantInternal/postulantInternal';
import { PostulantInfoDto } from './../../../../../../../../data/schema/Postulant/postulant';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EvaluationPostulantInternalService } from './../../../../../../../../data/service/evaluation-postulant-internal.service';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { EvaluationPostulantPositionDto } from '@app/data/schema/EvaluationInternal/evaluation-position';
import { MatTableDataSource } from '@angular/material/table';
import { listMonths, listYearsComplete } from '@app/data/schema/constants';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
    selector: 'app-evaluation-position',
    templateUrl: 'evaluation-position.component.html',
    styleUrls: ['./evaluation-position.component.scss']
})

export class EvaluationPositionComponent implements OnInit, OnChanges {
    @Input() idevaluation: number;
    @Input() model: EvaluationPostulantPositionDto;
    @Input() person: PostulantInternalInfoDto;
    @Output() sendaction = new EventEmitter();
 
    CargosDT: MatTableDataSource<any> = new MatTableDataSource([]);
    displayedColumnsCargo:string[]=[
        "cargo",
        "periodoinicio",
        "periodofin",
        "meses",
        "acciones"
      ];
    cargo: any = {};
    lstGeneral: Array<any> = [];
    contador: number = 1;
    listMonthsIni: any[];
    listYearsIni: any[];
    listMonthsEnd: any[];
    listYearsEnd: any[];

    constructor(private evaluationService: EvaluationPostulantInternalService, private snack: MatSnackBar) {        
      this.listMonthsIni = listMonths;
      this.listMonthsEnd = listMonths;
    
    }

    ngOnInit() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.model && changes.model.currentValue != undefined) {
            this.model = changes.model.currentValue;
            this.SetearAnhosPasados();
            this.lstGeneral = this.model.positionsCompany;
            this.CargosDT = new MatTableDataSource(this.lstGeneral);
        }

        if (changes.person && changes.person.currentValue != undefined) {
                this.model.evaluated = this.person.informationPersonal.sfirstname + ' ' + this.person.informationPersonal.slastname;
                if (this.model.actualPosition == '' || this.model.actualPosition == undefined) {
                    this.model.actualPosition = this.person.actualPosition;
                    this.lstGeneral = this.model.positionsCompany;
                }
                if (this.model.area == '' || this.model.area == undefined) {
                    this.model.area = this.person.actualArea;
                }

                if (this.model.company == '' || this.model.company == undefined) {
                    this.model.company = this.person.company;
                }

                if (this.model.dimissionDate == null || this.model.dimissionDate == undefined) {
                    this.model.dimissionDate = this.person.dateRegister;
                    this.SetearAnhosPasados();
                }

                if (this.model.postulatedPosition == '' || this.model.postulatedPosition == undefined) {
                    this.model.postulatedPosition = this.person.positionRequired;
                }
        }
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

    submit() {
        this.model.idEvaluationPostulant = this.idevaluation;
        this.model.positionsCompany = this.lstGeneral;
        this.evaluationService.updateEvaluationPositions(this.model).subscribe(res => {
              if (res.stateCode == 200) {
                this.snack.open("Grabado correctamente", "OK", { duration: 4000 });
                    this.sendaction.emit(true);
              } else {
                this.snack.open(res.messageError[0], "Error", { duration: 4000 });
              }
        })
    }

    addCargo() {
        
        if (typeof this.cargo.scharge == 'undefined' ||
            typeof this.cargo.monthInit == 'undefined' ||
            typeof this.cargo.yearInit == 'undefined' ||
            typeof this.cargo.monthEnd == 'undefined' ||
            typeof this.cargo.yearEnd == 'undefined') {
                Swal.fire({
                    icon: 'warning',
                    html: 'Complete toda la información del Cargo Asumido',
                    title: "Errores de validación"
                  });
                return;
        }

        this.cargo.pstart = this.listMonthsIni[this.listMonthsIni.findIndex(x => x.id == this.cargo.monthInit)].value + ' ' +this.cargo.yearInit;
        const _dateStart = new Date(this.cargo.yearInit, Number(this.cargo.monthInit) - 1, 1);
        const _dateActual = new Date();

        if ((this.cargo.monthEnd == 'Al Presente' && this.cargo.yearEnd != 'Al Presente') ||
        this.cargo.monthEnd != 'Al Presente' && this.cargo.yearEnd == 'Al Presente') {
            Swal.fire({
                icon: 'warning',
                html: 'Si elige el periodo Al Presente debe seleccionar el mes y año con el campo "Al Presente"',
                title: "Errores de validación"
              });
            return;
        }
        
        let _dateEnd = _dateActual;
        if(this.cargo.monthEnd != 'Al Presente' && this.cargo.yearEnd != 'Al Presente') {
            _dateEnd = new Date(this.cargo.yearEnd, Number(this.cargo.monthEnd) - 1, 1);
            this.cargo.pend = this.listMonthsEnd[this.listMonthsEnd.findIndex(x => x.id == this.cargo.monthEnd)].value + ' ' +this.cargo.yearEnd;
        } else this.cargo.pend = 'Al Presente';

        new Date(this.cargo.yearEnd, this.cargo.monthEnd, 1);
        this.cargo.months = Math.floor(moment(_dateEnd).diff(_dateStart, 'months', true));
        
        const dateIngreso = new Date(this.model.dimissionDate);
        const _dateIngreso = new Date(dateIngreso.getFullYear(), dateIngreso.getMonth(), 1);

        if (this.cargo.months < 0) {
            Swal.fire({
                icon: 'warning',
                html: 'El periodo fin debe ser mayor al periodo inicial',
                title: "Errores de validación"
              });
            return;
        }

        if (_dateEnd > _dateActual) {
            Swal.fire({
                icon: 'warning',
                html: 'El periodo fin no puede ser mayor a la fecha actual',
                title: "Errores de validación"
              });
            return;
        }

        if (_dateStart < _dateIngreso) {
            Swal.fire({
                icon: 'warning',
                html: 'El periodo inicial no puede ser menor a la Fecha de Ingreso',
                title: "Errores de validación"
              });
            return;
        }

        
        this.lstGeneral.push(this.cargo);
        
        this.lstGeneral.sort((a, b) => b.yearInit.localeCompare(a.yearInit) || b.monthInit - a.monthInit);
        this.cargo = {};
        this.CargosDT = new MatTableDataSource(this.lstGeneral);
        this.contador++;
    }

    EliminarGrado(_index: number) {
        this.lstGeneral.splice(_index, 1);   
        this.CargosDT = new MatTableDataSource(this.lstGeneral);
    }

    SetearAnhosPasados() {
        if (this.model.dimissionDate != null) {
            const _dateInitial = new Date(this.model.dimissionDate);
            const _dateActual = new Date();
            this.listYearsIni = [];
            this.listYearsEnd = [];
            
            for (let index = 0; index <= _dateActual.getFullYear() - _dateInitial.getFullYear(); index++) {
                const _objYear = {
                    id: (_dateInitial.getFullYear() + index).toString(),
                    value: (_dateInitial.getFullYear() + index).toString(),
                };          
                this.listYearsIni.push(_objYear);
                this.listYearsEnd.push(_objYear);      
            }

            if (this.listYearsEnd.findIndex(x => x.id == 'Al Presente') == -1) {
                this.listYearsEnd.push({
                    id: 'Al Presente',
                    value: 'Al Presente'
                });
            }
            
            if (this.listMonthsEnd.findIndex(x => x.id == 'Al Presente') == -1) {
                this.listMonthsEnd.push({
                    id: 'Al Presente',
                    value: 'Al Presente'
                });
            }            
        }
    }
}