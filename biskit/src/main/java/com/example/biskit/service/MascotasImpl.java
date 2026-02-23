package com.example.biskit.service;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.biskit.entities.Mascota;
import com.example.biskit.repo.MascotasRepo;

@Service
public class MascotasImpl implements MascotasService {

  @Autowired
  private MascotasRepo mascotasRepo;

  @Override
  public Collection<Mascota> getMascotas() {
    return mascotasRepo.getMascotas();
  }

  @Override
  public Mascota getMascotaById(Integer id) {
    return mascotasRepo.getMascotaById(id);
  }

}
