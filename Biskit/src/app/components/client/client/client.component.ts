import { Component, Input } from '@angular/core';
import { Client } from '../../../models/Client/client';
import { ClientService } from '../../../services/client.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PetDTO } from '../../../models/dtos/pet-dto';
import { ClientInfoComponent } from './components/client-info/client-info.component';
import { PetsSectionComponent } from './components/pets-section/pets-section.component';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  imports: [ClientInfoComponent, PetsSectionComponent],
  styleUrls: ['./client.component.css'],
})
export class ClientComponent {
  @Input() client: Client = new Client();
  @Input() pets: PetDTO[] = [];
  public clientLoaded = false;

  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.clientService
      .getDetails()
      .pipe(
        switchMap((client) => {
          this.client = client;
          this.clientLoaded = true;

          return this.clientService.getPetsByClientId(client.id!);
        }),
      )
      .subscribe({
        next: (pets) => {
          this.pets = pets;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
}
