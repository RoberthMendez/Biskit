package com.example.biskit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.biskit.service.Clients.ClientsService;
import com.example.biskit.service.Pets.PetsService;
import com.example.biskit.entities.Client;
import com.example.biskit.entities.Pet;

@Controller
@RequestMapping("/vet")
public class VetsController {

  @Autowired
  private PetsService petsService;

  @Autowired
  private ClientsService clientsService;

  // ================ CLIENTES ================

  private static final String clientsPath = "vet/clients/";

  // ----- Mostrar Clientes (READ) -----
  @GetMapping("/clients")
  public String mostrarClientes(Model model) {
    model.addAttribute("clients", clientsService.getClients());
    return clientsPath + "clients";
  }

  // ----- Mostrar Cliente (READ) -----
  @GetMapping("/clients/{id}")
  public String mostrarCliente(@PathVariable("id") Integer id, Model model) {
    model.addAttribute("client", clientsService.getClientById(id));
    model.addAttribute("pets", clientsService.getPetsByClientId(id));
    return clientsPath + "info-client";
  }

  // ----- Añadir Cliente (CREATE) -----
  @GetMapping("/clients/add")
  public String mostrarFormularioNuevoCliente(Model model) {
    Client client = new Client(null, "", "", "", "", "", null);
    model.addAttribute("client", client);
    return clientsPath + "add-client";
  }

  @PostMapping("/clients/add")
  public String agregarCliente(@ModelAttribute("client") Client client) {
    clientsService.addClient(client);
    return "redirect:/vet/clients";
  }

  // ----- Editar Cliente (UPDATE) -----
  @GetMapping("/clients/update/{id}")
  public String mostrarFormularioUpdateCliente(@PathVariable("id") Integer id, Model model) {
    Client client = clientsService.getClientById(id);
    model.addAttribute("client", client);
    return clientsPath + "add-client";
  }

  @PostMapping("/clients/update")
  public String actualizarCliente(@ModelAttribute("client") Client client) {

    Client clientExistente = clientsService.getClientById(client.getId());
    if (clientExistente != null) {
      client.setPets(clientExistente.getPets());
    }

    clientsService.updateClient(client);
    return "redirect:/vet/clients";

  }

  // ----- Eliminar Cliente (DELETE) -----
  @GetMapping("/clients/delete/{id}")
  public String eliminarCliente(@PathVariable("id") Integer id) {
    clientsService.deleteClient(id);
    return "redirect:/vet/clients";
  }

  // ================ MASCOTAS ================

  private static final String petsPath = "vet/pets/";

  // ----- Mostrar Mascotas (READ) -----

  @GetMapping("/pets")
  public String mostrarMascotas(Model model) {
    model.addAttribute("petsClientname", clientsService.getPetsAndClientNames());
    return petsPath + "pets";
  }

  // ----- Mostrar Mascota (READ) -----

  @GetMapping("/pets/{id}")
  public String mostrarMascota(@PathVariable("id") Integer id, Model model) {
    Client dueño = clientsService.getClientByPetId(id);
    model.addAttribute("pet", petsService.getPetById(id));
    model.addAttribute("dueño", dueño);
    return petsPath + "info-pet";
  }

  // ----- Añadir Mascota (CREATE) -----

  @GetMapping("/pets/add")
  public String mostrarFormularioAddPet(Model model) {
    Pet pet = new Pet(null, "", null, "", null, 0, 0.0f, "", "");
    model.addAttribute("pet", pet);
    model.addAttribute("clientes", clientsService.getClients());
    return petsPath + "add-pet";
  }

  @PostMapping("/pets/add")
  public String agregarMascota(@ModelAttribute("pet") Pet pet, @RequestParam("idCliente") Integer idCliente) {
    clientsService.addPetToClient(idCliente, pet);
    return "redirect:/vet/pets";
  }

  // ----- Editar Mascota (UPDATE) -----

  @GetMapping("/pets/update/{id}")
  public String mostrarFormularioUpdatePet(@PathVariable("id") Integer id, Model model) {
    Pet pet = petsService.getPetById(id);
    Client owner = clientsService.getClientByPetId(id);
    model.addAttribute("pet", pet);
    model.addAttribute("owner", owner);
    model.addAttribute("clientes", clientsService.getClients());
    return petsPath + "add-pet";
  }

  // ----- Eliminar Mascota (DELETE) -----

  @GetMapping("/pets/delete/{id}")
  public String eliminarMascota(@PathVariable("id") Integer id) {
    petsService.deletePet(id);
    clientsService.deletePetFromClient(id);
    return "redirect:/vet/pets";
  }

}
