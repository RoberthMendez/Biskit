import { Injectable } from '@angular/core';
import { Vet } from '../models/Vets/vet-cl';
import { CredencialesService } from './credenciales.service';

@Injectable({
  providedIn: 'root'
})
export class VetService {

  constructor(
    private credencialesService: CredencialesService
  ) { }

  //Base de datos falsa

  vets: Vet[] = [
    new Vet(
      1,
      'Juan Pérez',
      true,
      'jperez@email.com',
      '123456789',
      'https://universidadeuropea.com/resources/media/images/medicina-veterinaria-1200x630.2e16d0ba.fill-767x384.jpg',
      { usuario: 'jperez@email.com', password: 'password' },
      { id: 1, nombre: 'Cirugía' },
      []
    ),
    new Vet(
      2,
      'Ana Gómez',
      true,
      'anagomez@email.com',
      '987654321',
      'https://www.vetformacion.com/wp-content/uploads/2025/02/blogvetformacion3.jpg',
      { usuario: 'anagomez@email.com', password: 'password' },
      { id: 2, nombre: 'Medicina Interna' },
      []
    ),
    new Vet(
      3,
      'Carlos López',
      true,
      'carloslopez@email.com',
      '5576590191',
      'https://media.istockphoto.com/id/478106759/es/foto/joven-hombre-en-uniforme-veterinario-sosteniendo-un-perro-en-el-interior-del-hotel.jpg?s=612x612&w=0&k=20&c=diPF38rmQT9ds9sL8imMn58f5N8buJaPEsbb-_-elNw=',
      { usuario: 'carloslopez@email.com', password: 'password' },
      { id: 3, nombre: 'Dermatología' },
      []
    ),
    new Vet(
      4,
      'María Rodríguez',
      true,
      'mariarodriguez@email.com',
      '178293657',
      'https://www.aaha.org/wp-content/uploads/2024/04/DEVTP_PullQuote_Square-1000x1000.jpg',
      { usuario: 'mariarodriguez@email.com', password: 'password' },
      { id: 4, nombre: 'Cardiología' },
      []
    ),
    new Vet(
      5,
      'Luis Fernández',
      true,
      'luisfernandez@email.com',
      '935267728',
      'https://media.istockphoto.com/id/518154267/es/foto/joven-hombre-profesional-y-atento-personal-veterinario-de-linda-hermosa-en-perros.jpg?s=612x612&w=0&k=20&c=On0E37-NY_5AVgfe6G_z4MSee1e6KR7clRujUSUR_FE=',
      { usuario: 'luisfernandez@email.com', password: 'password' },
      { id: 5, nombre: 'Neurología' },
      []
    ),
    new Vet(
      6,
      'Sofía Martínez',
      true,
      'sofiamartinez@email.com',
      '915263445',
      'https://sadenir.com.uy/wp-content/uploads/2020/11/veterinarian-check-ing-puppy-s-health-2.jpg',
      { usuario: 'sofiamartinez@email.com', password: 'password' },
      { id: 6, nombre: 'Pediatría' },
      []
    ),
    new Vet(
      7,
      'Diego Gómez',
      true,
      'diegogomez@email.com',
      '725368192',
      'https://png.pngtree.com/background/20250124/original/pngtree-golden-retriever-dog-licking-man-veterinarian-vet-care-treatment-photo-picture-image_12461655.jpg',
      { usuario: 'diegogomez@email.com', password: 'password' },
      { id: 7, nombre: 'Ortopedia' },
      []
    ),
    new Vet(
      8,
      'Laura Sánchez',
      true,
      'laurasanchez@email.com',
      '839463521',
      'https://unex.edu.br/wp-content/uploads/2022/07/medicina-veterinaria-scaled.jpg',
      { usuario: 'laurasanchez@email.com', password: 'password' },
      { id: 8, nombre: 'Oftalmología' },
      []
    )
  ];

  findAll(): Vet[] {
    return this.vets;
  }

  findById(id: number): Vet {
    const vet = this.vets.find(v => v.id === id);
    if (!vet) {
      throw new Error(`Veterinario con id ${id} no encontrado`);
    }
    return vet;
  }

  saveVet(vet: Vet): void {
    if (vet.id) {
      const index = this.vets.findIndex(v => v.id === vet.id);
      if (index !== -1) {
        this.vets[index] = vet;
      }
    } else {
      // Busca el id máximo de los veterinarios y le suma 1
      const nuevoId = this.vets.length > 0 ? Math.max(...this.vets.map(v => v.id ?? 0)) + 1 : 1;
      vet.id = nuevoId;
      vet.estado = true; // Por defecto, el nuevo veterinario estará activo

      vet.credenciales = { usuario: vet.correo, password: vet.cedula }; // Credenciales por defecto
      this.credencialesService.addCredenciales(vet.credenciales);
      
      this.vets.push(vet);
    }
  }

  getVetById(id: number): Vet {
    const vet = this.vets.find(v => v.id === id);
    if (!vet) {
      throw new Error(`Veterinario con id ${id} no encontrado`);
    }
    return vet;
  }


}
