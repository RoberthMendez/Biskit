import { Component, Input } from '@angular/core';
import { Client } from '../../../models/Client/client';
import { ClientService } from '../../../services/client.service';
import { ActivatedRoute } from '@angular/router';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
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
    const id = this.route.snapshot.paramMap.get('id');

    this.clientService
      .findById(id ? Number(id) : 0)
      .pipe(
        mergeMap((client) => {
          this.client = client;
          return this.clientService.getPetsByClientId(client.id ?? 0);
        }),
      )
      .subscribe((pets) => {
        this.pets = pets;
      });
  }
}
