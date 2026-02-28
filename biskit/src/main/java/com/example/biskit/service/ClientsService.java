package com.example.biskit.service;

import java.util.Collection;
import com.example.biskit.entities.Client;
import com.example.biskit.entities.Pet;
import java.util.List;
import org.apache.commons.lang3.tuple.Pair;

public interface ClientsService {

    public Collection<Client> getClients();

    public Client getClientById(Integer id);

    public void addClient(Client client);

    public void updateClient(Client client);

    public void deleteClient(Integer id);

    public List<Pet> getPetsByClientId(Integer clientId);

    public void addPetToClient(Integer clientId, Pet pet);

    public List<Pair<Pet, String>> getPetsAndClientNames();

    public Client getClientByPetId(Integer petId);

}
