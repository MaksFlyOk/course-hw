import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { ICreateCommentDto, IUpdateCommentRatingDto } from '@core/api/article-detail/article-detail.dto';
import { IArticleDetailApiResponse, ICommentApiResponse } from '@models/article-detail-api.model';
import { IArticleApiResponse } from '@models/articles-api.model';
import { Observable } from 'rxjs';

const BASE_ARTICLES = '/api/articles';
const BASE_COMMENTS = '/api/comments';

@Injectable()
export class ArticleDetailApi {
  private readonly http = inject(HttpClient);

  getArticle(id: string): Observable<IArticleDetailApiResponse> {
    return this.http.get<IArticleApiResponse>(`${BASE_ARTICLES}/${id}`);
  }

  ratingUp(id: string): Observable<IArticleDetailApiResponse> {
    return this.http.patch<IArticleApiResponse>(`${BASE_ARTICLES}/${id}/rating-up`, {});
  }

  ratingDown(id: string): Observable<IArticleDetailApiResponse> {
    return this.http.patch<IArticleApiResponse>(`${BASE_ARTICLES}/${id}/rating-down`, {});
  }

  getComments(articleId: string, page: number, limit: number): Observable<ICommentApiResponse[]> {
    return this.http.get<ICommentApiResponse[]>(`${BASE_COMMENTS}/article/${articleId}`, {
      params: { page, limit },
    });
  }

  createComment(dto: ICreateCommentDto): Observable<ICommentApiResponse> {
    return this.http.post<ICommentApiResponse>(BASE_COMMENTS, dto);
  }

  updateCommentRating(commentId: string, dto: IUpdateCommentRatingDto): Observable<ICommentApiResponse> {
    return this.http.patch<ICommentApiResponse>(`${BASE_COMMENTS}/${commentId}/rating`, dto);
  }
}
