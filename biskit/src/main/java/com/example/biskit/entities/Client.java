package com.example.biskit.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class Client {
    private Integer id;
    private String nombre;
    private String cedula;
    private String correo;
    private int celular;
    private List<Pet> pets;
}
