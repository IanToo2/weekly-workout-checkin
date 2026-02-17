package com.toyproject.fitness.checkin;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingServletRequestParameterException;

class ApiExceptionHandlerTest {

    private ApiExceptionHandler apiExceptionHandler;

    @BeforeEach
    void setUp() {
        apiExceptionHandler = new ApiExceptionHandler();
    }

    @Test
    void handleDuplicateCheckin_mapsToConflictContract() {
        ResponseEntity<ApiExceptionHandler.ApiErrorResponse> response =
                apiExceptionHandler.handleDuplicateCheckin(
                        new DuplicateCheckinException("Only one check-in per day is allowed.")
                );

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals("DUPLICATE_CHECKIN", response.getBody().code());
        assertEquals("Only one check-in per day is allowed.", response.getBody().message());
    }

    @Test
    void handleGroupNotFound_mapsToBadRequestContract() {
        ResponseEntity<ApiExceptionHandler.ApiErrorResponse> response =
                apiExceptionHandler.handleGroupNotFound(new GroupNotFoundException("Group not found: 999"));

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("GROUP_NOT_FOUND", response.getBody().code());
        assertEquals("Group not found: 999", response.getBody().message());
    }

    @Test
    void handleMemberNotFound_mapsToBadRequestContract() {
        ResponseEntity<ApiExceptionHandler.ApiErrorResponse> response =
                apiExceptionHandler.handleMemberNotFound(new MemberNotFoundException("Member not found: 999"));

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("MEMBER_NOT_FOUND", response.getBody().code());
        assertEquals("Member not found: 999", response.getBody().message());
    }

    @Test
    void handleValidationException_mapsMissingParamToValidationErrorContract() throws Exception {
        ResponseEntity<ApiExceptionHandler.ApiErrorResponse> response =
                apiExceptionHandler.handleValidationException(
                        new MissingServletRequestParameterException("groupId", "Long")
                );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("VALIDATION_ERROR", response.getBody().code());
        assertEquals("groupId: is required", response.getBody().message());
    }
}
