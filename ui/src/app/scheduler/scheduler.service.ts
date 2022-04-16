import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

const apiRoot = environment.apiRoot;

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {


  constructor(
    private httpService: HttpClient
  ) { }

  getAllInterviews(): Observable<Interview[]> {
    return this.httpService.get<Interview[]>(`${apiRoot}interview`);
  }

  getInterviewById(id: number): Observable<Interview> {
    return this.httpService.get<Interview>(`${apiRoot}interview/${id}`);
  }

  createInterview(data: CreateInterview): Observable<Interview> {
    return this.httpService.post<Interview>(`${apiRoot}interview`, data);
  }

  updateInterview(data: UpdateInterview, id: number) {
    return this.httpService.patch<Interview>(`${apiRoot}interview/${id}`, data);
  }

  deleteInterview(id: number) {
    return this.httpService.delete<void>(`${apiRoot}interview/${id}`);
  }

  getCurrentStatus(): Observable<CurrentStatus> {
    return this.httpService.get<CurrentStatus>(`${apiRoot}interview/status`);
  }

  confirmInterview(id: number, request: {startDate: string, endDate: string}): Observable<void> {
    return this.httpService.post<void>(`${apiRoot}interview/confirm/${id}`, {startDate: request.startDate, endDate: request.endDate});
  }

  cancelInterview(id: number): Observable<void> {
    return this.httpService.post<void>(`${apiRoot}interview/cancel/${id}`, {});
  }
}

export interface Interview {
  id: number,
  student: User,
  mentor?: User,
  startDate: string,
  endDate: string,
  status: InterviewStatus
}

export interface CreateInterview {
  student: string,
  startDate: string,
  endDate: string,
}

export interface UpdateInterview {
  student?: string,
  mentor?: string,
  startDate?: string,
  endDate?: string,
}

export interface User {
  discordID: string,
  username: string,
  color: string
}

export enum InterviewStatus {
  pending = 'PENDING',
  completed = 'COMPLETED',
  cancelled = 'CANCELLED'
}

export interface CurrentStatus {
  hasScheduled: boolean
  closestInterview: Interview | null
}

export enum StudentStatus {
  empty = 'EMPTY',
  filled = 'FILLED',
  scheduled = 'SCHEDULED'
}
