package com.cars.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.security.access.AccessDeniedException;

@RestControllerAdvice
public class CustomExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleException(Exception ex) {

        // print log error
        System.out.println("ERROR - " + ex);

        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        String message = "Internal Server Error";


        return new ResponseEntity<>(message, status);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Object> handleAccessDeniedException(AccessDeniedException ex) {
        HttpStatus status = HttpStatus.FORBIDDEN;
        String message = "INSUFFICIENT_PERMISSIONS";

        return new ResponseEntity<>(message, status);
    }

    @ExceptionHandler(MaxRequestException.class)
    public ResponseEntity<Object> handleMaxRequestException(MaxRequestException ex) {
        HttpStatus status = HttpStatus.TOO_MANY_REQUESTS;
        String message = ex.getMessage();

        return new ResponseEntity<>(message, status);
    }

    @ExceptionHandler(AddressNotAvailableException.class)
    public ResponseEntity<Object> handleAddressNotAvailableException(AddressNotAvailableException ex) {
        HttpStatus status = HttpStatus.NOT_FOUND;
        String message = ex.getMessage();

        return new ResponseEntity<>(message, status);
    }
}
