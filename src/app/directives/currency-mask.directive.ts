import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCurrencyMask]',
  standalone: true,
})
export class CurrencyMaskDirective {
  private previousValue: string = '';

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: any) {
    let input = this.el.nativeElement.value;

    // Remove todos os caracteres que não sejam dígitos
    input = input.replace(/\D/g, '');

    // Divide a string de entrada em partes inteira e decimal
    const decimalPart = input.slice(-2); // Últimos dois dígitos como parte decimal
    const integerPart = input.slice(0, -2); // O restante como parte inteira

    // Formata a parte inteira com separador de milhar
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Combina a parte inteira e decimal com vírgula
    const formattedValue = decimalPart ? `${formattedInteger},${decimalPart}` : formattedInteger;

    // Atualiza o campo de input apenas se o valor mudou
    if (formattedValue !== this.previousValue) {
      this.el.nativeElement.value = formattedValue;
      this.previousValue = formattedValue;

      // Dispara o evento 'input' para que o Angular detecte a mudança
      event.target.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}
