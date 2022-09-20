import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lawsuit',
  templateUrl: './lawsuit.component.html',
  styleUrls: ['./lawsuit.component.scss']
})
export class LawsuitComponent implements OnInit{

  loading = true

  ngOnInit() {
    setTimeout(() => {
      this.loading = false
    }, 1000)
  }

}
