package com.example.biskit.repo;

import org.springframework.stereotype.Repository;
import com.example.biskit.entities.Client;
import com.example.biskit.entities.Pet;
import com.example.biskit.entities.Especie;
import com.example.biskit.entities.Estado;
import java.util.HashMap;
import java.util.Map;
import java.util.Collection;

@Repository
public class ClientsRepo {

    private Map<Integer, Client> clients = new HashMap<>();

    public ClientsRepo() {
        // 10 CLIENTES DE PRUEBA CON SUS MASCOTAS
        clients.put(1, new Client(1, "Juan Pérez", "123456789", "juan.perez@example.com", "3001234567"));
        clients.put(2, new Client(2, "María López", "987654321", "maria.lopez@example.com", "3009876543"));
        clients.put(3, new Client(3, "Carlos Ramírez", "456789123", "carlos.ramirez@example.com", "3004567890"));
        clients.put(4, new Client(4, "Ana Gómez", "789123456", "ana.gomez@example.com", "3007891234"));
        clients.put(5, new Client(5, "Paula Gutiérrez", "321654987", "paula.gutierrez@example.com", "3003216549"));
        clients.put(6, new Client(6, "Laura Fernández", "654987321", "laura.fernandez@example.com", "3006549873"));
        clients.put(7, new Client(7, "Andrés Res", "159753486", "andres.res@example.com", "3001597534"));
        clients.put(8, new Client(8, "Sofía Ramírez", "753159486", "sofia.ramirez@example.com", "3007531594"));
        clients.put(9, new Client(9, "Pedro Martínez", "852456789", "pedro.martinez@example.com", "3008524567"));
        clients.put(10, new Client(10, "Lucía Sánchez", "456123789", "lucia.sanchez@example.com", "3004561237"));

        // AGREGAR MASCOTAS A LOS CLIENTES
        clients.get(1).getPets().add(new Pet(1, "Firulais", Especie.PERRO, "Pug", Estado.ACTIVO, 3, 20.5f, "Ninguna",
                "https://img.freepik.com/foto-gratis/perro-pug-aislado-sobre-fondo-blanco_2829-11416.jpg?semt=ais_user_personalization&w=740&q=80"));
        clients.get(2).getPets()
                .add(new Pet(2, "Michi", Especie.GATO, "Siames", Estado.ACTIVO, 2, 5.0f, "Ninguna","https://animalpets.co/wp-content/uploads/2024/11/Gato-Siames.png"));
        clients.get(3).getPets()
                .add(new Pet(3, "Rex", Especie.PERRO, "Cocker Spaniel", Estado.INACTIVO, 5, 30.0f, "Artritis", "https://cdn0.uncomo.com/es/posts/7/5/5/como_cuidar_de_un_cocker_spaniel_5557_600_square.jpg"));
        clients.get(4).getPets().add(new Pet(4, "Luna", Especie.GATO, "Persa", Estado.ACTIVO, 1, 4.5f, "Ninguna", "https://media.istockphoto.com/id/962862864/es/foto/persa.jpg?s=612x612&w=0&k=20&c=_pjvQlHP5LnSDDcPj3iVEDDnETc8dxVCYNg6Ucewis8="));
        clients.get(5).getPets()
                .add(new Pet(5, "Igor", Especie.PERRO, "Salchicha", Estado.INACTIVO, 3, 25.0f, "Ninguna", "https://content.elmueble.com/medio/2025/03/18/teckel_d876849b_250318171431_900x900.webp"));
        clients.get(6).getPets().add(new Pet(6, "Simba", Especie.GATO, "Maine Coon", Estado.ACTIVO, 3, 6.0f, "Ninguna","https://www.purina.es/sites/default/files/styles/ttt_image_510/public/2024-02/sitesdefaultfilesstylessquare_medium_440x440public2022-06Maine-Coon-Cat.jpg?itok=6_sYilZv"));
        clients.get(7).getPets()
                .add(new Pet(7, "Rocky", Especie.PERRO, "Bulldog", Estado.ACTIVO, 6, 28.0f, "Ninguna", "https://www.kokogenetics.com/_nuxt/img/141.211e631.webp"));
        clients.get(8).getPets().add(new Pet(8, "Nina", Especie.GATO, "Ragdoll", Estado.INACTIVO, 2, 5.5f, "Alergias", "https://www.purina.es/sites/default/files/styles/ttt_image_510/public/2024-02/sitesdefaultfilesstylessquare_medium_440x440public2022-06Ragdoll.1.jpg?itok=biapx46p"));
        clients.get(9).getPets().add(new Pet(9, "Toby", Especie.PERRO, "Labrador", Estado.ACTIVO, 4, 32.0f, "Ninguna", "https://cdn-ilcmkfh.nitrocdn.com/yyMhcicvwELNLGXsIkJPkrkfmvWjNMQC/assets/images/optimized/rev-cf5c89e/labradoresdeabantueso.com/wp-content/uploads/2013/07/Jara-9-tocada.jpg"));
        clients.get(10).getPets().add(new Pet(10, "Mia", Especie.GATO, "Sphynx", Estado.ACTIVO, 1, 3.0f, "Ninguna", "https://www.purina.es/sites/default/files/styles/ttt_image_510/public/2024-02/sitesdefaultfilesstylessquare_medium_440x440public2022-06Sphynx.jpg?itok=oUrAvazr"));
    }

    public Collection<Client> getClients() {
        return clients.values();
    }

    public Client getClientById(Integer id) {
        return clients.get(id);
    }

    public void saveClient(Client client) {
        if (client.getId() == null) {
            addClient(client);
        } else {
            updateClient(client);
        }
    }

    public void addClient(Client client) {
        int tam = clients.size();
        int LastId = clients.get(tam).getId();
        client.setId(LastId + 1);
        clients.put(client.getId(), client);
    }

    public void updateClient(Client client) {
        clients.put(client.getId(), client);
    }

    public void deleteClient(Integer id) {
        clients.get(id);
        clients.remove(id);
    }
}
