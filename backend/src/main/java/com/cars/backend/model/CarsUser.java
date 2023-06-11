package com.cars.backend.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Column;
import java.time.LocalDate;


@Entity
@Table(name = "users")
public class CarsUser {

    @Id
    @Column(name = "ID")
    private String userId;

    @Column(name = "perm")
    private int userPermission;

    @Column(name = "last_use")
    private LocalDate lastUse;

    @Column(name = "nb_of_use")
    private int nbOfUse;

    public CarsUser() {
        userPermission = 0;
    }

    public CarsUser(String userId, int userPermission, LocalDate lastUse, int nbOfUse) {
        this.userId = userId;
        this.userPermission = userPermission;
        this.lastUse = lastUse;
        this.nbOfUse = nbOfUse;
    }

    public CarsUser(String userId, int userPermission) {
        this.userId = userId;
        this.userPermission = userPermission;
        this.lastUse = LocalDate.now();
        this.nbOfUse = 0;
    }

    // Getters and setters

    public String getUserId() {
        return userId;
    }

    public int getUserPermission() {
        return userPermission;
    }

    public LocalDate getLastUse() {
        return lastUse;
    }

    public int getNbOfUse() {
        return nbOfUse;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setUserPermission(int userPermission) {
        this.userPermission = userPermission;
    }

    public void setLastUse(LocalDate lastUse) {
        this.lastUse = lastUse;
    }

    public void setNbOfUse(int nbOfUse) {
        this.nbOfUse = nbOfUse;
    }

}
