package com.cars.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cars.backend.model.AddressRank;
import com.cars.backend.repository.AddressRankRepository;

@Service
public class AddressRankService {

    @Autowired
    private AddressRankRepository addressRankRepository;

    public Iterable<AddressRank> getAllAddressRanks() {
        return addressRankRepository.findAll();
    }

    public Optional<AddressRank> getAddressRankById(String address) {
        return addressRankRepository.findById(address);
    }

    public AddressRank saveOrUpdateAddressRank(AddressRank addressRank) {
        return addressRankRepository.save(addressRank);
    }

    public void deleteAddressRank(String address) {
        addressRankRepository.deleteById(address);
    }
}
