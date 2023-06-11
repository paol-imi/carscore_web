package com.cars.backend.repository;

import com.cars.backend.model.MissingAddress;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MissingAddressRepository extends CrudRepository<MissingAddress, String> {

}