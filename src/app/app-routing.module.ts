import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommentformComponent } from './commentform/commentform.component';


const routes: Routes = [
  {
    path:'',
    redirectTo:'commentform',
    pathMatch:'full'
   },

   {
      path:'commentform',
      component:CommentformComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
