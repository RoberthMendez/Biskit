package com.example.biskit.service;

import java.util.Collection;

import com.example.biskit.entities.Mascota;

public interface MascotasService {

  public Collection<Mascota> getMascotas();

  public Mascota getMascotaById(Integer id);

}
