import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {environment} from '../../environments/environment';
import {PaginationResponse} from '../models/pagination-reponse';
import {User, UserResponse} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public url = `${environment.tppBackend}`;

  constructor(private http: HttpClient) {
  }

  listUsers(page: number = 0, size: number = 25, queryParam: string = ''): Observable<UserResponse> {
    return this.http.get<PaginationResponse<User[]>>(`${this.url}/users?page=${page}&size=${size}&queryParam=${queryParam}`).pipe(
      map((resp) => {
        return {
          users: resp.content,
          totalElements: resp.totalElements
        };
      })
    );
  }

  getUser(userId: string): Observable<User> {
    return this.http.get<User>(this.url + '/users/' + userId);
  }

  createUser(user: User): Observable<any> {
    return this.http.post(this.url + '/users', user);
  }

  updateUserDetails(user: User): Observable<any> {
    return this.http.put(this.url + '/users', user);
  }

  blockTpp(userId: string) {
    return this.http.post(`${this.url}/users/status?userId=${userId}`, userId);
  }

  deleteUser(userId: string) {
    return this.http.delete(`${this.url}/user/${userId}`);
  }

  public resetPasswordViaEmail(login: string): Observable<any> {
    return this.http.post(`${this.url}'/users/reset/password/` + login, null);
  }

}
