package com.cars.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cars.backend.model.MissingAddress;
import com.cars.backend.repository.MissingAddressRepository;

@Service
public class MissingAddressService {

    @Autowired
    private MissingAddressRepository missingAddressRepository;

    public boolean isAddressInDB(String id) {
        return missingAddressRepository.existsById(id);
    }

    public void addAddressToDB(String id) {

        if (id.length() > 255) {
            id = id.substring(0, 255);
        }

        if (isAddressInDB(id)) {
            return;
        }
        MissingAddress missingAddress = new MissingAddress(id);
        missingAddressRepository.save(missingAddress);
    }
}
