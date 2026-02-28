package com.example.biskit.repo;

import org.springframework.stereotype.Repository;
import com.example.biskit.entities.Client;
import java.util.HashMap;
import java.util.Map;
import java.util.Collection;

@Repository
public class ClientsRepo {

  private Map<Integer, Client> clients = new HashMap<>();

  public ClientsRepo() {
    // 10 CLIENTES DE PRUEBA
    clients.put(1, new Client(1, "Juan Perez", "123456789", "juan.perez@example.com", "3001234567"));
    clients.put(2, new Client(2, "Maria Gomez", "987654321", "maria.gomez@example.com", "3009876543"));
    clients.put(3, new Client(3, "Carlos Rodriguez", "456789123", "carlos.rodriguez@example.com", "3004567890"));
    clients.put(4, new Client(4, "Ana Martinez", "789123456", "ana.martinez@example.com", "3007891234"));
    clients.put(5, new Client(5, "Luis Hernandez", "321654987", "luis.hernandez@example.com", "3003216549"));
    clients.put(6, new Client(6, "Sofia Lopez", "654987321", "sofia.lopez@example.com", "3006549873"));
    clients.put(7, new Client(7, "Diego Sanchez", "159753486", "diego.sanchez@example.com", "3001597534"));
    clients.put(8, new Client(8, "Laura Ramirez", "753159486", "laura.ramirez@example.com", "3007531594"));
    clients.put(9, new Client(9, "Andres Torres", "852456789", "andres.torres@example.com", "3008524567"));
    clients.put(10, new Client(10, "Carolina Diaz", "456123789", "carolina.diaz@example.com", "3004561237"));
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
