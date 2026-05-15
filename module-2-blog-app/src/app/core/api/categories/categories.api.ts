import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { ICreateCategoryDto, IUpdateCategoryDto } from '@core/api/categories/categories.dto';
import { ICategoryApiResponse } from '@models/categories-api.model';
import { Observable } from 'rxjs';

const BASE = '/api/categories';

@Injectable()
export class CategoriesApi {
  private readonly http = inject(HttpClient);

  getAll(): Observable<ICategoryApiResponse[]> {
    return this.http.get<ICategoryApiResponse[]>(BASE);
  }

  create(dto: ICreateCategoryDto): Observable<ICategoryApiResponse> {
    return this.http.post<ICategoryApiResponse>(BASE, dto);
  }

  update(id: string, dto: IUpdateCategoryDto): Observable<ICategoryApiResponse> {
    return this.http.patch<ICategoryApiResponse>(`${BASE}/${id}`, dto);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE}/${id}`);
  }
}
