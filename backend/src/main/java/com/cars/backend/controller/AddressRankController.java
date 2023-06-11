package com.cars.backend.controller;

import com.cars.backend.LambdaHandler;
import com.cars.backend.model.AddressRank;
import com.cars.backend.service.AddressRankService;
import com.cars.backend.service.CarsUserService;
import com.cars.backend.service.MissingAddressService;
import com.cars.backend.exception.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;


import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
public class AddressRankController {

    @Autowired
    private AddressRankService addressRankService;

    @Autowired
    private CarsUserService carsUserService;

    @Autowired
    private MissingAddressService missingAddressService;


    @GetMapping("/address")
    @PreAuthorize("denyAll()")
    public Iterable<AddressRank> getAllAddressRanks() {
        return addressRankService.getAllAddressRanks();
    }

    @GetMapping("/address/{id}")
    public Optional<AddressRank> getAddressRankById(@PathVariable("id") String id) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String tokenID = authentication.getName();

        if (carsUserService.hasRequestAvailable(tokenID)) {
            carsUserService.incrementNbOfUse(tokenID);
            Optional<AddressRank> rank = addressRankService.getAddressRankById(id);
            if(rank.isPresent()) {
                return rank;
            } else {
                missingAddressService.addAddressToDB(id);
                throw new AddressNotAvailableException();
            }
        } else {
            throw new MaxRequestException();
        }
    }


    @PutMapping("/address/{id}")
    @PreAuthorize("denyAll()")
    public AddressRank updateAddressRank(@PathVariable("id") String id, @RequestBody AddressRank addressRank) {
        Optional<AddressRank> rank = addressRankService.getAddressRankById(id);
        if(rank.isPresent()) {
            AddressRank newRank = rank.get();
            newRank.setRank(addressRank.getRank());
            newRank.setAddress(addressRank.getAddress());
            return addressRankService.saveOrUpdateAddressRank(newRank);
        } else {
            return null;
        }
    }

    @PostMapping("/address")
    @PreAuthorize("denyAll()")
    public AddressRank saveOrUpdateAddressRank(@RequestBody AddressRank addressRank) {
        return addressRankService.saveOrUpdateAddressRank(addressRank);
    }

    @DeleteMapping("/address/{id}")
    @PreAuthorize("denyAll()")
    public void deleteAddressRank(@PathVariable("id") String id) {
        addressRankService.deleteAddressRank(id);
    }
}
