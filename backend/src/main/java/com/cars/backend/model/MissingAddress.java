package com.cars.backend.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Column;


@Entity
@Table(name = "missing_address")
public class MissingAddress {

    @Id
    @Column(name = "missing_address")
    private String missingAddr;

    public MissingAddress() {
    }

    public MissingAddress(String address) {
        this.missingAddr = address;
    }

    // Getters and setters

    public String getMissingAddr() {
        return missingAddr;
    }

    public void setMissingAddr(String address) {
        this.missingAddr = address;
    }
}
