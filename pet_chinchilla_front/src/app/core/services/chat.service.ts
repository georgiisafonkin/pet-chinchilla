import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface Message {
  id: number;
  sender_id: number;
  sender_username: string;
  recipient_id: number;
  text: string;
  is_read: boolean;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private socket: WebSocket | null = null;
  private messageSubject = new Subject<Message>();
  message$ = this.messageSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  getHistory(withUserId: number): Observable<Message[]> {
    return this.http.get<Message[]>(
      `${environment.apiUrl}/chat/messages/?with=${withUserId}`
    );
  }

  connect(recipientId: number): void {
    const token = this.authService.getAccessToken();
    const url = `${environment.wsUrl}/chat/${recipientId}/?token=${token}`;

    this.socket = new WebSocket(url);

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'chat.message') {
        this.messageSubject.next(data);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  sendMessage(text: string): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ text }));
    }
  }

  disconnect(): void {
    this.socket?.close();
    this.socket = null;
  }
}