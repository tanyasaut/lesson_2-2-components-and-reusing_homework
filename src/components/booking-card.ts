import type { Booking } from '../models/booking'

// Заготовка компонента. Рабочие обычные карточки находятся в legacy-card.ts.
export class BookingCard extends HTMLElement {
  private current: Booking | null = null
  private nameText = document.createElement('h3')
  private seatsText = document.createElement('p')
  private sourceText = document.createElement('p')
  private statusText = document.createElement('p')
  private button = document.createElement('button')

  constructor() {
    super()
    const style = document.createElement('style')
    style.textContent = `
      :host { display: block; min-width: 0; font-family: inherit; }
      article { border: 1px solid #c5d7d0; border-radius: 12px; padding: 16px; background: white; color: #203a34; }
      h3 { margin: 0 0 8px; overflow-wrap: anywhere; }
      p { margin: 6px 0; }
      button { background: #355bd4; color: white; border: 0; border-radius: 6px; padding: 9px 14px; font: inherit; cursor: pointer; }
      button:disabled { background: #dfe6e3; color: #52665e; cursor: default; }
      button:focus-visible { outline: 3px solid #a15c00; outline-offset: 3px; }
    `
    const article = document.createElement('article')
    this.button.type = 'button'
    article.append(this.nameText, this.seatsText, this.sourceText, this.statusText, this.button)
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.append(style, article)   
    this.render()
  }

  set booking(value: Booking | null) {
    this.current = value
    this.render()
  }

  private render() {
    const booking = this.current
    if (!booking) {
      this.nameText.textContent = 'Ожидаю данные'
      this.seatsText.textContent = ''
      this.sourceText.textContent = ''
      this.statusText.textContent = ''
      this.button.textContent = 'Подтвердить'
      this.button.disabled = true
      return
    }
    this.nameText.textContent = booking.name 
    this.seatsText.textContent = `Участников: ${booking.seats}`
    this.sourceText.textContent = `Источник: ${booking.source}`
    
    if (booking.status === 'new') {
      this.statusText.textContent = 'Новая заявка'
      this.button.textContent = 'Подтвердить'
      this.button.disabled = false
    } else {
      this.statusText.textContent = 'Подтверждена'
      this.button.textContent = 'Вернуть в очередь'
      this.button.disabled = false
    }
  }

  private onAction = () => {
    if (!this.current) return
    const nextStatus = this.current.status === 'new' ? 'confirmed' : 'new'
    
    const event = new CustomEvent('booking-status-request', {
      detail: { 
        id: this.current.id, 
        nextStatus 
      },
      bubbles: true, 
      composed: true 
    })
    
    this.dispatchEvent(event)
   }

  connectedCallback() {
    this.button.addEventListener('click', this.onAction)
  }

  disconnectedCallback() {
    this.button.removeEventListener('click', this.onAction)
  }
}

customElements.define('booking-card', BookingCard)
// Д1: реакция на compact. Д2: слот note. Д3: сохранение узлов и тема.
