package com.example.biskit.service;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.biskit.entities.Pet;
import com.example.biskit.repo.PetsRepo;

@Service
public class PetsImpl implements PetsService {

  @Autowired
  private PetsRepo petsRepo;

  @Override
  public Collection<Pet> getPets() {
    return petsRepo.getPets();
  }

  @Override
  public Pet getPetById(Integer id) {
    return petsRepo.getPetById(id);
  }

  @Override
  public void addPet(String nombre, String especie, String raza, String estado, int edad, float peso, String enfermedad,
      String dueño, String URLFoto) {
    petsRepo.addPet(nombre, especie, raza, estado, edad, peso, enfermedad, dueño, URLFoto);
  }

  @Override
  public void updatePet(Integer id, String nombre, String especie, String raza, String estado, int edad, float peso,
      String enfermedad,
      String dueño, String URLFoto) {
    petsRepo.updatePet(id, nombre, especie, raza, estado, edad, peso, enfermedad, dueño, URLFoto);
  }

  @Override
  public void deletePet(Integer id) {
    petsRepo.deletePet(id);
  }

}
