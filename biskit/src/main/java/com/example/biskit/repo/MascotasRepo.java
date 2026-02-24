package com.example.biskit.repo;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.example.biskit.entities.Especie;
import com.example.biskit.entities.Estado;
import com.example.biskit.entities.Mascota;

@Repository
public class MascotasRepo {

  private Map<Integer, Mascota> mascotas = new HashMap<>();

  public MascotasRepo() {
    mascotas.put(1, new Mascota(1, "Firulais", Especie.PERRO, "Pug", Estado.ACTIVO, 3, 20.5f, "Ninguna", "Juan Pérez",
        "https://img.freepik.com/foto-gratis/perro-pug-aislado-sobre-fondo-blanco_2829-11416.jpg?semt=ais_user_personalization&w=740&q=80"));
    mascotas.put(2, new Mascota(2, "Michi", Especie.GATO, "Siames", Estado.ACTIVO, 2, 5.0f, "Ninguna", "María López",
        "https://animalpets.co/wp-content/uploads/2024/11/Gato-Siames.png"));
    mascotas.put(3,
        new Mascota(3, "Rex", Especie.PERRO, "Cocker Spaniel", Estado.INACTIVO, 5, 30.0f, "Artritis", "Carlos Ramírez",
            "https://cdn0.uncomo.com/es/posts/7/5/5/como_cuidar_de_un_cocker_spaniel_5557_600_square.jpg"));
    mascotas.put(4, new Mascota(4, "Luna", Especie.GATO, "Persa", Estado.ACTIVO, 1, 4.5f, "Ninguna", "Ana Gómez",
        "https://media.istockphoto.com/id/962862864/es/foto/persa.jpg?s=612x612&w=0&k=20&c=_pjvQlHP5LnSDDcPj3iVEDDnETc8dxVCYNg6Ucewis8="));
    mascotas.put(5,
        new Mascota(5, "Igor", Especie.PERRO, "Salchicha", Estado.INACTIVO, 3, 25.0f, "Ninguna", "Paula Gutiérrez",
            "https://content.elmueble.com/medio/2025/03/18/teckel_d876849b_250318171431_900x900.webp"));
    mascotas.put(6, new Mascota(6, "Simba", Especie.GATO, "Maine Coon", Estado.ACTIVO, 3, 6.0f, "Ninguna",
        "Laura Fernández",
        "https://www.purina.es/sites/default/files/styles/ttt_image_510/public/2024-02/sitesdefaultfilesstylessquare_medium_440x440public2022-06Maine-Coon-Cat.jpg?itok=6_sYilZv"));
    mascotas.put(7,
        new Mascota(7, "Rocky", Especie.PERRO, "Bulldog", Estado.ACTIVO, 6, 28.0f, "Ninguna", "Andrés Res",
            "https://www.kokogenetics.com/_nuxt/img/141.211e631.webp"));
    mascotas.put(8, new Mascota(8, "Nina", Especie.GATO, "Ragdoll", Estado.INACTIVO, 2, 5.5f, "Alergias",
        "Sofía Ramírez",
        "https://www.purina.es/sites/default/files/styles/ttt_image_510/public/2024-02/sitesdefaultfilesstylessquare_medium_440x440public2022-06Ragdoll.1.jpg?itok=biapx46p"));
    mascotas.put(9, new Mascota(9, "Toby", Especie.PERRO, "Labrador", Estado.ACTIVO, 4, 32.0f, "Ninguna",
        "Pedro Martínez",
        "https://cdn-ilcmkfh.nitrocdn.com/yyMhcicvwELNLGXsIkJPkrkfmvWjNMQC/assets/images/optimized/rev-cf5c89e/labradoresdeabantueso.com/wp-content/uploads/2013/07/Jara-9-tocada.jpg"));
    mascotas.put(10, new Mascota(10, "Mia", Especie.GATO, "Sphynx", Estado.ACTIVO, 1, 3.0f, "Ninguna", "Lucía Sánchez",
        "https://www.purina.es/sites/default/files/styles/ttt_image_510/public/2024-02/sitesdefaultfilesstylessquare_medium_440x440public2022-06Sphynx.jpg?itok=oUrAvazr"));

  }

  public Collection<Mascota> getMascotas() {
    return mascotas.values();
  }

  public Mascota getMascotaById(int id) {
    return mascotas.get(id);
  }

}
