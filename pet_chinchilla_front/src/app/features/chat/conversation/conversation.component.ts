import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatService, Message } from '../../../core/services/chat.service';
import { BreederService, Breeder } from '../../../core/services/breeder.service';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conversation.component.html',
})
export class ConversationComponent implements OnInit, OnDestroy {
  breeders: Breeder[] = [];
  selectedBreeder: Breeder | null = null;
  messages: Message[] = [];
  text = '';
  loading = false;
  error = '';

  private messageSub: Subscription | null = null;

  @ViewChild('messageList') messageList!: ElementRef;

  constructor(
    private chatService: ChatService,
    private breederService: BreederService,
  ) {}

  ngOnInit(): void {
    this.breederService.getAll().subscribe({
      next: (data) => this.breeders = data,
      error: () => this.error = 'Failed to load breeders.',
    });
  }

  selectBreeder(breeder: Breeder): void {
    this.chatService.disconnect();
    if (this.messageSub) this.messageSub.unsubscribe();

    this.selectedBreeder = breeder;
    this.messages = [];
    this.loading = true;

    this.chatService.getHistory(breeder.id).subscribe({
      next: (data) => {
        this.messages = data;
        this.loading = false;
        this.scrollToBottom();
      },
      error: () => {
        this.error = 'Failed to load messages.';
        this.loading = false;
      },
    });

    this.chatService.connect(breeder.id);
    this.messageSub = this.chatService.message$.subscribe(message => {
      this.messages.push(message);
      this.scrollToBottom();
    });
  }

  sendMessage(): void {
    if (!this.text.trim()) return;
    this.chatService.sendMessage(this.text);
    this.text = '';
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.messageList) {
        this.messageList.nativeElement.scrollTop =
          this.messageList.nativeElement.scrollHeight;
      }
    }, 50);
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
    this.messageSub?.unsubscribe();
  }
}