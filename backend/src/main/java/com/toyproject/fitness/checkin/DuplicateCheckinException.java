package com.toyproject.fitness.checkin;

public class DuplicateCheckinException extends RuntimeException {

    public DuplicateCheckinException(String message) {
        super(message);
    }
}
