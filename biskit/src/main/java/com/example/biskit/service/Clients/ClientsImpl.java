package com.example.biskit.service.Clients;

import java.util.Collection;
import java.util.List;
import java.util.ArrayList;
import org.apache.commons.lang3.tuple.Pair;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.biskit.entities.Client;
import com.example.biskit.entities.Pet;

import com.example.biskit.repo.ClientsRepo;
import com.example.biskit.service.Pets.PetsImpl;

@Service
public class ClientsImpl implements ClientsService {

  @Autowired
  private ClientsRepo clientsRepo;

  @Autowired
  private PetsImpl petsService;

  @Override
  public Collection<Client> getClients() {
    return clientsRepo.getClients();
  }

  @Override
  public Client getClientById(Integer id) {
    return clientsRepo.getClientById(id);
  }

  @Override
  public void addClient(Client client) {
    clientsRepo.saveClient(client);
  }

  @Override
  public void updateClient(Client client) {
    clientsRepo.saveClient(client);
  }

  @Override
  public void deleteClient(Integer id) {
    Client cliente = clientsRepo.getClientById(id);
    List<Integer> petIds = cliente.getPets().stream().map(pet -> pet.getId()).toList();
    petIds.forEach(petId -> petsService.deletePet(petId));
    clientsRepo.deleteClient(id);
  }

  @Override
  public List<Pet> getPetsByClientId(Integer clientId) {
    Client client = clientsRepo.getClientById(clientId);
    // Obtener las versiones actualizadas de las mascotas desde PetsRepo
    List<Pet> updatedPets = new ArrayList<>();
    for (Pet pet : client.getPets()) {
      Pet updatedPet = petsService.getPetById(pet.getId());
      if (updatedPet != null) {
        updatedPets.add(updatedPet);
      }
    }
    return updatedPets;
  }

  @Override
  public void addPetToClient(Integer clientId, Pet pet) {

    Client dueñoIngresado = clientsRepo.getClientById(clientId);

    // Si la mascota se está actualizando
    if (pet.getId() != null) {
      Client dueñoAnterior = getClientByPetId(pet.getId());
      // Si la mascota cambió de dueño, se actualiza la relación
      if (dueñoAnterior != null && !dueñoAnterior.getId().equals(clientId)) {
        dueñoAnterior.getPets().removeIf(p -> p.getId().equals(pet.getId()));
        dueñoIngresado.getPets().add(pet);
      } else if (dueñoAnterior != null) {
        // Si es el mismo dueño, actualizar la referencia en la lista
        dueñoAnterior.getPets().removeIf(p -> p.getId().equals(pet.getId()));
        dueñoAnterior.getPets().add(pet);
      }
    }

    // SI la mascota es nueva, se agrega a la lista de mascotas del dueño
    if (pet.getId() == null) {
      dueñoIngresado.getPets().add(pet);
    }

    // Guardar la mascota en el repositorio de mascotas
    petsService.addPet(pet);

  }

  @Override
  public List<Pair<Pet, String>> getPetsAndClientNames() {
    List<Pair<Pet, String>> petAndClients = new ArrayList<>();
    clientsRepo.getClients().forEach(client -> {
      client.getPets().forEach(pet -> {
        // Obtener la versión actualizada de la mascota desde PetsRepo
        Pet updatedPet = petsService.getPetById(pet.getId());
        if (updatedPet != null) {
          petAndClients.add(Pair.of(updatedPet, client.getNombre()));
        }
      });
    });
    return petAndClients;
  }

  @Override
  public Client getClientByPetId(Integer petId) {
    return clientsRepo.getClients()
        .stream()
        .filter(c -> c.getPets() != null
            && c.getPets().stream().anyMatch(p -> p.getId() != null && p.getId().equals(petId)))
        .findFirst()
        .orElse(null);
  }

  @Override
  public void deletePetFromClient(Integer petId) {
    Integer clientId = getClientByPetId(petId).getId();
    Client client = clientsRepo.getClientById(clientId);
    if (client != null) {
      client.getPets().removeIf(pet -> pet.getId().equals(petId));
    }
  }

  @Override
  public boolean autenticarClient(String usuario, String contrasena) {
    return clientsRepo.getClients().stream()
        .anyMatch(client -> client.getUsuario().equals(usuario) && client.getContraseña().equals(contrasena));
  }

  @Override
  public Client findByUsuario(String usuario) {
    return clientsRepo.getClients().stream()
        .filter(client -> client.getUsuario().equals(usuario))
        .findFirst()
        .orElse(null);
  }

}