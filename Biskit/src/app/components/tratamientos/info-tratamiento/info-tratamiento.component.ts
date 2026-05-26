import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PetDTO } from '../../../models/dtos/pet-dto';
import { Vet } from '../../../models/Vets/vet-cl';
import { Client } from '../../../models/Client/client';
import { TratamientoService } from '../../../services/tratamiento.service';
import { PetService } from '../../../services/pet.service';
import { DeleteModalComponent } from '../../reusables/delete-modal/delete-modal.component';
import { BackButtonComponent } from '../../reusables/back-button/back-button.component';
import { TratamientoDetalleDto } from '../../../models/dtos/tratamiento-detalle-dto';
import { ChatModalComponent } from '../../reusables/chat/chat-modal/chat-modal.component';
import { ChatPerson } from '../../../models/Chat/chat-person';
import { ChatCrearDto } from '../../../models/dtos/chat-crear-dto';
import { ChatService } from '../../../services/chat.service';
import { Observable, catchError, of, switchMap } from 'rxjs';

type ChatTarget = 'vet' | 'owner';

@Component({
  selector: 'app-info-tratamiento',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DeleteModalComponent,
    BackButtonComponent,
    ChatModalComponent,
  ],
  templateUrl: './info-tratamiento.component.html',
})
export class InfoTratamientoComponent implements OnInit {
  tratamiento: TratamientoDetalleDto | null = null;
  veterinario: Vet | null = null;
  pet: PetDTO | null = null;
  owner: Client | null = null;
  isClientView = false;
  isVetView = false;
  basePath = '';
  backLink = '';
  backLabel = 'Volver';
  editLink = '';
  showDeleteModal = false;
  showChatModal = false;
  deleteSuccessMessage = '';
  shouldNavigateAfterDelete = false;
  private routeTratamientoId: number | null = null;
  private selectedChatTarget: ChatTarget | null = null;
  chatID = 0;

  constructor(
    private route: ActivatedRoute,
    private tratamientoService: TratamientoService,
    private petService: PetService,
    private router: Router,
    private chatService: ChatService,
  ) {}

  ngOnInit(): void {
    const routePath = this.route.snapshot.routeConfig?.path ?? '';
    const petIdParam = this.route.snapshot.paramMap.get('petId');
    const tratamientoIdParam =
      this.route.snapshot.paramMap.get('tratamientoId');
    const clientIdParam = this.route.snapshot.paramMap.get('clientId');
    const vetIdParam = this.route.snapshot.paramMap.get('vetId');

    const petId = petIdParam !== null ? Number(petIdParam) : null;
    const tratamientoId =
      tratamientoIdParam !== null ? Number(tratamientoIdParam) : null;
    this.routeTratamientoId =
      tratamientoId !== null && !Number.isNaN(tratamientoId)
        ? tratamientoId
        : null;
    const clientId = clientIdParam !== null ? Number(clientIdParam) : null;
    const vetId = vetIdParam !== null ? Number(vetIdParam) : null;
    const hasPetContext = petId !== null && !Number.isNaN(petId);
    const hasVetContext = vetId !== null && !Number.isNaN(vetId);
    const isAdminPage = routePath.startsWith('admin/');

    this.isClientView = routePath.startsWith('client/');
    this.isVetView = routePath.startsWith('vet/');

    if (this.isClientView) {
      this.backLink = `/client/pet/${petId}`;
      this.backLabel = 'Detalle de Mascota';
      this.isClientView = true;
    }

    if (!this.isClientView) {
      this.basePath = `/${isAdminPage ? 'admin' : 'vet'}`;

      if (hasPetContext) {
        this.backLink = `${this.basePath}/pets/${petId}`;
        this.backLabel = 'Detalle de Mascota';
      } else if (isAdminPage && hasVetContext) {
        this.backLink = `${this.basePath}/vets/${vetId}`;
        this.backLabel = 'Detalle de Veterinario';
      } else {
        this.backLink = isAdminPage ? '/admin' : '/vet';
        this.backLabel = isAdminPage
          ? 'Panel de Administrador'
          : 'Panel Veterinario';
      }

      if (tratamientoId !== null && !Number.isNaN(tratamientoId)) {
        if (hasPetContext) {
          this.editLink = `${this.basePath}/pets/${petId}/tratamiento/update/${tratamientoId}`;
        } else if (isAdminPage && hasVetContext) {
          this.editLink = `${this.basePath}/vets/${vetId}/tratamiento/update/${tratamientoId}`;
        }
      }
    }

    if (tratamientoId !== null && !Number.isNaN(tratamientoId)) {
      this.tratamientoService.findById(tratamientoId).subscribe({
        next: (tratamiento) => {
          tratamiento.id =
            this.resolveTratamientoId(tratamiento) ?? tratamientoId;
          this.tratamiento = tratamiento;
          this.veterinario = tratamiento.vet;
          this.owner = tratamiento.client;

          const resolvedClientId = this.owner?.id;
          const resolvedVetId = this.veterinario?.id;

          if (resolvedClientId != null && resolvedVetId != null) {
            this.assignChatId(resolvedClientId, resolvedVetId);
          }

          if (tratamiento.pet != null) {
            this.pet = tratamiento.pet;
          }

          if (petId === null && tratamiento.pet?.id != null && !isAdminPage) {
            this.editLink = `${this.basePath}/pets/${tratamiento.pet.id}/tratamiento/update/${tratamiento.id}`;
          }
        },
        error: (error) => {
          console.error('Error al cargar tratamiento:', error);
        },
      });
    }

    if (petId !== null && !Number.isNaN(petId)) {
      this.petService.findById(petId).subscribe({
        next: (pet) => {
          this.pet = pet;
          this.petService.getPetOwner(petId).subscribe({
            next: (owner) => {
              this.owner = owner;
            },
            error: () => {
              this.owner = new Client();
            },
          });
        },
        error: (error) => {
          console.error('Error al cargar mascota:', error);
        },
      });
      return;
    }
  }

  getEdad(): string {
    return this.pet?.edad != null ? this.pet.edad.toString() : 'N/A';
  }

  getFechaTratamiento(): string {
    if (!this.tratamiento?.fecha) return 'Sin fecha';

    const rawFecha = this.tratamiento.fecha;
    const localDateMatch = rawFecha.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    const parsedDate = localDateMatch
      ? new Date(
          Number(localDateMatch[1]),
          Number(localDateMatch[2]) - 1,
          Number(localDateMatch[3]),
        )
      : new Date(rawFecha);

    if (Number.isNaN(parsedDate.getTime())) return 'Sin fecha';

    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(parsedDate);
  }

  get chatPerson(): ChatPerson | null {
    if (this.selectedChatTarget === 'vet') {
      return this.buildVetChatPerson();
    }

    if (this.selectedChatTarget === 'owner') {
      return this.buildOwnerChatPerson();
    }

    return null;
  }

  get chatSubtitle(): string {
    const chatPerson = this.chatPerson;

    return chatPerson != null
      ? `Conversacion con ${chatPerson.name}`
      : 'Conversacion';
  }

  get chatPetSummary(): string {
    const petDetails = [this.pet?.especie, this.pet?.raza].filter(Boolean);

    return petDetails.length > 0
      ? petDetails.join(' | ')
      : 'Sin especie ni raza';
  }

  get currentChatSenderName(): string {
    if (this.selectedChatTarget === 'vet') {
      return this.owner?.nombre || 'Cliente';
    }

    if (this.selectedChatTarget === 'owner') {
      return this.veterinario?.nombre || 'Veterinario';
    }

    return 'Biskit';
  }

  openChat(target: ChatTarget): void {
    this.selectedChatTarget = target;

    const clientId = this.owner?.id;
    const vetId = this.veterinario?.id;

    if (clientId == null || vetId == null) {
      console.error('No fue posible resolver los participantes del chat.');
      return;
    }

    this.resolveChatId(clientId, vetId).subscribe({
      next: (chatId) => {
        if (chatId <= 0) {
          console.error('No fue posible crear un chat válido.');
          return;
        }

        this.chatID = chatId;
        this.showChatModal = true;
      },
      error: (error) => {
        console.error('Error al preparar el chat:', error);
      },
    });
  }

  closeChat(): void {
    this.showChatModal = false;
  }

  openDeleteModal(): void {
    this.deleteSuccessMessage = '';
    this.shouldNavigateAfterDelete = false;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    const shouldNavigate = this.shouldNavigateAfterDelete;

    this.showDeleteModal = false;
    this.deleteSuccessMessage = '';
    this.shouldNavigateAfterDelete = false;

    if (shouldNavigate) {
      this.router.navigateByUrl(this.backLink);
    }
  }

  confirmDeleteTratamiento(): void {
    const tratamientoId = this.resolveTratamientoId(this.tratamiento);

    if (tratamientoId == null) {
      console.error(
        'No fue posible resolver el ID del tratamiento a eliminar.',
      );
      return;
    }

    this.tratamientoService.deleteTratamiento(tratamientoId).subscribe({
      next: () => {
        this.shouldNavigateAfterDelete = true;
        this.deleteSuccessMessage = 'Tratamiento eliminado correctamente';
      },
      error: (error) => {
        console.error('Error al eliminar tratamiento:', error);
      },
    });
  }

  private buildVetChatPerson(): ChatPerson | null {
    if (this.veterinario == null) {
      return null;
    }

    return {
      name: this.veterinario.nombre || 'Veterinario sin nombre',
      role: this.veterinario.especialidad?.nombre
        ? `Veterinario - ${this.veterinario.especialidad.nombre}`
        : 'Veterinario asignado',
      avatarUrl: this.veterinario.urlFoto || undefined,
      statusLabel: this.veterinario.estado ? 'ACTIVO' : 'INACTIVO',
      statusTone: this.veterinario.estado ? 'success' : 'neutral',
      details: [
        {
          label: 'Correo',
          value: this.veterinario.correo || 'No registrado',
          icon: 'pi pi-envelope',
        },
        {
          label: 'Especialidad',
          value: this.veterinario.especialidad?.nombre || 'No registrada',
          icon: 'pi pi-briefcase',
        },
      ],
    };
  }

  private buildOwnerChatPerson(): ChatPerson | null {
    if (this.owner == null) {
      return null;
    }

    return {
      name: this.owner.nombre || 'Propietario sin nombre',
      role: this.pet?.nombre
        ? `Propietario de ${this.pet.nombre}`
        : 'Propietario',
      details: [
        {
          label: 'Celular',
          value: this.owner.celular || 'No registrado',
          icon: 'pi pi-phone',
        },
        {
          label: 'Correo',
          value: this.owner.correo || 'No registrado',
          icon: 'pi pi-envelope',
        },
      ],
    };
  }

  private resolveTratamientoId(
    tratamiento: TratamientoDetalleDto | null,
  ): number | null {
    const rawTratamiento = tratamiento as
      | (TratamientoDetalleDto & {
          tratamientoId?: number;
          idTratamiento?: number;
        })
      | null;

    return (
      rawTratamiento?.id ??
      rawTratamiento?.tratamientoId ??
      rawTratamiento?.idTratamiento ??
      this.routeTratamientoId
    );
  }

  private assignChatId(
    clientId: number | null | undefined,
    vetId: number | null | undefined,
  ): void {
    if (
      clientId == null ||
      vetId == null ||
      Number.isNaN(clientId) ||
      Number.isNaN(vetId)
    ) {
      return;
    }

    this.chatService.getChatID(clientId, vetId).subscribe({
      next: (id) => {
        this.chatID = id;
      },
      error: (error) => {
        console.error('Error al obtener chat ID de:', error);
      },
    });
  }

  private resolveChatId(clientId: number, vetId: number): Observable<number> {
    const chatRequest = new ChatCrearDto(clientId, vetId);

    return this.chatService.getChatID(clientId, vetId).pipe(
      switchMap((chatId) => {
        if (chatId > 0) {
          return of(chatId);
        }

        return this.chatService.addChat(chatRequest);
      }),
      catchError((error) => {
        console.warn(
          'No fue posible obtener el chat, creando uno nuevo.',
          error,
        );

        return this.chatService.addChat(chatRequest).pipe(
          catchError((creationError) => {
            console.error('Error al crear el chat:', creationError);
            return of(0);
          }),
        );
      }),
    );
  }
}
