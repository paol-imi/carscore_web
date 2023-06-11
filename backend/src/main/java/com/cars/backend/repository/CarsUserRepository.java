package com.cars.backend.repository;

import com.cars.backend.model.CarsUser;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarsUserRepository extends CrudRepository<CarsUser, String> {

}