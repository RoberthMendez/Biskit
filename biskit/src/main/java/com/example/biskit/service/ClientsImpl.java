package com.example.biskit.service;

import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.biskit.entities.Client;
import com.example.biskit.entities.Pet;

import com.example.biskit.repo.ClientsRepo;

@Service
public class ClientsImpl implements ClientsService {

    @Autowired
    private ClientsRepo clientsRepo;

    @Override
    public Collection<Client> getClients() {
        return clientsRepo.getClients();
    }

    @Override
    public Client getClientById(Integer id) {
        return clientsRepo.getClientById(id);
    }

    @Override
    public void addClient(Client client) {
        clientsRepo.saveClient(client);
    }

    @Override
    public void updateClient(Client client) {
        clientsRepo.saveClient(client);
    }

    @Override
    public void deleteClient(Integer id) {
        clientsRepo.deleteClient(id);
    }

    @Override
    public List<Pet> getPetsByClientId(Integer clientId) {
        Client client = clientsRepo.getClientById(clientId);
        return client.getPets();
    }
}