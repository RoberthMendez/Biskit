package com.example.biskit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.biskit.service.MascotasService;

@Controller
@RequestMapping("/mascotas")
public class MascotasController {

  @Autowired
  private MascotasService mascotasService;

  @GetMapping()
  public String mostrarMascotas(Model model) {
    model.addAttribute("mascotas", mascotasService.getMascotas());
    return "mascotas";
  }

  @GetMapping("/{id}")
  public String mostrarMascota(@PathVariable("id") Integer id, Model model) {
    model.addAttribute("mascota", mascotasService.getMascotaById(id));
    return "info-mascota";
  }

}
