import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { ChatService, Message } from '../../../core/services/chat.service';
import { BreederService, Breeder } from '../../../core/services/breeder.service';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatBadgeModule,
  ],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.css',
})
export class ConversationComponent implements OnInit, OnDestroy, AfterViewChecked {
  breeders: Breeder[] = [];
  selectedBreeder: Breeder | null = null;
  messages: Message[] = [];
  text = '';
  loading = false;
  error = '';
  private shouldScroll = false;
  private messageSub: Subscription | null = null;

  @ViewChild('messageList') messageList!: ElementRef;

  constructor(
    private chatService: ChatService,
    private breederService: BreederService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.breederService.getAll().subscribe({
      next: (data) => {
        this.breeders = data;
        this.cdr.detectChanges();
      },
      error: () => this.error = 'Failed to load breeders.',
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  selectBreeder(breeder: Breeder): void {
    if (this.selectedBreeder?.id === breeder.id) return;

    this.chatService.disconnect();
    if (this.messageSub) this.messageSub.unsubscribe();

    this.selectedBreeder = breeder;
    this.messages = [];
    this.loading = true;

    this.chatService.getHistory(breeder.id).subscribe({
      next: (data) => {
        this.messages = data;
        this.loading = false;
        this.shouldScroll = true;
      },
      error: () => {
        this.error = 'Failed to load messages.';
        this.loading = false;
      },
    });

    this.chatService.connect(breeder.id);
    this.messageSub = this.chatService.message$.subscribe(message => {
      this.messages.push(message);
      this.shouldScroll = true;
    });
  }

  sendMessage(): void {
    if (!this.text.trim()) return;
    this.chatService.sendMessage(this.text);
    this.text = '';
  }

  scrollToBottom(): void {
    if (this.messageList) {
      this.messageList.nativeElement.scrollTop =
        this.messageList.nativeElement.scrollHeight;
    }
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
    this.messageSub?.unsubscribe();
  }
}