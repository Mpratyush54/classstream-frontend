import { Injectable } from '@angular/core';

import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { StogageService } from 'src/app/services/stogage.service';

@Injectable({
  providedIn: 'root'
})
export class UploadVideoService {

  constructor(private http: HttpClient, private Routes: Router, private localstorage: StogageService) { }
  private readonly usernames = this.localstorage.teacher_get('teacher_username')
  private readonly emails = this.localstorage.teacher_get('teacher_email')
  private readonly query_tokens = this.localstorage.teacher_get('teacher_query_token')
  async upload_video(file: File, id: string, onProgress?: (pct: number) => void) {
    const CHUNK_SIZE = 50 * 1024 * 1024; // 50 MB
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const baseUrl = `${environment.baseurl}teacher/upload_video_video/v2`;

    // Prepare auth data
    const authBody = {
      username: this.usernames,
      email: this.emails,
      query_token: this.query_tokens
    };


    // 1️⃣ Initialize upload session with auth
    await this.http.post(`${baseUrl}/init/${id}`, {}, {
      headers: {
        'x-username': this.usernames || '',
        'x-email': this.emails || '',
        'x-token': this.query_tokens || ''
      }

    }).toPromise();

    let uploadedBytes = 0;

    // 2️⃣ Upload each chunk sequentially
    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(file.size, start + CHUNK_SIZE);
      const chunk = file.slice(start, end);

      const fd = new FormData();
      fd.append('chunk', chunk, file.name);

      const response = await fetch(`${baseUrl}/chunk/${id}/${i}`, {
        method: 'POST',
        headers: {
          'x-username': this.usernames || '',
          'x-email': this.emails || '',
          'x-token': this.query_tokens || ''
        },
        body: fd,
      });

      if (!response.ok) throw new Error(`Chunk ${i} failed`);

      uploadedBytes += chunk.size;
      const pct = Math.min(100, Math.round((uploadedBytes / file.size) * 100));
      if (onProgress) onProgress(pct);
    }


    // 3️⃣ Complete upload with auth
    const completeRes = await this.http.post(`${baseUrl}/complete/${id}`,
      {
        dummy: true
      },
      {
        headers: {
          'x-username': this.usernames || '',
          'x-email': this.emails || '',
          'x-token': this.query_tokens || ''
        }

      }).toPromise();

    return { body: completeRes };
  }


  uploadsssss_video(Chapter_Names, Titles, Chapter_No, Class) {


    let url = environment.baseurl + 'teacher/upload-data';
    return this.http.post(url, {

      username: this.usernames,
      email: this.emails,
      query_token: this.query_tokens,
      Chapter_Name: Chapter_Names,
      Title: Titles,
      Chapter_No: Chapter_No,
      Class: Class
    }).pipe(
      map((data: any) => {
        if (data.status == true) {
          if (data.error == false) {
            this.Routes.navigate([`teacher/video-upload-file/${data.id}`])

          }
        }



      }), catchError(response => {



        return throwError('Something went wrong!');




      })
    )
  }
}
