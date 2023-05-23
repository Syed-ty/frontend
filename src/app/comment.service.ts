import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {environment} from 'src/environments/environment'
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(
    private http: HttpClient
  ) { }



  addcomment(data:any){
    return this.http.post<{
      error:boolean,
      message:string,
      response:any
    }>(`${environment.baseUrl}/comment/addcomment`,data)
  }

  getallcomment(){
    return this.http.get<{
      error:boolean,
      message:string,
      response:any
    }>(`${environment.baseUrl}/comment/getalldata`)
  }
 sharedInformatrion = new Subject()
  sharedData(data:any){
    this.sharedInformatrion.next(data)
  }

  getResponseData(){
    return this.sharedInformatrion
  }


  updateComment(data:any,id:any){
    return this.http.put< {
      error:boolean,
      response:any,
      message:string
    }> (`${environment.baseUrl}/comment/updateComment/${id}`,data)
    }


    sortNameAscendingOrder(){
      return this.http.get<{
        error:boolean,
        message:string,
        response:any
      }>(`${environment.baseUrl}/comment/sortNameAscending`)
    }



}
