package com.example.biskit.service;

import java.util.Collection;

import com.example.biskit.entities.Pet;

public interface PetsService {

  public Collection<Pet> getPets();

  public Pet getPetById(Integer id);

  public void addPet(Pet pet);

  public void updatePet(Pet pet);

  public void deletePet(Integer id);

}
