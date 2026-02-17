package com.toyproject.fitness.checkin;

import jakarta.validation.ConstraintViolationException;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.http.converter.HttpMessageNotReadableException;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(DuplicateCheckinException.class)
    public ResponseEntity<ApiErrorResponse> handleDuplicateCheckin(DuplicateCheckinException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ApiErrorResponse("DUPLICATE_CHECKIN", ex.getMessage()));
    }

    @ExceptionHandler(GroupNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleGroupNotFound(GroupNotFoundException ex) {
        return ResponseEntity.badRequest()
                .body(new ApiErrorResponse("GROUP_NOT_FOUND", ex.getMessage()));
    }

    @ExceptionHandler(MemberNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleMemberNotFound(MemberNotFoundException ex) {
        return ResponseEntity.badRequest()
                .body(new ApiErrorResponse("MEMBER_NOT_FOUND", ex.getMessage()));
    }

    @ExceptionHandler({
            MethodArgumentNotValidException.class,
            ConstraintViolationException.class,
            BindException.class,
            MissingServletRequestParameterException.class,
            MethodArgumentTypeMismatchException.class,
            HttpMessageNotReadableException.class
    })
    public ResponseEntity<ApiErrorResponse> handleValidationException(Exception ex) {
        String message = extractValidationMessage(ex);
        return ResponseEntity.badRequest()
                .body(new ApiErrorResponse("VALIDATION_ERROR", message));
    }

    private String extractValidationMessage(Exception ex) {
        if (ex instanceof MethodArgumentNotValidException methodArgumentNotValidException) {
            return methodArgumentNotValidException.getBindingResult()
                    .getFieldErrors()
                    .stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
        }
        if (ex instanceof ConstraintViolationException constraintViolationException) {
            return constraintViolationException.getConstraintViolations()
                    .stream()
                    .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                    .collect(Collectors.joining(", "));
        }
        if (ex instanceof BindException bindException) {
            return bindException.getBindingResult()
                    .getFieldErrors()
                    .stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.joining(", "));
        }
        if (ex instanceof MissingServletRequestParameterException missingServletRequestParameterException) {
            return missingServletRequestParameterException.getParameterName() + ": is required";
        }
        if (ex instanceof MethodArgumentTypeMismatchException methodArgumentTypeMismatchException) {
            return methodArgumentTypeMismatchException.getName() + ": invalid value";
        }
        if (ex instanceof HttpMessageNotReadableException) {
            return "Request body is malformed or contains invalid values.";
        }
        return "Validation failed.";
    }

    public record ApiErrorResponse(String code, String message) {
    }
}
