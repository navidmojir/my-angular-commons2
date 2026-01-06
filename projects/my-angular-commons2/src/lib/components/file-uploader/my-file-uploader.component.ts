import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Observable } from 'rxjs';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';

export interface FileUploaderService {
  uploadFile(file: File, metadata: any): Observable<any>;
  getAllFiles(metadata: any): Observable<any>;
  deleteFile(fileId: any, metadata: any): Observable<any>;
  downloadFile(fileId: any, metadata: any): Observable<any>;
}

@Component({
  imports: [CommonModule, MatButtonModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule
  ],
  selector: 'app-confirmation-dialog',
  template: `
    <h3 style="text-align:right" mat-dialog-title>آپلود فایل</h3>
    <div mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field class="mid-width">
          <mat-label>نوع پیوست</mat-label>
          <mat-select formControlName="type" required>
            @for(opt of types; track $index) {
              <mat-option [value]="opt.value">{{opt.faTitle}}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field class="mid-width">
          <mat-label>توضیحات</mat-label>
          <input matInput formControlName="description">
        </mat-form-field>
      </form>
      
    </div>
    <div mat-dialog-actions>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="dialogRef.close(form.value)">آپلود</button>
      <button mat-raised-button (click)="dialogRef.close(false)">انصراف</button>
    </div>
  `

  ,
  styles: ``
})
export class FileUploadDialogComponent {

  constructor(public dialogRef: MatDialogRef<FileUploadDialogComponent>) { }

  @Input() types: any[] = [];

  form: FormGroup = new FormGroup({
    type: new FormControl(''),
    description: new FormControl('')
  });

}

@Component({
  selector: 'my-file-uploader',
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatProgressBarModule, MatCheckboxModule],
  templateUrl: './my-file-uploader.component.html',
  styleUrls: ['./my-file-uploader.component.css']
})
export class MyFileUploaderComponent implements OnInit {

  @Input() accept = "*.*";
  // @Input() uploadUrl;
  // @Input() downloadUrl;
  // @Input() removeUrl;
  // @Input() showDownloadLink = false;
  @Output() onResponse = new EventEmitter();
  @Input() fileUploaderService!: FileUploaderService;
  @Input() metadata: any;
  @Input() showAddButton = true;
  @Input() showCheckBox = false;
  @Input() showDeleteButton = true;
  @Input() types: any[] = [];

  @Output() onSelectChange = new EventEmitter();

  selectedFiles: any[] = [];
  uploadedFiles: any[] = [];
  progress: any;


  @ViewChild("fileUpload") fileUploadInput: ElementRef | undefined;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.reloadFileList();
  }

  private reloadFileList() {
    this.fileUploaderService.getAllFiles(this.metadata).subscribe((result) => {
      this.uploadedFiles = result;
      this.selectedFiles = [];
    });
  }

  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
    for (let file of this.selectedFiles) {
      this.fileUploaderService.uploadFile(file, this.metadata).subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            file["progress"] = Math.round((100 * event.loaded) / event.total);
          } else if (event.type === HttpEventType.Response) {
            file["uploaded"] = true;
            if (this.allSelectedFilesUploaded())
              this.reloadFileList();
          }
        }
      )
    }

  }

  allSelectedFilesUploaded() {
    for (let file of this.selectedFiles) {
      if (!file["uploaded"])
        return false;
    }
    return true;
  }

  getFileSize(file: any) {
    const sizeInBytes = file.size;

    const sizeInKB = sizeInBytes / 1024;
    const sizeInMB = sizeInKB / 1024;
    const sizeInGB = sizeInMB / 1024;

    if (sizeInGB >= 1) {
      return `${sizeInGB.toFixed(2)} GB`;
    } else if (sizeInMB >= 1) {
      return `${sizeInMB.toFixed(2)} MB`;
    } else if (sizeInKB >= 1) {
      return `${sizeInKB.toFixed(2)} KB`;
    } else {
      return `${sizeInBytes} bytes`;
    }
  }

  trimFileName(name: string) {
    return name.length > 15 ? name.substring(0, 12) + '...' : name;
  }

  removeFile(id: any) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.componentInstance.confirmMessage = "آیا از حذف فایل اطمینان دارید؟";
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (!result)
          return;
        this.fileUploaderService.deleteFile(id, this.metadata).subscribe(
          () => this.reloadFileList()
        );
      }
    );
  }

  downloadFile(fileId: any, fileName: string) {
    this.fileUploaderService.downloadFile(fileId, this.metadata).subscribe(
      (result) => this.triggerDownload(result, fileName)
    )
  }

  private triggerDownload(response: any, filename: string = "") {
    let dataType = response.type;
    let binaryData = [];
    binaryData.push(response);
    let downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
    if (filename)
      downloadLink.setAttribute('download', filename);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  uploadFile() {
    let dialogRef = this.dialog.open(FileUploadDialogComponent);
    dialogRef.componentInstance.types = this.types;
    dialogRef.afterClosed().subscribe(
      (result: any) => {
        if(!result)
          return;
        this.metadata.type = result.type;
        this.metadata.description = result.description;
        this.fileUploadInput?.nativeElement.click();
      }
    )
  }

  getTypeFaTitle(value: string) {
    for(let type of this.types) {
      if(type.value == value)
        return type.faTitle;
    }
    return '-';
  }

  selectedAttachmentIds: Set<number> = new Set();
  onCheckboxChange(ev: MatCheckboxChange, uploadedFile: any) {
    if(ev.checked)
      this.selectedAttachmentIds.add(uploadedFile.id);
    else
      this.selectedAttachmentIds.delete(uploadedFile.id);
    
    this.onSelectChange.emit(this.selectedAttachmentIds);
    // let el = ev.target as HTMLElement;
    // if(el.style.backgroundColor == 'lightblue')
    //   el.style.backgroundColor = '';
    // else
    //   el.style.backgroundColor = 'lightblue';

  }

}
