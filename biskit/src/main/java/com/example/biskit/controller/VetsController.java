package com.example.biskit.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.biskit.service.PetsService;
import com.example.biskit.service.ClientsService;

import com.example.biskit.entities.Client;
import com.example.biskit.entities.Pet;

@Controller
@RequestMapping("/vet")
public class VetsController {

  @Autowired
  private PetsService petsService;

  @Autowired
  private ClientsService clientsService;

  // ----- MASCOTAS -----
  @GetMapping("/pets")
  public String mostrarMascotas(Model model) {
    model.addAttribute("pets", petsService.getPets());
    return "pets";
  }

  @GetMapping("/pets/{id}")
  public String mostrarMascota(@PathVariable("id") Integer id, Model model) {
    model.addAttribute("pet", petsService.getPetById(id));
    return "info-pet";
  }

  @PostMapping("/pets/delete/{id}")
  public String eliminarMascota(@PathVariable("id") Integer id) {
    petsService.deletePet(id);
    return "redirect:/vet/pets";
  }

  @GetMapping("/add-pet")
  public String mostrarFormularioAddPet(Model model) {
    Pet pet = new Pet(null, "", null, "", null, 0, 0.0f, "", "", "");
    model.addAttribute("pet", pet);
    model.addAttribute("clientes", clientsService.getClients());
    return "add-pet";
  }

  @PostMapping("/add-pet")
  public String agregarMascota(@ModelAttribute("pet") Pet pet, @RequestParam("cedulaCliente") String cedulaCliente) {
    petsService.addPet(pet);
    return "redirect:/vet/pets";
  }

}
