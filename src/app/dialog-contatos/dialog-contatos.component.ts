import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-contatos',
  templateUrl: './dialog-contatos.component.html',
  styleUrls: ['./dialog-contatos.component.scss']
})
export class DialogContatosComponent implements OnInit {
  dialog: any;

  constructor(
    public dialogRef: MatDialogRef<DialogContatosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
  

