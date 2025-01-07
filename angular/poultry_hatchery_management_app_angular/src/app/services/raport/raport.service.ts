import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../app.config';
import { ApiPaths } from '../../api/api.paths';
import { Nesting } from '../../models/nesting.model';
import { Emergence } from '../../models/emergence.model';


@Injectable({
  providedIn: 'root'
})
export class RaportService {

  constructor(private http: HttpClient) {}

  downloadExcel(emergence: Emergence): void {
    this.http.get(`${apiUrl + ApiPaths.RaportPaths.GET + emergence.hatching.nesting.id}`, { responseType: 'blob' })
      .subscribe((response) => {
        if (response){
          const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          saveAs(blob, 'wyleg-' + emergence.dateTime + '.xlsx');
        }
      });
  }
}
