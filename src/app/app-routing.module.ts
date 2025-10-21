import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './asset/forgot-password/forgot-password.component';
import { ResetComponent } from './asset/forgot-password/reset/reset.component';
import { IndexStudentComponent } from './student/index-student/index-student.component';
import { LiveJoinComponent } from './student/live/live-join/live-join.component';
import { LiveComponent } from './student/live/live.component';
import { IndexComponentnotes } from './student/notes/index/index.component';
import { NotesindvidualComponent } from './student/notes/notesindvidual/notesindvidual.component';
import { SetingsComponent } from './student/setings/setings.component';
import { StudentGuard } from './student/student.guard';
import { IndexComponentvieo } from './student/video/index/index.component';
import { PlayComponent } from './student/video/play/play.component';
import { AuthGuard } from './teacher/auth.guard';
import { CreateComponent } from './teacher/live/create/create.component';
import { IndexLiveComponent } from './teacher/live/index/index.component';
import { NewNotificationComponent } from './teacher/new-notification/new-notification.component';
import { NotesAddComponent } from './teacher/notes-add/notes-add.component';
import { NotesComponent } from './teacher/notes/notes.component';
import { NotificationComponent } from './teacher/notification/notification.component';
import { NotificationdetailsComponent } from './teacher/notificationdetails/notificationdetails.component';
import { EditstudentComponent } from './teacher/studentadd/editstudent/editstudent.component';
import { IndexComponentStudent } from './teacher/studentadd/index/index.component';
// import { VideoPlayActualComponent } from './teacher/video-play-actual/video-play-actual.component';

import { VideoUploadFileComponent } from './teacher/video-upload-file/video-upload-file.component';
import { VideoUploadComponent } from './teacher/video-upload/video-upload.component';
import { VideoComponent } from './teacher/video/video.component';
import { VideoPlayerWrapperComponent } from './teacher/video.player.wrapper/video.player.wrapper.component';

const routes: Routes = [
  {
    path: 'teacher',
    canActivate: [AuthGuard],
    loadComponent: () => import('./teacher/nav-holder/nav-holder.component').then(m => m.NavHolderComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./teacher/index/index.component').then(m => m.IndexComponent),
        pathMatch: "full"
      },
      {
        path: 'videos',
        loadComponent: () => import('./teacher/video/video.component').then(m => m.VideoComponent),
      },
      { path: 'notes', component: NotesComponent },
      { path: 'notes-add', component: NotesAddComponent },
      { path: 'video-upload', component: VideoUploadComponent },
      { path: 'video-upload-file/:id', component: VideoUploadFileComponent },
      {
        path: 'videos/play/:id',
        loadComponent: () => import('./teacher/video.player.wrapper/video.player.wrapper.component').then(m => m.VideoPlayerWrapperComponent),
      },
      { path: 'notification', component: NotificationComponent },
      { path: 'notification/:id', component: NotificationdetailsComponent },
      { path: 'new-notification', component: NewNotificationComponent },
      { path: 'live', component: IndexLiveComponent },
      { path: 'live/:id', component: CreateComponent },
    ]
  },


  // {path: 'teacher/student' ,canActivate:[AuthGuard], component: IndexComponentStudent },
  // {path: 'teacher/student/edit/:id' ,canActivate:[AuthGuard], component: EditstudentComponent },
  // teacher/notification
  // home page of students 
  { path: 'student', canActivate: [StudentGuard], component: IndexStudentComponent },
  // live page for students
  { path: 'student/live', canActivate: [StudentGuard], component: LiveComponent },
  // live joining page
  { path: 'student/live/:id', canActivate: [StudentGuard], component: LiveJoinComponent },
  // Settings page for students - under devlopment 
  { path: 'student/settings', canActivate: [StudentGuard], component: SetingsComponent },

  { path: 'student/videos', canActivate: [StudentGuard], component: IndexComponentvieo },
  { path: 'student/notes', canActivate: [StudentGuard], component: IndexComponentnotes },
  { path: 'student/notes/:id', canActivate: [StudentGuard], component: NotesindvidualComponent },
  { path: 'student/play/:id', canActivate: [StudentGuard], component: PlayComponent },



  {
    path: '',
    loadComponent: () => import('./asset/home/nav/nav.component').then(m => m.NavComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./asset/home/home/home.component').then(m => m.HomeComponent),
      },
         {
        path: 'about',
        loadComponent: () => import('./asset/home/about-us/about-us.component').then(m => m.AboutUsComponent),
      },
           {
        path: 'features',
        loadComponent: () => import('./asset/home/features/features.component').then(m => m.FeaturesComponent),
      },
                {
        path: 'contact',
        loadComponent: () => import('./asset/home/contact-us/contact-us.component').then(m => m.ContactUsComponent),
      }
      
    ]
  },
  { path: 'forogot-password', component: ForgotPasswordComponent },
  { path: 'forogot-password/:username/:hash', component: ResetComponent },
  {
    path: 'logout',
    loadComponent: () => import('./asset/logout/logout.component').then(m => m.LogoutComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./asset/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'Something-went-wrong',
    loadComponent: () => import('./asset/somethingwentwrong/somethingwentwrong.component').then(m => m.SomethingwentwrongComponent),

  },
  {
    path: 'download',
    loadComponent: () => import('./asset/download/download.component').then(m => m.DownloadComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./asset/four-zero-four/four-zero-four.component').then(m => m.FourZeroFourComponent),
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
