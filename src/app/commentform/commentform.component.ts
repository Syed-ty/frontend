import {
  AfterViewInit,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormGroupDirective,
} from '@angular/forms';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { CommentService } from '../comment.service';

import * as moment from 'moment';

import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-commentform',
  templateUrl: './commentform.component.html',
  styleUrls: ['./commentform.component.css'],
})
export class CommentformComponent implements OnInit, AfterViewInit {
  spinner: boolean = false;
  AddCommentForm: FormGroup;
  EditCommentForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    public router: Router,
    public service: CommentService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.AddCommentForm = fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)],
      ],
      comment: ['', Validators.required],
      editcomment: [''],
    });

    this.EditCommentForm = fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)],
      ],
      comment: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.getAllData();
  }

  ngAfterViewInit() {
    // setTimeout(()=>{
    //   this.commentlist.forEach((ele:any,i)=>{
    //     ele.date = moment(ele.CurrentDate).fromNow()
    //     let id1 = document.getElementById(`right${i}`)
    //     id1.style.display = 'none'
    //   })
    // },1000)
  }

  inputValue: any;
  inputValueNo: boolean = false;

  inputData(event: any) {
    this.inputValue = event.target.value;
    if (
      this.commentlist?.find((x: { name: any }) => x.name === this.inputValue)
    ) {
      this.inputValueNo = true;
    } else {
      this.inputValueNo = false;
    }
  }

  @ViewChild(FormGroupDirective)
  formGroupDirective!: FormGroupDirective;

  uuid: number = 1;

  commentlist: any[] = [];
  getAllData() {
    // this.spinner=true
    this.service.getallcomment().subscribe(
      (res) => {
        if (res) {
          // this.spinner = false;
          this.commentlist = res.response;
          this.commentlist.forEach((ele: any, i) => {
            ele.date = moment(ele.CurrentDate).fromNow();
          });
        }
      },
      (err) => {
        if (err.status) {
          this.spinner = false;
          this.toastr.error(err.message);
        } else {
          this.spinner = false;
          this.toastr.error('CONNECTION_ERROR');
        }
      }
    );
  }

  onsubmit() {
    // this.spinner=true
    const body = {
      name: this.AddCommentForm.get('name').value,
      comment: this.AddCommentForm.get('comment').value,
      id: uuidv4(),
    };
    this.service.addcomment(body).subscribe(
      (res) => {
        // this.spinner=false;
        this.toastr.success(res.message);
        // this.AddCommentForm.get('name').clearValidators()
        this.AddCommentForm.reset();
        this.formGroupDirective.resetForm();
        this.getAllData();
      },
      (err) => {
        // if (err.status) {
        //   this.toastr.error(err.error.message);
        // } else {
        //   this.toastr.error('CONNECTION_ERROR');
        // }
      }
    );
  }

  enableInput: boolean = true;
  selecteditem: any;
  comment: any;


  sortedlist: any[] = [];
  onSort() {
    this.spinner = true;
    this.service.sortNameAscendingOrder().subscribe((res) => {
      this.spinner = false;
      this.commentlist = res.response;
      this.sortedlist = res.response;
      this.commentlist = res.response;
      this.commentlist.forEach((ele: any, i) => {
        ele.date = moment(ele.CurrentDate).fromNow();
      });
    });
  }

  selectedDepartment: any;
  OnMatCardClickEvent(item) {
    this.selectedDepartment = item;
  }

  @ViewChild('editcomment') editcomment: TemplateRef<any>;

  openEditDialog(event: any) {
    setTimeout(() => {
      this.dialog.open(this.editcomment, {
        panelClass: [
          'appointmentdialog',
          'animate__animated',
          'animate__slideInRight',
          'patientappointment',
        ],
        data: this.selectedDepartment,
        width: '370px',
        height: '300px',
        disableClose: true,
        hasBackdrop: true,
      });

      if (this.selectedDepartment.name === null) {
        this.EditCommentForm.get('name').setValue('null');
      } else {
        this.EditCommentForm.get('name').setValue(this.selectedDepartment.name);
      }
      if (this.selectedDepartment.comment === null) {
        this.EditCommentForm.get('comment').setValue('null');
      } else {
        this.EditCommentForm.get('comment').setValue(
          this.selectedDepartment.comment
        );
      }
    });
  }

  cancelModel() {
    this.getAllData();
  }

  commentData
  editCommentDetails() {
    const body = {
      name: this.EditCommentForm.get('name').value,
      comment: this.EditCommentForm.get('comment').value,
      id: this.selectedDepartment.id,
    };
    this.service.updateComment(body,this.selectedDepartment.id).subscribe(
      (res) => {
        this.dialog.closeAll();
        this.toastr.success(res.message);
        this.service.getallcomment().subscribe(
          (res) => {
            if (res) {
              this.spinner = false;
              this.commentlist =  res.response.sort((a:any, b:any) => new Date(b.CurrentDate).getTime() - new Date(a.CurrentDate).getTime());
              this.commentlist.forEach((ele: any, i) => {
                ele.date = moment(ele.CurrentDate).fromNow();
              });
            }
          },
        );
      },
      (err) => {
        if (err.status) {
          this.toastr.error(err.error.message);
        } else {
          this.toastr.error('CONNECTION_ERROR');
        }
      }
    );
  }

  onClearAllFilter() {
    this.sortedlist = [];
    this.getAllData();
  }
}
