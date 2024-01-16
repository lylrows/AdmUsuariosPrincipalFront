import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EmployeeService } from '@app/data/service/employee.service';
import { StaffRequestService } from '@app/data/service/staff-request.service';
import * as _moment from "moment";

@Component({
  selector: 'app-request-medical',
  templateUrl: './request-medical.component.html',
  styleUrls: ['./request-medical.component.scss']
})
export class RequestMedicalComponent implements OnInit {

  typerequest: any[] = [];

  listmedical: any[] = []

  showone: boolean = false;
  showtwo: boolean = false;
  showtree: boolean = false;
  showfor: boolean = false;
  showquinto: boolean = false;

  showgrilla: boolean = false;

  documentDT: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginatordocument: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    "type",
    "collabator",
    // "dregister",
    "typedm",
    "origindm",
    "dateinit",
    "dateend",
    "semaforo",
    "state",
    "view"
  ];

  vivaDT: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginatorviva: MatPaginator;
  @ViewChild(MatSort) sortviva: MatSort;
  displayedColumnsViva: string[] = [
    "type",
    "collabator",
    // "dregister",
    "typedm",
    "origindm",
    "dateinit",
    "dateend",
    "snumberviva",
    "soperationnumber",
    "semaforo",
    "state",
    "view"
  ];

  citDT: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginatorcit: MatPaginator;
  @ViewChild(MatSort) sortcit: MatSort;
  displayedColumnsCIT: string[] = [
    "type",
    "collabator",
    // "dregister",
    "typedm",
    "origindm",
    "dateinit",
    "dateend",
    "snumberCIT",
    "semaforo",
    "state",
    "view"
  ];

  amountDT: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginatoramount: MatPaginator;
  @ViewChild(MatSort) sortamount: MatSort;
  displayedColumnsAmount: string[] = [
    "type",
    "collabator",
    // "dregister",
    "typedm",
    "origindm",
    "dateinit",
    "dateend",
    "namount",
    "semaforo",
    "state",
    "view"
  ];

  finishDT: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginatorfinish: MatPaginator;
  @ViewChild(MatSort) sortfinish: MatSort;
  displayedColumnsfinish: string[] = [
    "type",
    "collabator",
    // "dregister",
    "typedm",
    "origindm",
    "dateinit",
    "dateend",
    "snumberviva",
    "snumberCIT",
    "namount",
    "state",
    "view"
  ];


  gridDT: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginatorgrid: MatPaginator;
  @ViewChild(MatSort) sortgrid: MatSort;
  displayedColumnsgrid: string[] = [
    "type",
    "collabator",
    // "dregister",
    "typedm",
    "origindm",
    "dateinit",
    "dateend",
    "state",
    "view"
  ];

  @ViewChild("selecteddocument") selecteddocument: ElementRef;
  @ViewChild("selectedregister") selectedregister: ElementRef;
  @ViewChild("selectedcit") selectedcit: ElementRef;
  @ViewChild("selectedmonto") selectedmonto: ElementRef;
  @ViewChild("selectedfinish") selectedfinish: ElementRef;

  ntype = new FormControl('');
  ddateinit = new FormControl('');
  ddateend = new FormControl('');
  nid_employee: number = 0;
  nid_position: number = 0;
  nid_profile: number = 0;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private _serviceEmployee: EmployeeService,
    private _serviceStaff: StaffRequestService,
    private staffRequestService: StaffRequestService,
  ) {
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.nid_employee = storage.nid_employee;
    this.nid_position = storage.nid_position;
    this.nid_profile=storage.nid_profile;
    this.getAprroved();
  }

  ngOnInit(): void {
    this.loadinfo()
    this.loadtype();
    
    
  }

  getAprroved(): void {
    this.staffRequestService.getlistapproved().subscribe(resp => {
      const list: any[] = resp.data;
      
      const findUser = list.find(e => e.nid_profile === this.nid_profile);

      if (findUser != undefined) {
        this.showgrilla = false;
      } else {
        this.showgrilla = true;
      }

    })
  }

  showreport(): void {
    this.router.navigate(['humanmanagement/request-medical-report'], {
      skipLocationChange: true
    });
  }

  getDetailPath(id: number): void {
    console.log("🚀 RequestMedicalComponent ~ getDetailPath ~ id:", id)
    this.router.navigate(['humanmanagement/request-medical-config',id], {
      skipLocationChange: true
    })
  }

  filter(): void {

    let employeeid = 0;
    if (this.nid_position != 50) {
      employeeid = this.nid_employee;
    } else {
      employeeid = 0;
    }

    if (this.showgrilla) {

      const payload = {
        nid_employee: employeeid,
        ntype: Number(this.ntype.value),
        ddateinit: this.ddateinit.value,
        ddateend: this.ddateend.value,
      }

      this._serviceStaff.getmedicallist(payload).subscribe(resp => {
        console.log("🚀 ~ RequestMedicalComponent ~ this._serviceStaff.getmedicallist ~ resp:", resp)
        
        this.listmedical = resp.data;

    

        
        this.gridDT = new MatTableDataSource(this.listmedical);
        this.gridDT.paginator = this.paginatorgrid;
      })

    } else {
      if (this.showone) {
        this.filteroption(1)
      }

      if (this.showtwo) {
        this.filteroption(2)
      }

      if (this.showtree) {
        this.filteroption(3)
      }

      if (this.showfor) {
        this.filteroption(4)
      }

      if (this.showquinto) {
        this.filteroption(5)
      }
    }

    



  }

  resetFilter(): void {
    this.ntype.setValue('')
    this.loadinfo();
  }

  loadinfo(): void {

    this.ddateinit.setValue(_moment().add(-1, 'M'));
    this.ddateend.setValue(_moment().add(1, 'M'));

    let employeeid = 0;
    if (this.nid_position != 50) {
      employeeid = this.nid_employee;
    } else {
      employeeid = 0;
    }

    const payload = {
      nid_employee: employeeid,
      ntype: Number(this.ntype.value),
      ddateinit: this.ddateinit.value,
      ddateend: this.ddateend.value,
    }

    this._serviceStaff.getmedicallist(payload).subscribe(resp => {
      console.log("🚀 ~ RequestMedicalComponent ~ this._serviceStaff.getmedicallist ~ resp:", resp)
      this.listmedical = resp.data;

      

      
      this.showone = true;
      this.documentDT = new MatTableDataSource(this.listmedical);
      this.vivaDT = new MatTableDataSource(this.listmedical);
      this.citDT = new MatTableDataSource(this.listmedical);
      this.amountDT = new MatTableDataSource(this.listmedical);
      this.gridDT = new MatTableDataSource(this.listmedical);
      this.gridDT.paginator = this.paginatorgrid;

      if ( !this.showgrilla ) {
        this.filteroption(1);
      }

      
    })
  }

  loadtype(): void {
    this._serviceEmployee.ListGeneric(1004).subscribe(resp => {
      this.typerequest = resp;
    })
  }

  newrequest(): void {
    this.router.navigate(['humanmanagement/request-medical-config', 0], {
      skipLocationChange: true
    });
  }

  filteroption(option: number): void {

    let employeeid = 0;
    let newarray: any[] = [];
    if (this.nid_position != 50) {
      employeeid = this.nid_employee;
    } else {
      employeeid = 0;
    }

    const payload = {
      nid_employee: employeeid,
      ntype: Number(this.ntype.value),
      ddateinit: this.ddateinit.value,
      ddateend: this.ddateend.value,
    }

    switch (option) {
      case 1:
        this.renderer.addClass(this.selecteddocument.nativeElement, "active");
        this.renderer.removeClass(
          this.selectedregister.nativeElement,
          "active"
        );
        this.renderer.removeClass(
          this.selectedcit.nativeElement,
          "active"
        );
        this.renderer.removeClass(
          this.selectedmonto.nativeElement,
          "active"
        );

        this.renderer.removeClass(
          this.selectedfinish.nativeElement,
          "active"
        );

        this.showone = true;
        this.showtwo = false;
        this.showtree = false;
        this.showfor = false;
        this.showquinto = false;


        this._serviceStaff.getmedicallist(payload).subscribe(resp => {
          this.listmedical = resp.data;
          

          this.listmedical.map((e, i) => {
            if (e.nstate === 1 || e.nstate === 2 || e.nstate === 3 || e.nstate === 4) {
              newarray.push(e)
            }
          })
          this.documentDT = new MatTableDataSource(newarray);

          this.documentDT.paginator = this.paginatordocument;

        })

        break;
      case 2:
        this.renderer.removeClass(this.selecteddocument.nativeElement, "active");
        this.renderer.addClass(this.selectedregister.nativeElement, "active");
        this.renderer.removeClass(
          this.selectedcit.nativeElement,
          "active"
        );
        this.renderer.removeClass(
          this.selectedmonto.nativeElement,
          "active"
        );

        this.renderer.removeClass(
          this.selectedfinish.nativeElement,
          "active"
        );

        this.showone = false;
        this.showtwo = true;
        this.showtree = false;
        this.showfor = false;
        this.showquinto = false;

        this._serviceStaff.getmedicallist(payload).subscribe(resp => {
          console.log("🚀 ~ B RequestMedicalComponent ~ this._serviceStaff.getmedicallist ~ resp:", resp)
          this.listmedical = resp.data;
          this.listmedical.map((e, i) => {
            if (e.bregisterviva != null && e.nstate === 5) {
              newarray.push(e)
            }
          })
          this.vivaDT = new MatTableDataSource(newarray);
          this.vivaDT.paginator = this.paginatorviva;
        })

        break;
      case 3:
        this.renderer.removeClass(this.selecteddocument.nativeElement, "active");
        this.renderer.removeClass(
          this.selectedregister.nativeElement,
          "active"
        );
        this.renderer.addClass(this.selectedcit.nativeElement, "active");
        this.renderer.removeClass(
          this.selectedmonto.nativeElement,
          "active"
        );

        this.renderer.removeClass(
          this.selectedfinish.nativeElement,
          "active"
        );

        this.showone = false;
        this.showtwo = false;
        this.showtree = true;
        this.showfor = false;
        this.showquinto = false;

        this._serviceStaff.getmedicallist(payload).subscribe(resp => {
          this.listmedical = resp.data;
          this.listmedical.map((e, i) => {
            if (e.bhaveCIT != null && e.nstate === 6) {
              newarray.push(e)
            }
          })

          this.citDT = new MatTableDataSource(newarray);
          this.citDT.paginator = this.paginatorcit;
        })


        break;
      case 4:
        this.renderer.removeClass(this.selecteddocument.nativeElement, "active");
        this.renderer.removeClass(
          this.selectedregister.nativeElement,
          "active"
        );
        this.renderer.removeClass(
          this.selectedcit.nativeElement,
          "active"
        );
        this.renderer.addClass(this.selectedmonto.nativeElement, "active");

        this.renderer.removeClass(
          this.selectedfinish.nativeElement,
          "active"
        );

        this.showone = false;
        this.showtwo = false;
        this.showtree = false;
        this.showfor = true;
        this.showquinto = false;

        this._serviceStaff.getmedicallist(payload).subscribe(resp => {
          this.listmedical = resp.data;
          this.listmedical.map((e, i) => {
            if (e.bhaveamount != null && e.nstate === 7) {
              newarray.push(e)
            }
          })

          this.amountDT = new MatTableDataSource(newarray);
          this.amountDT.paginator = this.paginatoramount;
        })


        break;
      case 5:
        this.renderer.removeClass(this.selecteddocument.nativeElement, "active");
        this.renderer.removeClass(
          this.selectedregister.nativeElement,
          "active"
        );
        this.renderer.removeClass(
          this.selectedcit.nativeElement,
          "active"
        );
        this.renderer.removeClass(
          this.selectedmonto.nativeElement,
          "active"
        );
        this.renderer.addClass(this.selectedfinish.nativeElement, "active");
        this.showone = false;
        this.showtwo = false;
        this.showtree = false;
        this.showfor = false;
        this.showquinto = true;

        this._serviceStaff.getmedicallist(payload).subscribe(resp => {
          this.listmedical = resp.data;
          this.listmedical.map((e, i) => {
            if (e.nstate === 8) {
              newarray.push(e)
            }
          })

          this.finishDT = new MatTableDataSource(newarray);
          this.finishDT.paginator = this.paginatorfinish;
        })


        break;
      default:
        this.renderer.removeClass(this.selecteddocument.nativeElement, "active");
        this.renderer.removeClass(
          this.selectedregister.nativeElement,
          "active"
        );
        this.renderer.removeClass(
          this.selectedcit.nativeElement,
          "active"
        );
        this.renderer.removeClass(
          this.selectedmonto.nativeElement,
          "active"
        );
        this.showone = true;
        this.showtwo = false;
        this.showtree = false;
        this.showfor = false;
        break;
    }
  }

}
