import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
  selector: 'app-dialog-component',
  templateUrl: './dialog-component.component.html',
  styleUrls: ['./dialog-component.component.scss']
})
export class DialogComponent implements OnInit {
  private initiated: boolean;
  public safeMessage: SafeHtml; // Add this property to hold the sanitized HTML

  constructor(
      public dialogRef: MatDialogRef<any>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.dialogRef.afterOpened().subscribe(() => {
      this.initiated = true;
    });

    // sanitize 'data.message' and assign to 'safeMessage'
    this.safeMessage = this.sanitizer.bypassSecurityTrustHtml(this.data.message);
  }

  @HostListener('window:click')
  onNoClick(): void {
    if (this.initiated) {
      this.dialogRef.close();
    }
  }
}
