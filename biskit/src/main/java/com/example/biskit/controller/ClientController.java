package com.example.biskit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.biskit.entities.Client;
import com.example.biskit.entities.Pet;
import com.example.biskit.service.Clients.ClientsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestParam;

import org.apache.commons.lang3.tuple.Pair;
import java.util.List;
import java.util.ArrayList;

@Controller
@RequestMapping("/client")
public class ClientController {

  @Autowired
  ClientsService clientsService;

  @GetMapping("/login")
  public String getMethodName(@RequestParam(required = false) String error, Model model) {

    if (error != null && error.equals("1")) {
      model.addAttribute("error", "Usuario o contraseña incorrectos");
    }
    return "client/login";
  }

  @PostMapping("/login")
  public String postMethodName(@RequestParam String usuario, @RequestParam String contrasena) {

    if (usuario.isEmpty() || contrasena.isEmpty() || !clientsService.autenticarClient(usuario, contrasena)) {
      return "redirect:/client/login?error=1";
    }

    Client client = clientsService.findByUsuario(usuario);
    return "redirect:/client/" + client.getId() + "/pets";

  }

  @GetMapping("{id}/pets")
  public String getMethodName(@PathVariable("id") Integer id, Model model) {

    List<Pair<Pet, String>> petNamesAndVetNames = new ArrayList<>();

    List<Pet> pets = clientsService.getPetsByClientId(id);
    for (Pet pet : pets) {
      String vetName = clientsService.getClientById(id).getNombre() != null
          ? clientsService.getClientById(id).getNombre()
          : "Sin veterinario asignado";
      petNamesAndVetNames.add(Pair.of(pet, vetName));
    }
    model.addAttribute("petsClientname", petNamesAndVetNames);

    return "vet/pets/pets";
  }

}