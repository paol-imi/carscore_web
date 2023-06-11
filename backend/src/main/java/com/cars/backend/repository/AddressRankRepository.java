package com.cars.backend.repository;

import com.cars.backend.model.AddressRank;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRankRepository extends CrudRepository<AddressRank, String> {

}