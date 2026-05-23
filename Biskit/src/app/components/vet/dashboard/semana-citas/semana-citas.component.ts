import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Calendar } from '@fullcalendar/core';
import { forkJoin } from 'rxjs';
import {
  CalendarOptions,
  EventInput,
  BusinessHoursInput,
  EventDropArg,
} from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { VetService } from '../../../../services/vet.service';
import { CitasService } from '../../../../services/citas.service';
import { PetService } from '../../../../services/pet.service';
import { CitaDto } from '../../../../models/dtos/cita-dto';
import { HorarioDiaDto } from '../../../../models/dtos/horario-dia-dto';
import { TipoCita } from '../../../../models/Citas/tipo-cita';
import { PetDTO } from '../../../../models/dtos/pet-dto';
import {
  AddCitaComponent,
  SlotCitaSeleccionado,
} from '../../citas/add-cita/add-cita.component';

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
type EditarCitaDropdownKey = 'tipo' | 'mascota';

const PALETA_TIPOS: ColorTipo[] = [
  { bg: '#e8f1ff', border: '#b9cff1', text: '#35537f' },
  { bg: '#eef8ea', border: '#c6e1be', text: '#4a7450' },
  { bg: '#fff0e5', border: '#efc6a8', text: '#8a5b3d' },
  { bg: '#f6ecff', border: '#d8c2ef', text: '#6b4b8a' },
  { bg: '#eaf8f6', border: '#c4e3de', text: '#3f6761' },
  { bg: '#fff7e8', border: '#efdcb5', text: '#8a6b38' },
  { bg: '#f4eefc', border: '#d9c8ee', text: '#66518b' },
  { bg: '#fceef2', border: '#edc7d2', text: '#8d4f66' },
];

const COLOR_POR_TIPO_EXPLICITO: Record<string, ColorTipo> = {
  'consulta general': { bg: '#e8f1ff', border: '#b9cff1', text: '#35537f' },
  'consulta de control': { bg: '#eef8ea', border: '#c6e1be', text: '#4a7450' },
  desparasitacion: { bg: '#eaf8f6', border: '#bfe2db', text: '#35635a' },
  'consulta especializada': {
    bg: '#fff7d9',
    border: '#e8d792',
    text: '#8a6a18',
  },
  'certificado para viaje': {
    bg: '#fde7f0',
    border: '#ecbfd2',
    text: '#8f4e73',
  },
  'examenes diagnosticos': {
    bg: '#fff1e3',
    border: '#efc6a4',
    text: '#8a5b3d',
  },
  vacunacion: { bg: '#fceef2', border: '#edc7d2', text: '#8d4f66' },
  'consulta domiciliaria': {
    bg: '#f5ecff',
    border: '#d8c3ef',
    text: '#6b4b8a',
  },
};

const COLOR_FALLBACK: ColorTipo = {
  bg: '#f2f5fb',
  border: '#d5deec',
  text: '#42597b',
};

@Component({
  selector: 'app-semana-citas',
  standalone: true,
  imports: [CommonModule, FormsModule, AddCitaComponent],
  templateUrl: './semana-citas.component.html',
  styleUrls: ['./semana-citas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SemanaCitasComponent implements OnInit, OnDestroy {
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

  vetId: number = 0;
  semanaOffset = 0;
  horario: HorarioDiaDto[] = [];
  cargando = true;
  error = false;
  tiposCita: string[] = [];
  tiposCitaCatalogo: TipoCita[] = [];
  mascotasCatalogo: PetDTO[] = [];
  catalogosCrearCitaCargados = false;
  cargandoCatalogosCrearCita = false;
  modalCrearCitaAbierto = false;
  slotSeleccionado: SlotCitaSeleccionado | null = null;
  modalEliminarCitaAbierto = false;
  citaEliminarId: number | null = null;
  citaEliminarNombre = '';
  eliminandoCita = false;
  eliminarCitaError = '';
  eliminarCitaSuccess = '';
  editandoCitaId: number | null = null;
  editarCitaError = '';
  editarCitaSuccess = '';
  arrastrandoCita = false;
  dragNavDireccion: 'anterior' | 'siguiente' | null = null;
  modalEditarCitaAbierto = false;
  citaEditar: CitaDto | null = null;
  citaEditarId: number | null = null;
  citaEditarFecha: Date | null = null;
  editarTipoCitaNombre = '';
  editarTipoSearchText = '';
  editarPetId: number | null = null;
  editarMascotaSearchText = '';
  editarDropdownOpen: Record<EditarCitaDropdownKey, boolean> = {
    tipo: false,
    mascota: false,
  };
  guardarEditarCitaError = '';
  guardarEditarCitaSuccess = '';

  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin, dayGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    locale: esLocale,
    headerToolbar: false, // usamos nuestro propio header de navegación
    allDaySlot: false,
    slotDuration: '00:15:00',
    slotLabelInterval: '00:30:00',
    height: 550,
    eventMinHeight: 58,
    expandRows: true,
    nowIndicator: true,
    firstDay: 1, // semana empieza el lunes
    editable: true,
    eventDurationEditable: false,
    snapDuration: '00:15:00',
    businessHours: [],
    events: [],
    dateClick: (info) => this.onDateClick(info),
    eventClick: (info) => this.onEventClick(info),
    eventDragStart: (info) => this.onEventDragStart(info),
    eventDragStop: () => this.onEventDragStop(),
    eventDrop: (info) => this.onEventDrop(info),
    eventAllow: (dropInfo, draggedEvent) =>
      this.esDropCitaPermitido(
        dropInfo.start,
        dropInfo.end,
        draggedEvent?.id,
      ),
    eventDidMount: (info) => this.ajustarTooltipEvento(info),
    eventContent: (arg) => this.renderEvento(arg),
    slotLabelFormat: { hour: 'numeric', minute: '2-digit', hour12: true },
  };

  private fechaInicioSemana: Date = this.lunesDeSemana(0);
  private calendar?: Calendar;
  private calendarContainer?: ElementRef<HTMLDivElement>;
  private colorPorTipo = new Map<string, ColorTipo>();
  private fechaModalPendiente: Date | null = null;
  private eliminarCitaTimeout: ReturnType<typeof setTimeout> | null = null;
  private editarCitaTimeout: ReturnType<typeof setTimeout> | null = null;
  private editarCitaModalTimeout: ReturnType<typeof setTimeout> | null = null;
  private dragNavTimeout: ReturnType<typeof setTimeout> | null = null;
  private citasPorSemana = new Map<number, CitaDto[]>();
  private semanasRenderizadas = new Set<number>();
  private semanasCargandoParaDrag = new Set<number>();
  private callbacksSemanaDrag = new Map<number, Array<() => void>>();
  private onDocumentDragMove = (event: Event): void =>
    this.onDragPointerMove(event as MouseEvent | TouchEvent);

  constructor(
    private vetService: VetService,
    private citasService: CitasService,
    private petService: PetService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnDestroy(): void {
    this.calendar?.destroy();
    this.clearEliminarCitaTimeout();
    this.clearEditarCitaTimeout();
    this.clearEditarCitaModalTimeout();
    this.detenerArrastreCita();
  }

  ngOnInit(): void {
    this.cargarCatalogosCrearCita();

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

    if (!this.arrastrandoCita) {
      this.citasPorSemana.clear();
      this.semanasRenderizadas.clear();
    }

    this.vetService
      .getCitasSemanalesByVetId(this.vetId, this.semanaOffset)
      .subscribe({
        next: (citas) => {
          this.citasPorSemana.set(this.semanaOffset, citas);
          this.fechaInicioSemana = this.lunesDeSemana(this.semanaOffset);
          const eventosCitas = this.mapearCitas(citas);
          this.calendarOptions = {
            ...this.calendarOptions,
            initialDate: this.fechaInicioSemana,
            events: [...this.mapearSlotsDisponibles(citas), ...eventosCitas],
          };
          this.sincronizarCalendar();
          this.semanasRenderizadas.clear();
          this.semanasRenderizadas.add(this.semanaOffset);
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

  private mapearCitas(
    citas: CitaDto[],
    inicioSemana: Date = this.fechaInicioSemana,
  ): EventInput[] {
    return citas.map((c) => {
      const fecha = this.fechaDeCita(c.diaSemana, inicioSemana);
      const inicio = this.a24h(c.hora);
      const fin = this.sumarMin(inicio, c.duracionMinutos);
      const color = this.colorDeTipo(c.tipoCitaNombre);
      return {
        id: c.id != null ? String(c.id) : undefined,
        title: c.petNombre ?? 'Mascota',
        start: `${fecha}T${inicio}`,
        end: `${fecha}T${fin}`,
        backgroundColor: color.bg,
        borderColor: color.border,
        textColor: color.text,
        editable: true,
        startEditable: true,
        durationEditable: false,
        extendedProps: {
          citaId: c.id,
          cita: { ...c },
          ownerNombre: c.ownerNombre ?? '',
          tipoCitaNombre: c.tipoCitaNombre,
          duracionMinutos: c.duracionMinutos,
          hora: c.hora,
        },
      };
    });
  }

  // ── Render personalizado de la tarjeta de evento ───────────────────────────
  private renderEvento(arg: any): { html: string } {
    if (arg.event.extendedProps?.esSlotDisponible) {
      return { html: '' };
    }

    const { ownerNombre, hora, duracionMinutos, tipoCitaNombre, citaId } =
      arg.event.extendedProps;
    const tipoSeguro = this.escapeHtml(tipoCitaNombre ?? 'Tipo de cita');
    const mascotaSegura = this.escapeHtml(arg.event.title ?? 'Mascota');
    const ownerSeguro = this.escapeHtml(ownerNombre ?? '');
    const horaSegura = this.escapeHtml(hora ?? '');
    const duracionSegura = this.escapeHtml(String(duracionMinutos ?? ''));
    const citaIdNumerico = Number(citaId ?? arg.event.id);
    const botonEliminar =
      Number.isFinite(citaIdNumerico) && citaIdNumerico > 0
        ? `
          <button
            type="button"
            class="fc-ev-delete"
            data-cita-id="${citaIdNumerico}"
            aria-label="Cancelar cita de ${mascotaSegura}"
            title="Cancelar cita"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </button>`
        : '';

    return {
      html: `
        <div class="fc-ev" data-tipo-cita="${tipoSeguro}">
          ${botonEliminar}
          <div class="fc-ev-meta">
            <span class="fc-ev-hora">${horaSegura}</span>
            <span class="fc-ev-dur">${duracionSegura}'</span>
          </div>
          <div class="fc-ev-mascota">${mascotaSegura}</div>
          <div class="fc-ev-dueno">${ownerSeguro}</div>
        </div>`,
    };
  }

  // Aquí puedes abrir un modal/panel lateral con el detalle de la cita
  private onEventClick(info: any): void {
    if (info.event.extendedProps?.esSlotDisponible) {
      this.abrirModalCrearCita(info.event.start);
      return;
    }

    this.abrirModalEditarCita(info);
  }

  private onEventDragStart(info: any): void {
    if (info.event.extendedProps?.['esSlotDisponible']) {
      return;
    }

    this.arrastrandoCita = true;
    this.dragNavDireccion = null;
    this.cdr.markForCheck();
    this.escucharMovimientoArrastre();
    this.prepararSemanaParaArrastre(this.semanaOffset - 1);
    this.prepararSemanaParaArrastre(this.semanaOffset + 1);
  }

  private onEventDragStop(): void {
    this.detenerArrastreCita();
  }

  private onEventDrop(info: EventDropArg): void {
    if (info.event.extendedProps?.['esSlotDisponible']) {
      info.revert();
      return;
    }

    const citaOriginal = info.event.extendedProps?.['cita'] as
      | CitaDto
      | undefined;
    const citaId = Number(
      citaOriginal?.id ?? info.event.extendedProps?.['citaId'] ?? info.event.id,
    );
    const nuevaFecha = info.event.start;
    const nuevaFechaFin = info.event.end;

    if (
      !citaOriginal ||
      !Number.isFinite(citaId) ||
      citaId <= 0 ||
      !nuevaFecha ||
      !this.esDropCitaPermitido(nuevaFecha, nuevaFechaFin, info.event.id)
    ) {
      info.revert();
      this.mostrarErrorEditarCita('Ese horario no esta disponible.');
      return;
    }

    const petId = this.resolverPetIdCita(citaOriginal);
    const vetId = citaOriginal.vetId || this.vetId;

    if (!petId) {
      info.revert();
      this.mostrarErrorEditarCita(
        'No fue posible identificar la mascota de la cita.',
      );
      return;
    }

    if (!vetId) {
      info.revert();
      this.mostrarErrorEditarCita(
        'No fue posible identificar el veterinario de la cita.',
      );
      return;
    }

    const citaEditada: CitaDto = {
      ...citaOriginal,
      id: citaId,
      diaSemana: this.nombreDiaSemana(nuevaFecha),
      hora: this.formatearHora12(nuevaFecha),
      petId,
      vetId,
    };
    const numSemana = this.numSemanaDeFecha(nuevaFecha);

    info.event.setExtendedProp('hora', citaEditada.hora);
    info.event.setExtendedProp('cita', citaEditada);

    this.editandoCitaId = citaId;
    this.editarCitaError = '';
    this.editarCitaSuccess = '';
    this.clearEditarCitaTimeout();
    this.cdr.markForCheck();

    this.citasService.editarCita(citaId, citaEditada, numSemana).subscribe({
      next: () => {
        this.editandoCitaId = null;
        this.editarCitaSuccess = 'Cita actualizada correctamente';
        this.cdr.markForCheck();
        this.cargarCitas();
        this.editarCitaTimeout = setTimeout(() => {
          this.editarCitaSuccess = '';
          this.cdr.markForCheck();
        }, 2200);
      },
      error: () => {
        info.revert();
        info.event.setExtendedProp('hora', citaOriginal.hora);
        info.event.setExtendedProp('cita', citaOriginal);
        this.editandoCitaId = null;
        this.mostrarErrorEditarCita('No fue posible actualizar la cita.');
      },
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement | null;

    if (!target?.closest('[data-editar-cita-dropdown]')) {
      this.cerrarDropdownsEditarCita();
    }
  }

  private abrirModalEditarCita(info: any): void {
    if (!this.catalogosCrearCitaCargados) {
      this.cargarCatalogosCrearCita();
      this.mostrarErrorEditarCita(
        'Espera un momento mientras se cargan las mascotas y tipos de cita.',
      );
      return;
    }

    const citaOriginal = info.event.extendedProps?.['cita'] as
      | CitaDto
      | undefined;
    const citaId = Number(
      citaOriginal?.id ?? info.event.extendedProps?.['citaId'] ?? info.event.id,
    );

    if (!citaOriginal || !Number.isFinite(citaId) || citaId <= 0) {
      this.mostrarErrorEditarCita('No fue posible identificar la cita.');
      return;
    }

    const cita = { ...citaOriginal, id: citaId };
    const tipo = this.buscarTipoCitaPorNombre(cita.tipoCitaNombre);
    const petId = this.resolverPetIdCita(cita);
    const mascota = petId
      ? this.mascotasCatalogo.find((item) => item.id === petId)
      : undefined;

    this.clearEditarCitaModalTimeout();
    this.modalEditarCitaAbierto = true;
    this.citaEditar = cita;
    this.citaEditarId = citaId;
    this.citaEditarFecha = info.event.start ? new Date(info.event.start) : null;
    this.editarTipoCitaNombre = tipo?.nombre ?? cita.tipoCitaNombre ?? '';
    this.editarTipoSearchText = this.editarTipoCitaNombre;
    this.editarPetId = petId;
    this.editarMascotaSearchText = mascota?.nombre ?? cita.petNombre ?? '';
    this.cerrarDropdownsEditarCita();
    this.guardarEditarCitaError = petId
      ? ''
      : 'No fue posible identificar la mascota actual. Selecciona una mascota.';
    this.guardarEditarCitaSuccess = '';
    this.cdr.markForCheck();
  }

  cerrarModalEditarCita(): void {
    if (this.editandoCitaId !== null || this.guardarEditarCitaSuccess) {
      return;
    }

    this.limpiarFormularioEditarCita();
    this.cdr.markForCheck();
  }

  get tiposEditarFiltrados(): TipoCita[] {
    const q = this.norm(this.editarTipoSearchText);

    if (!q) {
      return this.tiposCitaCatalogo;
    }

    return this.tiposCitaCatalogo.filter((tipo) =>
      this.norm(tipo.nombre).includes(q),
    );
  }

  get mascotasEditarFiltradas(): PetDTO[] {
    const q = this.norm(this.editarMascotaSearchText);

    if (!q) {
      return this.mascotasCatalogo;
    }

    return this.mascotasCatalogo.filter((mascota) =>
      [mascota.nombre, mascota.owner, mascota.especie, mascota.raza].some(
        (valor) => this.norm(valor ?? '').includes(q),
      ),
    );
  }

  abrirDropdownEditarCita(key: EditarCitaDropdownKey): void {
    (Object.keys(this.editarDropdownOpen) as EditarCitaDropdownKey[]).forEach(
      (dropdownKey) =>
        (this.editarDropdownOpen[dropdownKey] = dropdownKey === key),
    );
  }

  cerrarDropdownsEditarCita(): void {
    (Object.keys(this.editarDropdownOpen) as EditarCitaDropdownKey[]).forEach(
      (dropdownKey) => (this.editarDropdownOpen[dropdownKey] = false),
    );
  }

  seleccionarTipoEditar(tipo: TipoCita): void {
    this.editarTipoCitaNombre = tipo.nombre;
    this.editarTipoSearchText = tipo.nombre;
    this.editarDropdownOpen.tipo = false;
    this.guardarEditarCitaError = '';
  }

  seleccionarMascotaEditar(mascota: PetDTO): void {
    this.editarPetId = mascota.id ?? null;
    this.editarMascotaSearchText = mascota.nombre;
    this.editarDropdownOpen.mascota = false;
    this.guardarEditarCitaError = '';
  }

  onEditarTipoInputChange(): void {
    if (this.tipoEditarSeleccionado?.nombre !== this.editarTipoSearchText) {
      this.editarTipoCitaNombre = '';
    }
  }

  onEditarMascotaInputChange(): void {
    if (
      this.mascotaEditarSeleccionada?.nombre !== this.editarMascotaSearchText
    ) {
      this.editarPetId = null;
    }
  }

  guardarEdicionCita(): void {
    if (!this.puedeGuardarEditarCita || !this.citaEditar) {
      return;
    }

    this.cerrarDropdownsEditarCita();

    const tipo = this.tipoEditarSeleccionado;
    const mascota = this.mascotaEditarSeleccionada;
    const citaId = Number(this.citaEditarId ?? this.citaEditar.id);

    if (!tipo) {
      this.guardarEditarCitaError = 'Selecciona un tipo de cita valido.';
      return;
    }

    if (!mascota?.id) {
      this.guardarEditarCitaError = 'Selecciona una mascota valida.';
      return;
    }

    if (!Number.isFinite(citaId) || citaId <= 0) {
      this.guardarEditarCitaError = 'No fue posible identificar la cita.';
      return;
    }

    const fechaInicio =
      this.citaEditarFecha ?? this.fechaDesdeCita(this.citaEditar);
    const fechaFin = fechaInicio
      ? new Date(fechaInicio.getTime() + tipo.duracionMinutos * 60 * 1000)
      : null;

    if (
      !fechaInicio ||
      !fechaFin ||
      !this.estaRangoDentroDelHorario(fechaInicio, fechaFin)
    ) {
      this.guardarEditarCitaError =
        'La duracion del tipo de cita no cabe en este horario.';
      return;
    }

    if (this.tieneCitaSolapadaEnRango(fechaInicio, citaId, fechaFin)) {
      this.guardarEditarCitaError =
        'La duracion del tipo de cita se cruza con otra cita.';
      return;
    }

    const citaEditada: CitaDto = {
      ...this.citaEditar,
      id: citaId,
      tipoCitaNombre: tipo.nombre,
      duracionMinutos: tipo.duracionMinutos,
      petId: mascota.id,
      petNombre: mascota.nombre,
      ownerNombre: mascota.owner ?? this.citaEditar.ownerNombre ?? '',
      vetId: this.citaEditar.vetId || this.vetId,
    };
    const numSemana = this.numSemanaDeFecha(fechaInicio);

    this.editandoCitaId = citaId;
    this.guardarEditarCitaError = '';
    this.guardarEditarCitaSuccess = '';
    this.clearEditarCitaModalTimeout();
    this.clearEditarCitaTimeout();
    this.cdr.markForCheck();

    this.citasService.editarCita(citaId, citaEditada, numSemana).subscribe({
      next: () => {
        this.editandoCitaId = null;
        this.guardarEditarCitaSuccess = 'Cita actualizada correctamente';
        this.editarCitaSuccess = 'Cita actualizada correctamente';
        this.cdr.markForCheck();

        this.editarCitaModalTimeout = setTimeout(() => {
          this.limpiarFormularioEditarCita();
          this.cargarCitas();
          this.editarCitaTimeout = setTimeout(() => {
            this.editarCitaSuccess = '';
            this.cdr.markForCheck();
          }, 2200);
        }, 600);
      },
      error: (error) => {
        this.editandoCitaId = null;
        this.guardarEditarCitaSuccess = '';
        this.guardarEditarCitaError = this.manejarErrorEditarCita(error);
        this.cdr.markForCheck();
      },
    });
  }

  get tipoEditarSeleccionado(): TipoCita | undefined {
    return this.buscarTipoCitaPorNombre(this.editarTipoCitaNombre);
  }

  get mascotaEditarSeleccionada(): PetDTO | undefined {
    const petId = Number(this.editarPetId);

    if (!Number.isFinite(petId) || petId <= 0) {
      return undefined;
    }

    return this.mascotasCatalogo.find((mascota) => mascota.id === petId);
  }

  get puedeGuardarEditarCita(): boolean {
    return Boolean(
      this.modalEditarCitaAbierto &&
        this.citaEditar &&
        this.citaEditarId &&
        this.tipoEditarSeleccionado &&
        this.mascotaEditarSeleccionada?.id &&
        this.editandoCitaId === null &&
        !this.guardarEditarCitaSuccess,
    );
  }

  private onDateClick(info: DateClickArg): void {
    if (!this.esSlotDisponible(info.date)) {
      return;
    }

    this.abrirModalCrearCita(info.date);
  }

  private ajustarTooltipEvento(info: any): void {
    if (info.event.extendedProps?.esSlotDisponible) {
      info.el.parentElement?.classList.add('fc-slot-disponible-harness');
      info.el.style.minHeight = '0';
      info.el.style.height = '100%';

      info.el.addEventListener('click', (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        this.abrirModalCrearCita(info.event.start);
      });
      return;
    }

    const deleteButton = info.el.querySelector(
      '.fc-ev-delete',
    ) as HTMLButtonElement | null;

    deleteButton?.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const citaId = Number(
        deleteButton.dataset['citaId'] ??
          info.event.extendedProps?.citaId ??
          info.event.id,
      );

      if (!Number.isFinite(citaId) || citaId <= 0) {
        return;
      }

      this.abrirConfirmacionEliminarCita(citaId, info.event.title);
    });

    const horaInicio = info.event.start?.getHours() ?? 0;
    if (horaInicio < 10) {
      info.el.classList.add('fc-ev-tooltip-below');
    }
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

  private minutosAHora(minutosTotales: number): string {
    return `${String(Math.floor(minutosTotales / 60)).padStart(2, '0')}:${String(
      minutosTotales % 60,
    ).padStart(2, '0')}:00`;
  }

  private horaAMinutos(h24: string): number {
    const [h, m] = h24.split(':').map(Number);
    return h * 60 + (m ?? 0);
  }

  private lunesDeSemana(off: number): Date {
    const hoy = new Date();
    const dow = hoy.getDay();
    const d = new Date(hoy);
    d.setDate(hoy.getDate() - (dow === 0 ? 6 : dow - 1) + off * 7);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private fechaDeCita(
    diaSemana: string,
    inicioSemana: Date = this.fechaInicioSemana,
  ): string {
    const numDia = this.diaANum(diaSemana);
    const off = numDia === 0 ? 6 : numDia - 1; // lunes = offset 0
    const d = new Date(inicioSemana);
    d.setDate(d.getDate() + off);
    return this.formatearFechaLocal(d);
  }

  private fechaDeDiaNumero(
    numDia: number,
    inicioSemana: Date = this.fechaInicioSemana,
  ): string {
    const off = numDia === 0 ? 6 : numDia - 1;
    const d = new Date(inicioSemana);
    d.setDate(d.getDate() + off);
    return this.formatearFechaLocal(d);
  }

  private colorDeTipo(tipo: string): ColorTipo {
    const key = this.norm(tipo);
    const existente = this.colorPorTipo.get(key);
    if (existente) {
      return existente;
    }

    const colorFijo = COLOR_POR_TIPO_EXPLICITO[key];
    if (colorFijo) {
      this.colorPorTipo.set(key, colorFijo);
      return colorFijo;
    }

    const hash = this.hashCadena(key);
    const color =
      PALETA_TIPOS[Math.abs(hash) % PALETA_TIPOS.length] ?? COLOR_FALLBACK;
    this.colorPorTipo.set(key, color);
    return color;
  }

  private hashCadena(texto: string): number {
    let hash = 0;

    for (let i = 0; i < texto.length; i++) {
      hash = (hash * 31 + texto.charCodeAt(i)) | 0;
    }

    return hash;
  }

  private clearEliminarCitaTimeout(): void {
    if (!this.eliminarCitaTimeout) {
      return;
    }

    clearTimeout(this.eliminarCitaTimeout);
    this.eliminarCitaTimeout = null;
  }

  private clearEditarCitaTimeout(): void {
    if (!this.editarCitaTimeout) {
      return;
    }

    clearTimeout(this.editarCitaTimeout);
    this.editarCitaTimeout = null;
  }

  private clearEditarCitaModalTimeout(): void {
    if (!this.editarCitaModalTimeout) {
      return;
    }

    clearTimeout(this.editarCitaModalTimeout);
    this.editarCitaModalTimeout = null;
  }

  private mostrarErrorEditarCita(mensaje: string): void {
    this.clearEditarCitaTimeout();
    this.editarCitaError = mensaje;
    this.editarCitaSuccess = '';
    this.cdr.markForCheck();
    this.editarCitaTimeout = setTimeout(() => {
      this.editarCitaError = '';
      this.cdr.markForCheck();
    }, 2600);
  }

  private resolverPetIdCita(cita: CitaDto): number | null {
    const petId = Number(cita.petId);

    if (Number.isFinite(petId) && petId > 0) {
      return petId;
    }

    const mascota = this.buscarMascotaDeCita(cita);
    return mascota?.id ?? null;
  }

  private buscarMascotaDeCita(cita: CitaDto): PetDTO | undefined {
    const nombreMascota = this.norm(cita.petNombre ?? '');

    if (!nombreMascota) {
      return undefined;
    }

    const candidatas = this.mascotasCatalogo.filter(
      (mascota) => this.norm(mascota.nombre ?? '') === nombreMascota,
    );

    if (candidatas.length === 1) {
      return candidatas[0];
    }

    const ownerNombre = this.norm(cita.ownerNombre ?? '');

    if (!ownerNombre) {
      return undefined;
    }

    const candidatasPorOwner = candidatas.filter(
      (mascota) => this.norm(mascota.owner ?? '') === ownerNombre,
    );

    return candidatasPorOwner.length === 1 ? candidatasPorOwner[0] : undefined;
  }

  private buscarTipoCitaPorNombre(nombre: string): TipoCita | undefined {
    const tipoNormalizado = this.norm(nombre ?? '');

    if (!tipoNormalizado) {
      return undefined;
    }

    return this.tiposCitaCatalogo.find(
      (tipo) => this.norm(tipo.nombre) === tipoNormalizado,
    );
  }

  private fechaDesdeCita(cita: CitaDto): Date | null {
    const fecha = this.fechaDeCita(cita.diaSemana);
    const hora = this.a24h(cita.hora);
    const fechaCita = new Date(`${fecha}T${hora}`);

    return Number.isNaN(fechaCita.getTime()) ? null : fechaCita;
  }

  private limpiarFormularioEditarCita(): void {
    this.clearEditarCitaModalTimeout();
    this.modalEditarCitaAbierto = false;
    this.citaEditar = null;
    this.citaEditarId = null;
    this.citaEditarFecha = null;
    this.editarTipoCitaNombre = '';
    this.editarTipoSearchText = '';
    this.editarPetId = null;
    this.editarMascotaSearchText = '';
    this.cerrarDropdownsEditarCita();
    this.guardarEditarCitaError = '';
    this.guardarEditarCitaSuccess = '';
  }

  private manejarErrorEditarCita(error: any): string {
    const backendMessage = this.getBackendErrorMessage(error);

    if (backendMessage) {
      return backendMessage;
    }

    if (error?.status === 0) {
      return 'No se pudo conectar con el servidor.';
    }

    if (error?.status === 409) {
      return 'Ese horario ya no esta disponible.';
    }

    return 'No fue posible actualizar la cita.';
  }

  private getBackendErrorMessage(error: any): string {
    const body = error?.error;

    if (typeof body === 'string' && body.trim()) {
      return body.trim();
    }

    const message =
      body?.detalle ||
      body?.detail ||
      body?.message ||
      body?.mensaje ||
      body?.error;

    return typeof message === 'string' ? message.trim() : '';
  }

  private escucharMovimientoArrastre(): void {
    document.addEventListener('mousemove', this.onDocumentDragMove, true);
    document.addEventListener('touchmove', this.onDocumentDragMove, true);
  }

  private detenerArrastreCita(): void {
    document.removeEventListener('mousemove', this.onDocumentDragMove, true);
    document.removeEventListener('touchmove', this.onDocumentDragMove, true);
    this.clearDragNavTimeout();

    if (!this.arrastrandoCita && !this.dragNavDireccion) {
      return;
    }

    this.arrastrandoCita = false;
    this.dragNavDireccion = null;
    this.cdr.markForCheck();
  }

  private onDragPointerMove(event: MouseEvent | TouchEvent): void {
    if (!this.arrastrandoCita || this.editandoCitaId !== null) {
      return;
    }

    const punto = this.obtenerPuntoArrastre(event);
    const shell = this.calendarContainer?.nativeElement.parentElement;
    const rect = shell?.getBoundingClientRect();

    if (!punto || !rect || punto.y < rect.top || punto.y > rect.bottom) {
      this.cancelarNavegacionArrastre();
      return;
    }

    const margen = Math.min(96, Math.max(64, rect.width * 0.14));

    if (punto.x <= rect.left + margen) {
      this.programarNavegacionArrastre('anterior');
      return;
    }

    if (punto.x >= rect.right - margen) {
      this.programarNavegacionArrastre('siguiente');
      return;
    }

    this.cancelarNavegacionArrastre();
  }

  private obtenerPuntoArrastre(
    event: MouseEvent | TouchEvent,
  ): { x: number; y: number } | null {
    if ('touches' in event) {
      const touch = event.touches[0] ?? event.changedTouches[0];
      return touch ? { x: touch.clientX, y: touch.clientY } : null;
    }

    return { x: event.clientX, y: event.clientY };
  }

  private programarNavegacionArrastre(
    direccion: 'anterior' | 'siguiente',
  ): void {
    if (this.dragNavDireccion === direccion && this.dragNavTimeout) {
      return;
    }

    this.clearDragNavTimeout();
    this.dragNavDireccion = direccion;
    this.cdr.markForCheck();

    this.dragNavTimeout = setTimeout(() => {
      this.dragNavTimeout = null;
      this.navegarSemanaDuranteArrastre(direccion);
    }, 520);
  }

  private cancelarNavegacionArrastre(): void {
    if (!this.dragNavDireccion && !this.dragNavTimeout) {
      return;
    }

    this.clearDragNavTimeout();
    this.dragNavDireccion = null;
    this.cdr.markForCheck();
  }

  private clearDragNavTimeout(): void {
    if (!this.dragNavTimeout) {
      return;
    }

    clearTimeout(this.dragNavTimeout);
    this.dragNavTimeout = null;
  }

  private navegarSemanaDuranteArrastre(
    direccion: 'anterior' | 'siguiente',
  ): void {
    if (!this.arrastrandoCita || !this.calendar) {
      return;
    }

    const delta = direccion === 'siguiente' ? 1 : -1;
    const semanaDestino = this.semanaOffset + delta;

    this.prepararSemanaParaArrastre(semanaDestino, () => {
      if (
        !this.arrastrandoCita ||
        !this.calendar ||
        this.dragNavDireccion !== direccion
      ) {
        return;
      }

      this.semanaOffset = semanaDestino;
      this.fechaInicioSemana = this.lunesDeSemana(semanaDestino);
      this.calendarOptions = {
        ...this.calendarOptions,
        initialDate: this.fechaInicioSemana,
      };
      this.calendar.gotoDate(this.fechaInicioSemana);
      this.dragNavDireccion = null;
      this.cdr.markForCheck();
      this.prepararSemanaParaArrastre(semanaDestino + delta);
    });
  }

  private prepararSemanaParaArrastre(
    semana: number,
    alTerminar?: () => void,
  ): void {
    const citasCacheadas = this.citasPorSemana.get(semana);

    if (citasCacheadas) {
      this.agregarSemanaAlCalendar(semana, citasCacheadas);
      alTerminar?.();
      return;
    }

    if (this.semanasCargandoParaDrag.has(semana)) {
      if (alTerminar) {
        const callbacks = this.callbacksSemanaDrag.get(semana) ?? [];
        callbacks.push(alTerminar);
        this.callbacksSemanaDrag.set(semana, callbacks);
      }
      return;
    }

    if (!this.vetId) {
      return;
    }

    this.semanasCargandoParaDrag.add(semana);
    this.vetService.getCitasSemanalesByVetId(this.vetId, semana).subscribe({
      next: (citas) => {
        this.citasPorSemana.set(semana, citas);
        this.agregarSemanaAlCalendar(semana, citas);
        this.semanasCargandoParaDrag.delete(semana);
        const callbacks = this.callbacksSemanaDrag.get(semana) ?? [];
        this.callbacksSemanaDrag.delete(semana);
        callbacks.forEach((callback) => callback());
        alTerminar?.();
      },
      error: () => {
        this.semanasCargandoParaDrag.delete(semana);
        this.callbacksSemanaDrag.delete(semana);
        this.dragNavDireccion = null;
        this.cdr.markForCheck();
      },
    });
  }

  private agregarSemanaAlCalendar(semana: number, citas: CitaDto[]): void {
    if (!this.calendar || this.semanasRenderizadas.has(semana)) {
      return;
    }

    const inicioSemana = this.lunesDeSemana(semana);
    this.calendar.addEventSource([
      ...this.mapearSlotsDisponibles(citas, inicioSemana),
      ...this.mapearCitas(citas, inicioSemana),
    ]);
    this.semanasRenderizadas.add(semana);
  }

  private escapeHtml(texto: string): string {
    return texto
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private esSlotDisponible(fecha: Date): boolean {
    return (
      this.estaRangoDentroDelHorario(
        fecha,
        new Date(fecha.getTime() + 15 * 60 * 1000),
      ) && !this.tieneCitaSolapadaEnRango(fecha, undefined)
    );
  }

  private estaDentroDelHorario(fecha: Date): boolean {
    return this.estaRangoDentroDelHorario(
      fecha,
      new Date(fecha.getTime() + 15 * 60 * 1000),
    );
  }

  private estaRangoDentroDelHorario(inicio: Date, fin: Date): boolean {
    const dia = inicio.getDay();
    const minutosInicio = inicio.getHours() * 60 + inicio.getMinutes();
    const minutosFin = fin.getHours() * 60 + fin.getMinutes();

    if (inicio.toDateString() !== fin.toDateString()) {
      return false;
    }

    return this.horario.some((h) => {
      if (this.diaANum(h.diaSemana) !== dia) {
        return false;
      }

      return (
        minutosInicio >= this.horaAMinutos(this.a24h(h.horaInicio)) &&
        minutosFin <= this.horaAMinutos(this.a24h(h.horaFin))
      );
    });
  }

  private tieneCitaSolapada(fecha: Date): boolean {
    return this.tieneCitaSolapadaEnRango(fecha, undefined);
  }

  private tieneCitaSolapadaEnRango(
    inicioFecha: Date,
    citaIdIgnorada: string | number | undefined,
    finFecha?: Date | null,
  ): boolean {
    const inicio = inicioFecha.getTime();
    const fin =
      finFecha?.getTime() ?? inicioFecha.getTime() + 15 * 60 * 1000;
    const citaIgnorada =
      citaIdIgnorada == null ? null : String(citaIdIgnorada);

    return (this.calendar?.getEvents() ?? []).some((evento) => {
      if (evento.extendedProps?.['esSlotDisponible']) {
        return false;
      }

      if (!evento.id || !evento.start || !evento.end) {
        return false;
      }

      const citaEvento = String(
        evento.extendedProps?.['citaId'] ?? evento.id,
      );
      if (
        citaIgnorada &&
        (evento.id === citaIgnorada || citaEvento === citaIgnorada)
      ) {
        return false;
      }

      return inicio < evento.end.getTime() && fin > evento.start.getTime();
    });
  }

  private esDropCitaPermitido(
    inicio: Date | null,
    fin: Date | null,
    citaIdIgnorada: string | number | undefined,
  ): boolean {
    if (!inicio || this.editandoCitaId !== null) {
      return false;
    }

    const finCalculado =
      fin ?? new Date(inicio.getTime() + 15 * 60 * 1000);

    return (
      this.estaRangoDentroDelHorario(inicio, finCalculado) &&
      !this.tieneCitaSolapadaEnRango(inicio, citaIdIgnorada, finCalculado)
    );
  }

  private abrirModalCrearCita(fecha: Date | null | undefined): void {
    if (!fecha) {
      return;
    }

    if (!this.catalogosCrearCitaCargados) {
      this.fechaModalPendiente = new Date(fecha);

      if (!this.cargandoCatalogosCrearCita) {
        this.cargarCatalogosCrearCita();
      }

      return;
    }

    this.fechaModalPendiente = null;
    this.slotSeleccionado = {
      diaSemana: this.nombreDiaSemana(fecha),
      hora: this.formatearHora12(fecha),
      numSemana: this.numSemanaDeFecha(fecha),
      fecha: this.formatearFechaLocal(fecha),
    };
    this.modalCrearCitaAbierto = true;
    this.cdr.markForCheck();
  }

  cerrarModalCrearCita(): void {
    this.modalCrearCitaAbierto = false;
    this.slotSeleccionado = null;
    this.cdr.markForCheck();
  }

  onCitaCreada(): void {
    this.cerrarModalCrearCita();
    this.cargarCitas();
  }

  abrirConfirmacionEliminarCita(citaId: number, mascotaNombre: string): void {
    this.clearEliminarCitaTimeout();
    this.citaEliminarId = citaId;
    this.citaEliminarNombre = mascotaNombre;
    this.eliminandoCita = false;
    this.eliminarCitaError = '';
    this.eliminarCitaSuccess = '';
    this.modalEliminarCitaAbierto = true;
    this.cdr.markForCheck();
  }

  cerrarModalEliminarCita(): void {
    if (this.eliminandoCita) {
      return;
    }

    this.clearEliminarCitaTimeout();
    this.modalEliminarCitaAbierto = false;
    this.citaEliminarId = null;
    this.citaEliminarNombre = '';
    this.eliminarCitaError = '';
    this.eliminarCitaSuccess = '';
    this.cdr.markForCheck();
  }

  confirmarEliminarCita(): void {
    if (!this.citaEliminarId || this.eliminandoCita) {
      return;
    }

    this.eliminandoCita = true;
    this.eliminarCitaError = '';
    this.eliminarCitaSuccess = '';

    this.citasService.eliminarCita(this.citaEliminarId).subscribe({
      next: () => {
        this.eliminandoCita = false;
        this.eliminarCitaSuccess = 'Cita cancelada correctamente';
        this.cdr.markForCheck();

        this.eliminarCitaTimeout = setTimeout(() => {
          this.cerrarModalEliminarCita();
          this.cargarCitas();
        }, 600);
      },
      error: () => {
        this.eliminandoCita = false;
        this.eliminarCitaError = 'No fue posible cancelar la cita.';
        this.cdr.markForCheck();
      },
    });
  }

  private formatearFechaLocal(fecha: Date): string {
    return [
      fecha.getFullYear(),
      String(fecha.getMonth() + 1).padStart(2, '0'),
      String(fecha.getDate()).padStart(2, '0'),
    ].join('-');
  }

  private formatearHora12(fecha: Date): string {
    const horas = fecha.getHours();
    const minutos = fecha.getMinutes();
    const periodo = horas >= 12 ? 'PM' : 'AM';
    const hora12 = horas % 12 || 12;

    return `${String(hora12).padStart(2, '0')}:${String(minutos).padStart(2, '0')} ${periodo}`;
  }

  private nombreDiaSemana(fecha: Date): string {
    const dias = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];

    return dias[fecha.getDay()] ?? 'Lunes';
  }

  private numSemanaDeFecha(fecha: Date): number {
    const inicioSemanaSeleccionada = this.lunesDeFecha(fecha);
    const inicioSemanaActual = this.lunesDeSemana(0);
    const milisegundosSemana = 7 * 24 * 60 * 60 * 1000;

    return Math.round(
      (inicioSemanaSeleccionada.getTime() - inicioSemanaActual.getTime()) /
        milisegundosSemana,
    );
  }

  private lunesDeFecha(fecha: Date): Date {
    const dow = fecha.getDay();
    const lunes = new Date(fecha);
    lunes.setDate(fecha.getDate() - (dow === 0 ? 6 : dow - 1));
    lunes.setHours(0, 0, 0, 0);
    return lunes;
  }

  private mapearSlotsDisponibles(
    citas: CitaDto[],
    inicioSemana: Date = this.fechaInicioSemana,
  ): EventInput[] {
    const ocupados = citas.map((c) => {
      const fecha = this.fechaDeCita(c.diaSemana, inicioSemana);
      const inicio = this.horaAMinutos(this.a24h(c.hora));

      return {
        fecha,
        inicio,
        fin: inicio + c.duracionMinutos,
      };
    });

    const slots: EventInput[] = [];

    this.horario.forEach((diaHorario) => {
      const numDia = this.diaANum(diaHorario.diaSemana);
      const fecha = this.fechaDeDiaNumero(numDia, inicioSemana);
      const inicioDia = this.horaAMinutos(this.a24h(diaHorario.horaInicio));
      const finDia = this.horaAMinutos(this.a24h(diaHorario.horaFin));

      for (let inicio = inicioDia; inicio + 15 <= finDia; inicio += 15) {
        const fin = inicio + 15;
        const estaOcupado = ocupados.some(
          (o) => o.fecha === fecha && inicio < o.fin && fin > o.inicio,
        );

        if (estaOcupado) {
          continue;
        }

        slots.push({
          id: `slot-${fecha}-${inicio}`,
          start: `${fecha}T${this.minutosAHora(inicio)}`,
          end: `${fecha}T${this.minutosAHora(fin)}`,
          display: 'background',
          classNames: ['fc-slot-disponible'],
          editable: false,
          startEditable: false,
          durationEditable: false,
          extendedProps: {
            esSlotDisponible: true,
          },
        });
      }
    });

    return slots;
  }

  getEstiloLeyenda(tipo: string): Record<string, string> {
    const color = this.colorDeTipo(tipo);
    return {
      backgroundColor: color.bg,
      borderColor: color.border,
      color: color.text,
    };
  }

  private cargarCatalogosCrearCita(): void {
    if (this.cargandoCatalogosCrearCita) {
      return;
    }

    this.cargandoCatalogosCrearCita = true;

    forkJoin({
      tipos: this.citasService.getTiposCita(),
      mascotas: this.petService.findAll(),
    }).subscribe({
      next: ({ tipos, mascotas }) => {
        this.tiposCitaCatalogo = tipos;
        this.mascotasCatalogo = mascotas;
        this.catalogosCrearCitaCargados = true;
        this.cargandoCatalogosCrearCita = false;

        const nombresTipos = tipos.map((t) => t.nombre);
        this.tiposCita = nombresTipos;
        nombresTipos.forEach((tipo) => this.colorDeTipo(tipo));

        const fechaPendiente = this.fechaModalPendiente;
        this.fechaModalPendiente = null;

        if (fechaPendiente) {
          this.abrirModalCrearCita(fechaPendiente);
          return;
        }

        this.cdr.markForCheck();
      },
      error: () => {
        this.tiposCita = [];
        this.tiposCitaCatalogo = [];
        this.mascotasCatalogo = [];
        this.catalogosCrearCitaCargados = false;
        this.cargandoCatalogosCrearCita = false;
        this.fechaModalPendiente = null;
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

    this.calendar.setOption('editable', this.calendarOptions.editable);
    this.calendar.setOption(
      'eventDurationEditable',
      this.calendarOptions.eventDurationEditable,
    );

    this.calendar.removeAllEvents();
    const events = this.calendarOptions.events;
    if (Array.isArray(events) && events.length) {
      this.calendar.addEventSource(events);
    }
  }
}
