package com.cars.backend.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Column;


@Entity
@Table(name = "bitcoin")
public class AddressRank {

    @Id
    @Column(name = "address")
    private String address;

    @Column(name = "note")
    private int rank;

    public AddressRank() {
    }

    public AddressRank(String address, int rank) {
        this.address = address;
        this.rank = rank;
    }

    // Getters and setters

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public int getRank() {
        return rank;
    }

    public void setRank(int rank) {
        this.rank = rank;
    }

}
