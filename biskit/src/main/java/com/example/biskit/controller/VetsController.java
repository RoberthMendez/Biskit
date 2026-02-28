package com.example.biskit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.biskit.service.PetsService;
import com.example.biskit.service.ClientsService;

@Controller
@RequestMapping("/vet")
public class VetsController {

  @Autowired
  private PetsService petsService;

  @Autowired
  private ClientsService clientsService;

  @GetMapping("/new-client")
  public String mostrarFormularioNuevoCliente(Model model) {
    model.addAttribute("client", new Object()); // Aquí puedes usar tu clase Client en lugar de Object
    return "vet/new-client";
  }

  // ----- MASCOTAS -----
  @GetMapping("/pets")
  public String mostrarMascotas(Model model) {
    model.addAttribute("pets", petsService.getPets());
    return "vet/pets";
  }

  @GetMapping("/pets/{id}")
  public String mostrarMascota(@PathVariable("id") Integer id, Model model) {
    model.addAttribute("pet", petsService.getPetById(id));
    return "vet/info-pet";
  }

  @PostMapping("/pets/delete/{id}")
  public String eliminarMascota(@PathVariable("id") Integer id) {
    petsService.deletePet(id);
    return "redirect:/vet/pets";
  }

}
