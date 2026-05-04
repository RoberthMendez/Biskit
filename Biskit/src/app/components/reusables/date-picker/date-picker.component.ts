import { AfterViewInit, Component, ElementRef, Input, Output, EventEmitter, ViewChild, forwardRef, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

declare var Datepicker: any;

@Component({
  selector: 'app-date-picker',
  standalone: true,
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    }
  ]
})
export class DatepickerComponent implements AfterViewInit, ControlValueAccessor {

  @ViewChild('datepickerInput') input!: ElementRef;
  @Input() placeholder = 'Selecciona fecha';
  @Output() dateChange = new EventEmitter<string>();

  private value: string = '';
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  private datepicker: any;

  ngAfterViewInit(): void {
    // small timeout to ensure element is rendered
    setTimeout(() => {
      Datepicker.locales.es = {
        days: [
          'Domingo',
          'Lunes',
          'Martes',
          'Miércoles',
          'Jueves',
          'Viernes',
          'Sábado',
        ],
        daysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        daysMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
        months: [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre',
        ],
        monthsShort: [
          'Ene',
          'Feb',
          'Mar',
          'Abr',
          'May',
          'Jun',
          'Jul',
          'Ago',
          'Sep',
          'Oct',
          'Nov',
          'Dic',
        ],
        today: 'Hoy',
        clear: 'Borrar',
        weekStart: 1,
      };

      this.datepicker = new Datepicker(this.input.nativeElement, {
        autohide: true,
        language: 'es',
        format: 'yyyy-mm-dd',
        maxDate: new Date(),
      });

      // escuchar ambos eventos por seguridad
      this.input.nativeElement.addEventListener('changeDate', this.handleDateChange);
      this.input.nativeElement.addEventListener('change', this.handleDateChange);

      if (this.value) {
        this.input.nativeElement.value = this.value;
      }
    }, 0);
  }

  writeValue(value: any): void {
    this.value = value || '';
    if (this.input && this.input.nativeElement) {
      this.input.nativeElement.value = this.value;
    }
  }

  handleDateChange = () => {
    const selected = this.input.nativeElement.value;
    this.value = selected;
    this.onChange(selected);
    this.dateChange.emit(selected);
  };

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.input) {
      this.input.nativeElement.disabled = isDisabled;
    }
  }
}
