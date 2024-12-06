import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MemoriesService {

  constructor(private http: HttpClient) { }
  url = environment.apiBaseUrl+'FixtureImages/';

  //get images list
  GetImages(inputData:any){
    return this.http.get(this.url+'GetImages?fixturesId='+inputData);
  }
  //post images
  UploadImage(fixturesId: number, formData: FormData){
    const pathurl = `${this.url}UploadImage?fixturesId=${fixturesId}`;
    return this.http.post(pathurl,formData)
  }

}
