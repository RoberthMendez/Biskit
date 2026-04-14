import { Component, Input } from '@angular/core';
import { Client } from '../../../models/Client/client';
import { ClientService } from '../../../services/client.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Pet } from '../../../models/Pets/pet';
import { ClientInfoComponent } from './components/client-info/client-info.component';
import { PetsSectionComponent } from './components/pets-section/pets-section.component';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  imports: [ClientInfoComponent, PetsSectionComponent],
})
export class ClientComponent {
  @Input() client!: Client;
  @Input() pets: Pet[] = [];

  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => Number(params.get('id') ?? 0)),
        switchMap((id) => this.clientService.findById(id)),
        switchMap((client) => {
          this.client = client;
          const clientId = client.id;
          if (!clientId) {
            return of([] as Pet[]);
          }
          return this.clientService.getPetsByClientId(clientId);
        }),
      )
      .subscribe((pets) => {
        this.pets = pets;
      });
  }
}
