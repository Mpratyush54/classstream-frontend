import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker'; 
import { SimplebarAngularModule } from 'simplebar-angular';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';



import {FormsModule , ReactiveFormsModule}from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi }from '@angular/common/http';
import { HeaderDesktopComponent } from './nav/header-desktop/header-desktop.component';
import { HeaderMobileComponent } from './nav/header-mobile/header-mobile.component';
import { MenuSidebarComponent } from './nav/menu-sidebar/menu-sidebar.component';
import { LoginComponent } from './asset/login/login.component';
import { LogoutComponent } from './asset/logout/logout.component';
import { PdfViewerComponent } from './asset/pdf-viewer/pdf-viewer.component';
import { VideoComponent } from './teacher/video/video.component';
import { IndexComponent } from './teacher/index/index.component';
import { VideoUploadComponent } from './teacher/video-upload/video-upload.component';

import { VideoUploadFileComponent } from './teacher/video-upload-file/video-upload-file.component';
import { NotesComponent } from './teacher/notes/notes.component';
import { NotesAddComponent } from './teacher/notes-add/notes-add.component';
import { IndexStudentComponent } from './student/index-student/index-student.component';
import { StudentHeaderDesktopComponent } from './student/nav/student-header-desktop/student-header-desktop.component';
import { StudentHeaderMobileComponent } from './student/nav/student-header-mobile/student-header-mobile.component';
import { StudentMenuSidebarComponent } from './student/nav/student-menu-sidebar/student-menu-sidebar.component';
import { PlayComponent } from './student/video/play/play.component';
import { IndexComponentvieo } from './student/video/index/index.component';
import { environment } from 'src/environments/environment';
import { SomethingwentwrongComponent } from './asset/somethingwentwrong/somethingwentwrong.component';
import { NotificationComponent } from './teacher/notification/notification.component';
import { NewNotificationComponent, NgbdModalContent } from './teacher/new-notification/new-notification.component';
import { NotificationdetailsComponent } from './teacher/notificationdetails/notificationdetails.component';

import { CreateComponent } from './teacher/live/create/create.component';
import { JoinComponent } from './teacher/live/join/join.component';
import { IndexLiveComponent } from './teacher/live/index/index.component';
import { HlsjsPlyrDriver } from './student/video/play-setup/play-setup.component';
import { IndexComponentnotes } from './student/notes/index/index.component';
import { NotesindvidualComponent } from './student/notes/notesindvidual/notesindvidual.component';
import { IndexComponentStudent } from './teacher/studentadd/index/index.component';
import { EditstudentComponent } from './teacher/studentadd/editstudent/editstudent.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


import {MatFormFieldModule} from '@angular/material/form-field';

import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IntersepterService } from './loader/intersepter.service';
import { FourZeroFourComponent } from './asset/four-zero-four/four-zero-four.component';
import { SetingsComponent } from './student/setings/setings.component';
import { DownloadComponent } from './asset/download/download.component';
import { ForgotPasswordComponent } from './asset/forgot-password/forgot-password.component';
import { ResetComponent } from './asset/forgot-password/reset/reset.component';
import { LiveComponent } from './student/live/live.component';
import { LiveJoinComponent } from './student/live/live-join/live-join.component';


import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource,NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { VideoPlayerComponent } from './asset/video.player/video.player.component';
import { TablesComponent } from './asset/tables/tables.component';



@NgModule({ declarations: [
        AppComponent,

        VideoUploadComponent,
        
        NotesComponent,
        NotesAddComponent,
        IndexStudentComponent,
        StudentHeaderDesktopComponent,
        StudentHeaderMobileComponent,
        StudentMenuSidebarComponent,
        IndexComponentvieo,
        
        NewNotificationComponent,
        NotificationdetailsComponent,
        JoinComponent,
        IndexLiveComponent,
        IndexComponentnotes,
        NotesindvidualComponent,
        IndexComponentStudent,
        EditstudentComponent,
        SetingsComponent,
        ForgotPasswordComponent,
        ResetComponent,
        NgbdModalContent,
        LiveComponent,
        LiveJoinComponent,
    ],
    exports:[
        HeaderDesktopComponent,
        HeaderMobileComponent,
        MenuSidebarComponent,
    VideoPlayerComponent,
    TablesComponent,
    
    ],
    bootstrap: [AppComponent], 
    imports: [
    CKEditorModule,
    VideoUploadFileComponent,
    FourZeroFourComponent,
    DownloadComponent,
    SomethingwentwrongComponent,
    IndexComponent,
    LoginComponent,
    VideoComponent,
    LogoutComponent,
    PlayComponent,
    PdfViewerComponent,
    CreateComponent,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgbCarousel, NgbPaginationModule,
    SimplebarAngularModule,
    NgxExtendedPdfViewerModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
        // Register the ServiceWorker as soon as the app is stable
        // or after 30 seconds (whichever comes first).
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
        // Register the ServiceWorker as soon as the app is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000'
    }),
    HeaderMobileComponent,
    MenuSidebarComponent,
    HeaderDesktopComponent,
    VideoPlayerComponent,
    TablesComponent
], providers: [{ provide: HTTP_INTERCEPTORS, useClass: IntersepterService, multi: true }, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
pdfDefaultOptions.assetsFolder = 'bleeding-edge';
