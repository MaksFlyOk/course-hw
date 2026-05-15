import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { ICreateArticleDto, IUpdateArticleDto } from '@core/api/articles/articles-dto';
import { IArticleApiResponse, IArticlesPageApiResponse } from '@models/articles-api.model';
import { Observable } from 'rxjs';

const BASE = '/api/articles';

@Injectable()
export class ArticlesApi {
  private readonly http = inject(HttpClient);

  getAll(page: number, limit: number): Observable<IArticlesPageApiResponse> {
    return this.http.get<IArticlesPageApiResponse>(BASE, {
      params: { page, limit },
    });
  }

  create(dto: ICreateArticleDto): Observable<IArticleApiResponse> {
    return this.http.post<IArticleApiResponse>(BASE, this.toFormData(dto));
  }

  update(id: string, dto: IUpdateArticleDto): Observable<IArticleApiResponse> {
    return this.http.patch<IArticleApiResponse>(`${BASE}/${id}`, dto);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE}/${id}`);
  }

  private toFormData(dto: ICreateArticleDto): FormData {
    const form = new FormData();
    form.append('title', dto.title);
    form.append('content', dto.content);
    form.append('categoryId', dto.categoryId);
    if (dto.image) {
      form.append('image', dto.image);
    }
    return form;
  }
}
