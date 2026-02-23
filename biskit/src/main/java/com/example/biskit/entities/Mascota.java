package com.example.biskit.entities;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Mascota {

  private Integer id;
  private String nombre;
  private Especie especie; // Perro o Gato
  private String raza;
  private Estado estado; // Activo o Inactivo
  private int edad;
  private float peso;
  private String enfermedad;
  private String URLFoto;

}
