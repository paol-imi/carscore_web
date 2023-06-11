package com.cars.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cars.backend.model.CarsUser;
import com.cars.backend.repository.CarsUserRepository;
import java.time.LocalDate;

@Service
public class CarsUserService {

    @Autowired
    private CarsUserRepository carsUserRepository;

    private final int CLASSIC_USER = 0;
    private final int PREMIUM_USER = 1;

    private final int MAX_REQ_FOR_CLASSIC = 5000; // putting 5000 temporary for test purpose
    private final int MAX_REQ_FOR_PREMIUM = 30;

    public Optional<CarsUser> getCarsUser(String id) {
        return carsUserRepository.findById(id);
    }

    public CarsUser saveOrUpdateUser(CarsUser user) {
        return carsUserRepository.save(user);
    }

    public void deleteUser(String id) {
        carsUserRepository.deleteById(id);
    }

    public boolean hasRequestAvailable(String id) {
        Optional<CarsUser> user = carsUserRepository.findById(id);

        if (user.isPresent()) {
            CarsUser carsUser = user.get();

            if (carsUser.getUserPermission() == CLASSIC_USER) {
                return carsUser.getNbOfUse() < MAX_REQ_FOR_CLASSIC || LocalDate.now().isAfter(carsUser.getLastUse());
            } else if (carsUser.getUserPermission() == PREMIUM_USER) {
                return carsUser.getNbOfUse() < MAX_REQ_FOR_PREMIUM || LocalDate.now().isAfter(carsUser.getLastUse());
            } else {
                return false;
            }
        } else {
            CarsUser newUser = new CarsUser(id, CLASSIC_USER);
            carsUserRepository.save(newUser);
            return true;
        }
    }

    public void incrementNbOfUse(String id) {
        Optional<CarsUser> user = carsUserRepository.findById(id);
        if (user.isPresent()) {
            CarsUser carsUser = user.get();
            if (LocalDate.now().isAfter(carsUser.getLastUse())) {
                carsUser.setNbOfUse(0);
                carsUser.setLastUse(LocalDate.now());
            }
            carsUser.setNbOfUse(carsUser.getNbOfUse() + 1);
            carsUserRepository.save(carsUser);
        }
    }

}
