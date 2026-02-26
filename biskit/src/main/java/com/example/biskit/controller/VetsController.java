package com.example.biskit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.biskit.service.PetsService;

@Controller
@RequestMapping("/vet")
public class VetsController {

  @Autowired
  private PetsService petsService;

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

}
