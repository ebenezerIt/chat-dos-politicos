import { Component, Inject,OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-contatos-dialog',
  templateUrl: './contatos-dialog.component.html',
  styleUrls: ['./contatos-dialog.component.scss']
})
export class ContatosDialogComponent implements OnInit {
  dialog: any;

  constructor(
    public dialogRef: MatDialogRef<ContatosDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
    ){ }

  ngOnInit(): void {
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
