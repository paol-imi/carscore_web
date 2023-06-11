package com.cars.backend.exception;

public class MaxRequestException extends RuntimeException {
    public MaxRequestException() {
        super("REQUEST LIMIT REACHED");
    }
}
