import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Calendar } from '@fullcalendar/core';
import {
  CalendarOptions,
  EventInput,
  BusinessHoursInput,
} from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { VetService } from '../../../../services/vet.service';
import { CitasService } from '../../../../services/citas.service';
import { CitaDto } from '../../../../models/dtos/cita-dto';
import { HorarioDiaDto } from '../../../../models/dtos/horario-dia-dto';

// ── Mapeo de días español → número JS (0=Dom, 1=Lun, …) ────────────────────
const DIA_A_NUM: Record<string, number> = {
  domingo: 0,
  lunes: 1,
  martes: 2,
  miercoles: 3,
  jueves: 4,
  viernes: 5,
  sabado: 6,
};

// ── Paleta de colores por tipo de cita ─────────────────────────────────────
type ColorTipo = { bg: string; border: string; text: string };

const PALETA_TIPOS: ColorTipo[] = [
  { bg: '#eaf1ff', border: '#bfd0f1', text: '#35507a' },
  { bg: '#eff3ff', border: '#c7cef3', text: '#3d4f88' },
  { bg: '#f5efff', border: '#d8c7f3', text: '#5b4a84' },
  { bg: '#fff2ea', border: '#f0ceb7', text: '#7a5a43' },
  { bg: '#eef7f6', border: '#c6dfdb', text: '#3f6761' },
  { bg: '#f6f2ea', border: '#e1d5bf', text: '#6f634c' },
];

const COLOR_FALLBACK: ColorTipo = {
  bg: '#f2f5fb',
  border: '#d5deec',
  text: '#42597b',
};

@Component({
  selector: 'app-semana-citas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './semana-citas.component.html',
  styleUrls: ['./semana-citas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SemanaCitasComponent implements OnInit, OnDestroy {
  @Input() vetId!: string | number;

  @ViewChild('calendarEl')
  set calendarEl(ref: ElementRef<HTMLDivElement> | undefined) {
    this.calendarContainer = ref;
    if (ref) {
      this.inicializarCalendar();
      this.sincronizarCalendar();
      return;
    }

    this.calendar?.destroy();
    this.calendar = undefined;
  }

  semanaOffset = 0;
  horario: HorarioDiaDto[] = [];
  cargando = true;
  error = false;
  tiposCita: string[] = [];

  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin, dayGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    locale: esLocale,
    headerToolbar: false, // usamos nuestro propio header de navegación
    allDaySlot: false,
    slotDuration: '00:15:00',
    slotLabelInterval: '00:30:00',
    height: 620,
    eventMinHeight: 58,
    expandRows: true,
    nowIndicator: true,
    firstDay: 1, // semana empieza el lunes
    businessHours: [],
    events: [],
    eventClick: (info) => this.onEventClick(info),
    eventContent: (arg) => this.renderEvento(arg),
    slotLabelFormat: { hour: 'numeric', minute: '2-digit', hour12: true },
  };

  private fechaInicioSemana: Date = this.lunesDeSemana(0);
  private calendar?: Calendar;
  private calendarContainer?: ElementRef<HTMLDivElement>;
  private colorPorTipo = new Map<string, ColorTipo>();

  constructor(
    private vetService: VetService,
    private citasService: CitasService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnDestroy(): void {
    this.calendar?.destroy();
  }

  ngOnInit(): void {
    this.cargarTiposCita();

    // 1. Carga el horario estático del veterinario
    this.vetService.getDetails().subscribe({
      next: (vet) => {
        this.vetId = vet.id!;
        this.vetService.getHorarioSemanalByVetId(this.vetId).subscribe({
          next: (data) => {
            this.horario = data;
            this.aplicarHorario();
            this.cargarCitas(); // 2. Luego carga las citas de esta semana
          },
          error: () => {
            this.error = true;
            this.cargando = false;
            this.cdr.markForCheck();
          },
        });
      },
    });
  }

  // ── Navegación ─────────────────────────────────────────────────────────────
  semanaSiguiente(): void {
    this.semanaOffset++;
    this.cargarCitas();
  }
  semanaAnterior(): void {
    this.semanaOffset--;
    this.cargarCitas();
  }
  irAHoy(): void {
    if (this.semanaOffset !== 0) {
      this.semanaOffset = 0;
      this.cargarCitas();
    }
  }

  // ── Horario → businessHours de FullCalendar ────────────────────────────────
  private aplicarHorario(): void {
    const businessHours: BusinessHoursInput = this.horario.map((dia) => ({
      daysOfWeek: [this.diaANum(dia.diaSemana)],
      startTime: this.a24h(dia.horaInicio),
      endTime: this.a24h(dia.horaFin),
    }));

    this.calendarOptions = {
      ...this.calendarOptions,
      businessHours,
      slotMinTime: this.minHora(),
      slotMaxTime: this.maxHora(),
    };
    this.sincronizarCalendar();
  }

  // ── Citas → eventos de FullCalendar ────────────────────────────────────────
  cargarCitas(): void {
    this.cargando = true;
    this.error = false;

    this.vetService
      .getCitasSemanalesByVetId(this.vetId, this.semanaOffset)
      .subscribe({
        next: (citas) => {
          this.fechaInicioSemana = this.lunesDeSemana(this.semanaOffset);
          this.calendarOptions = {
            ...this.calendarOptions,
            initialDate: this.fechaInicioSemana,
            events: this.mapearCitas(citas),
          };
          this.sincronizarCalendar();
          this.cargando = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.error = true;
          this.cargando = false;
          this.cdr.markForCheck();
        },
      });
  }

  private mapearCitas(citas: CitaDto[]): EventInput[] {
    return citas.map((c) => {
      const fecha = this.fechaDeCita(c.diaSemana);
      const inicio = this.a24h(c.hora);
      const fin = this.sumarMin(inicio, c.duracionMinutos);
      const color = this.colorDeTipo(c.tipoCitaNombre);
      return {
        id: String(c.id),
        title: c.petNombre,
        start: `${fecha}T${inicio}`,
        end: `${fecha}T${fin}`,
        backgroundColor: color.bg,
        borderColor: color.border,
        textColor: color.text,
        extendedProps: {
          ownerNombre: c.ownerNombre,
          tipoCitaNombre: c.tipoCitaNombre,
          duracionMinutos: c.duracionMinutos,
          hora: c.hora,
        },
      };
    });
  }

  // ── Render personalizado de la tarjeta de evento ───────────────────────────
  private renderEvento(arg: any): { html: string } {
    const { ownerNombre, hora, duracionMinutos } = arg.event.extendedProps;
    return {
      html: `
        <div class="fc-ev">
          <div class="fc-ev-meta">
            <span class="fc-ev-hora">${hora}</span>
            <span class="fc-ev-dur">${duracionMinutos}'</span>
          </div>
          <div class="fc-ev-mascota">${arg.event.title}</div>
          <div class="fc-ev-dueno">${ownerNombre}</div>
        </div>`,
    };
  }

  // Aquí puedes abrir un modal/panel lateral con el detalle de la cita
  private onEventClick(info: any): void {
    console.log('Cita:', info.event.id, info.event.extendedProps);
  }

  // ── Utilidades ─────────────────────────────────────────────────────────────
  private norm(s: string): string {
    return s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  private diaANum(d: string): number {
    return DIA_A_NUM[this.norm(d)] ?? 1;
  }

  /** "10:00 AM" → "10:00:00"  |  "02:00 PM" → "14:00:00" */
  private a24h(hora: string): string {
    const [time, ap] = hora.split(' ');
    let [h, m] = time.split(':').map(Number);
    if (ap?.toUpperCase() === 'PM' && h !== 12) h += 12;
    if (ap?.toUpperCase() === 'AM' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${String(m ?? 0).padStart(2, '0')}:00`;
  }

  private sumarMin(h24: string, min: number): string {
    const [h, m] = h24.split(':').map(Number);
    const t = h * 60 + m + min;
    return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}:00`;
  }

  private lunesDeSemana(off: number): Date {
    const hoy = new Date();
    const dow = hoy.getDay();
    const d = new Date(hoy);
    d.setDate(hoy.getDate() - (dow === 0 ? 6 : dow - 1) + off * 7);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private fechaDeCita(diaSemana: string): string {
    const numDia = this.diaANum(diaSemana);
    const off = numDia === 0 ? 6 : numDia - 1; // lunes = offset 0
    const d = new Date(this.fechaInicioSemana);
    d.setDate(d.getDate() + off);
    return d.toISOString().slice(0, 10);
  }

  private colorDeTipo(tipo: string): ColorTipo {
    const key = this.norm(tipo);
    const existente = this.colorPorTipo.get(key);
    if (existente) {
      return existente;
    }

    const color =
      PALETA_TIPOS[this.colorPorTipo.size % PALETA_TIPOS.length] ??
      COLOR_FALLBACK;
    this.colorPorTipo.set(key, color);
    return color;
  }

  getEstiloLeyenda(tipo: string): Record<string, string> {
    const color = this.colorDeTipo(tipo);
    return {
      backgroundColor: color.bg,
      borderColor: color.border,
      color: color.text,
    };
  }

  private cargarTiposCita(): void {
    this.citasService.getTiposCita().subscribe({
      next: (tipos) => {
        this.tiposCita = tipos;
        tipos.forEach((tipo) => this.colorDeTipo(tipo));
        this.cdr.markForCheck();
      },
      error: () => {
        this.tiposCita = [];
        this.cdr.markForCheck();
      },
    });
  }

  private minHora(): string {
    return '07:00:00';
  }

  private maxHora(): string {
    return '22:00:00';
  }

  get rangoSemana(): string {
    const lun = this.lunesDeSemana(this.semanaOffset);
    const dom = new Date(lun);
    dom.setDate(lun.getDate() + 6);
    const fmt = (d: Date) =>
      d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
    return `${fmt(lun)} – ${fmt(dom)}, ${dom.getFullYear()}`;
  }

  private inicializarCalendar(): void {
    if (this.calendar || !this.calendarContainer) {
      return;
    }

    this.calendar = new Calendar(
      this.calendarContainer.nativeElement,
      this.calendarOptions,
    );
    this.calendar.render();
  }

  private sincronizarCalendar(): void {
    if (!this.calendar) {
      return;
    }

    if (this.calendarOptions.initialDate) {
      this.calendar.gotoDate(this.calendarOptions.initialDate);
    }

    if (this.calendarOptions.businessHours) {
      this.calendar.setOption(
        'businessHours',
        this.calendarOptions.businessHours,
      );
    }

    if (this.calendarOptions.slotMinTime) {
      this.calendar.setOption('slotMinTime', this.calendarOptions.slotMinTime);
    }

    if (this.calendarOptions.slotMaxTime) {
      this.calendar.setOption('slotMaxTime', this.calendarOptions.slotMaxTime);
    }

    this.calendar.removeAllEvents();
    const events = this.calendarOptions.events;
    if (Array.isArray(events) && events.length) {
      this.calendar.addEventSource(events);
    }
  }
}
