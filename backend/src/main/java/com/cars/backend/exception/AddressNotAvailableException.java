package com.cars.backend.exception;

public class AddressNotAvailableException extends RuntimeException {
    public AddressNotAvailableException() {
        super("ADDRESS NOT AVAILABLE");
    }
}

