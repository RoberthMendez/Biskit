package com.example.biskit.service;

import java.util.Collection;

import com.example.biskit.entities.Pet;

public interface PetsService {

  public Collection<Pet> getPets();

  public Pet getPetById(Integer id);

}
