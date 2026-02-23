package com.example.biskit.entities;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Estado {

  ACTIVO("Activo"),
  INACTIVO("Inactivo");

  private final String texto;

}
