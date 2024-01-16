import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-dialog-detail',
  templateUrl: './dialog-detail.component.html',
  styleUrls: ['./dialog-detail.component.scss']
})
export class DialogDetailComponent implements OnInit {
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  list: any[] = [];

  displayedColumns: string[] = [
    'fotoUrl',
    'dni',
    'nombreCompleto',
    'cargo',
    'objetivoPorc',
    'competenciaPorc'
  ];

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogDetailComponent>
  ) {
    this.load();
  }

  ngOnInit(): void {
    
  }
  
  load() {
    this.list = this.data.payload;
    this.dataSource = new MatTableDataSource<any>(this.list);
  }

  getRound(valor){
    var res= parseFloat(valor).toFixed(2);

    return res;
  }

}
