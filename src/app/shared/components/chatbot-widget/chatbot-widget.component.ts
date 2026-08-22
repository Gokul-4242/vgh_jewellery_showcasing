import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot-widget.component.html',
  styleUrl: './chatbot-widget.component.css'
})
export class ChatbotWidgetComponent {
  private readonly http = inject(HttpClient);

  isOpen = signal(false);
  isLoading = signal(false);
  draft = '';
  messages = signal<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'Hi! I can help you with jewellery collections, shipping, payment, and product recommendations.'
    }
  ]);

  toggleChat(): void {
    this.isOpen.update(current => !current);
  }

  sendMessage(): void {
    const message = this.draft.trim();

    if (!message || this.isLoading()) {
      return;
    }

    this.messages.update(current => [...current, { sender: 'user', text: message }]);
    this.draft = '';
    this.isLoading.set(true);

    this.http
      .post<{ reply?: string; error?: string }>('/api/chat', { message })
      .subscribe({
        next: response => {
          const reply = response.reply ?? response.error ?? 'Sorry, I could not respond right now.';
          this.messages.update(current => [...current, { sender: 'bot', text: reply }]);
        },
        error: () => {
          this.messages.update(current => [
            ...current,
            {
              sender: 'bot',
              text: 'The chatbot is unavailable right now. Please make sure the Python backend is running on port 5000.'
            }
          ]);
        },
        complete: () => {
          this.isLoading.set(false);
        }
      });
  }
}
