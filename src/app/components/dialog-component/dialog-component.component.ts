import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-component',
  templateUrl: './dialog-component.component.html',
  styleUrls: ['./dialog-component.component.scss']
})
export class DialogComponent implements OnInit {
  private inited;

  constructor(
      public dialogRef: MatDialogRef<any>,
      @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
   this.dialogRef.afterOpened().subscribe(() => {
      this.inited = true;
    });

  }

  @HostListener('window:click')
  onNoClick(): void {
    if (this.inited) {
      this.dialogRef.close();
    }
    
  }
}
