package com.example.biskit.repo;

import org.springframework.stereotype.Repository;
import com.example.biskit.entities.Client;
import java.util.HashMap;
import java.util.Map;
import java.util.Collection;

@Repository
public class ClientsRepo {
    private Map<Integer, Client> clients = new HashMap<>();

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
