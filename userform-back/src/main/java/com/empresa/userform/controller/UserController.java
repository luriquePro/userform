package com.empresa.userform.controller;

import com.empresa.userform.dto.UserCreateRequest;
import com.empresa.userform.dto.UserResponse;
import com.empresa.userform.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody UserCreateRequest request) {
        try {
            UserResponse response = userService.createUser(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Dados inválidos", e.getMessage().split("; ")));
        }
    }

    record ErrorResponse(String error, String[] details) {
    }
}
