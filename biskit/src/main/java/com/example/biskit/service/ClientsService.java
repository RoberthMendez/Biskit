package com.example.biskit.service;

import java.util.Collection;
import com.example.biskit.entities.Client;
import com.example.biskit.entities.Pet;
import java.util.List;

public interface ClientsService {

    public Collection<Client> getClients();

    public Client getClientById(Integer id);

    public void addClient(Client client);

    public void updateClient(Client client);

    public void deleteClient(Integer id);

    public List<Pet> getPetsByClientId(Integer clientId);

}
