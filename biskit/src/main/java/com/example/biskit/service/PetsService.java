package com.example.biskit.service;

import java.util.Collection;

import com.example.biskit.entities.Pet;

public interface PetsService {

  public Collection<Pet> getPets();

  public Pet getPetById(Integer id);

  public void addPet(String nombre, String especie, String raza, String estado, int edad, float peso, String enfermedad,
      String dueño, String URLFoto);

  public void updatePet(Integer id, String nombre, String especie, String raza, String estado, int edad, float peso,
      String enfermedad,
      String dueño, String URLFoto);

  public void deletePet(Integer id);

}
