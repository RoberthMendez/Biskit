package com.example.biskit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.biskit.service.PetsService;
import com.example.biskit.entities.Client;
import com.example.biskit.entities.Pet;
import com.example.biskit.service.ClientsService;

@Controller
@RequestMapping("/vet")
public class VetsController {

  @Autowired
  private PetsService petsService;

  @Autowired
  private ClientsService clientsService;

  // ---- CLIENTES -----

  @GetMapping("/clients/table")
  public String tablaClientes(Model model) {
    model.addAttribute("clients", clientsService.getClients());
    return "vet/tabla-bootstrap";
  }

  @GetMapping("/clients/{id}")
  public String mostrarCliente(@PathVariable("id") Integer id, Model model) {
    model.addAttribute("client", clientsService.getClientById(id));
    return "vet/client-info";
  }

  @GetMapping("/clients")
  public String mostrarClientes(Model model) {
    model.addAttribute("clients", clientsService.getClients());
    return "vet/clients";
  }

  @GetMapping("/new-client")
  public String mostrarFormularioNuevoCliente(Model model) {
    model.addAttribute("client", new Object()); // Aquí puedes usar tu clase Client en lugar de Object
    return "vet/new-client";
  }

  // ----- MASCOTAS -----
  @GetMapping("/pets")
  public String mostrarMascotas(Model model) {
    model.addAttribute("petsClientname", clientsService.getPetsAndClientNames());
    return "vet/pets";
  }

  @GetMapping("/pets/{id}")
  public String mostrarMascota(@PathVariable("id") Integer id, Model model) {
    Client dueño = clientsService.getClientByPetId(id);
    model.addAttribute("pet", petsService.getPetById(id));
    model.addAttribute("dueño", dueño);
    return "vet/info-pet";
  }

  @RequestMapping(value = "/pets/delete/{id}", method = { RequestMethod.GET, RequestMethod.POST })
  public String eliminarMascota(@PathVariable("id") Integer id) {
    petsService.deletePet(id);
    return "redirect:/vet/pets";
  }

  @GetMapping("/add-pet")
  public String mostrarFormularioAddPet(Model model) {
    Pet pet = new Pet(null, "", null, "", null, 0, 0.0f, "", "");
    model.addAttribute("pet", pet);
    model.addAttribute("clientes", clientsService.getClients());
    return "add-pet";
  }

  @PostMapping("/add-pet")
  public String agregarMascota(@ModelAttribute("pet") Pet pet, @RequestParam("idCliente") Integer idCliente) {
    clientsService.addPetToClient(idCliente, pet);
    return "redirect:/vet/pets";
  }

  @GetMapping("/update-pet/{id}")
  public String mostrarFormularioUpdatePet(@PathVariable("id") Integer id, Model model) {
    Pet pet = petsService.getPetById(id);
    Client owner = clientsService.getClientByPetId(id);
    model.addAttribute("pet", pet);
    model.addAttribute("owner", owner);
    model.addAttribute("clientes", clientsService.getClients());
    return "add-pet";
  }

}
