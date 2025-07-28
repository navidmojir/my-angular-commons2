import { Component, OnInit } from '@angular/core';
import { PageMode } from '../enums/page-mode';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { TicketService } from '../services/ticket-service';

@Component({
  selector: 'app-ticket-details',
  imports: [ReactiveFormsModule, CommonModule, MatGridListModule, MatFormField, MatError,
    MatInputModule, MatButton
  ],
  templateUrl: './ticket-details.html',
  styleUrl: './ticket-details.css'
})
export class TicketDetails implements OnInit {
  PageMode = PageMode;
  pageMode: PageMode = PageMode.VIEW;
  id: number = 0;
  gridCols = 4;
  gridRowHeight = "3:1";
  gridGutterSize = "30px";
  patternErrorMsg = 'کاراکتر غیرمجاز';

  constructor(private route: ActivatedRoute,
    private ticketService: TicketService
  ){
  }

  form = new UntypedFormGroup({
    text: new UntypedFormControl()
  });

  ngOnInit(): void {
    let paramId = this.route.snapshot.paramMap.get("id");
    if(paramId == null)
      this.pageMode = PageMode.CREATE;
  }

  get text(): any {
    return this.form.get('text')
  }

  submit() {
    // alert(JSON.stringify(this.form.value));
    this.ticketService.create(this.form.value).subscribe((result) => console.log(result));
  }
}
