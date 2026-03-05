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
  private String usuario;
  private String contraseña;
  private List<Pet> pets = new ArrayList<>();

  public Client(Integer id, String nombre, String cedula, String correo, String celular, String usuario,
      String contraseña) {
    this.id = id;
    this.nombre = nombre;
    this.cedula = cedula;
    this.correo = correo;
    this.celular = celular;
    this.usuario = usuario;
    this.contraseña = contraseña;
    this.pets = new ArrayList<Pet>();
  }

}
