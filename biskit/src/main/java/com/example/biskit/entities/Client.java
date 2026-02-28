package com.example.biskit.entities;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class Client {
  private Integer id;
  private String nombre;
  private String cedula;
  private String correo;
  private String celular;
  private List<Pet> pets;

  public Client(Integer id, String nombre, String cedula, String correo, String celular) {
    this.id = id;
    this.nombre = nombre;
    this.cedula = cedula;
    this.correo = correo;
    this.celular = celular;
    this.pets = new ArrayList<Pet>();
  }

}
