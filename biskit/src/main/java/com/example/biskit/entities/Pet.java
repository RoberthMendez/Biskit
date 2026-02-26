package com.example.biskit.entities;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Pet {

  private Integer id;
  private String nombre;
  private Especie especie; // Perro o Gato
  private String raza;
  private Estado estado; // Activo o Inactivo
  private int edad;
  private float peso;
  private String enfermedad;
  private String dueño;
  private String URLFoto;

  public String getNombreDueño() {

    return dueño.split(" ")[0];

  }

  public String getApellidoDueño() {

    String[] partes = dueño.split(" ");
    if (partes.length > 1)
      return partes[partes.length - 1];

    return "";
  }

  public void update(String nombre, Especie especie, String raza, Estado estado, int edad, float peso,
      String enfermedad,
      String dueño, String URLFoto) {
    this.nombre = nombre;
    this.especie = especie;
    this.raza = raza;
    this.estado = estado;
    this.edad = edad;
    this.peso = peso;
    this.enfermedad = enfermedad;
    this.dueño = dueño;
    this.URLFoto = URLFoto;
  }

}
