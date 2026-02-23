package com.example.biskit.entities;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Especie {

  PERRO("Perro"),
  GATO("Gato");

  private final String texto;

}
