package com.empresa.userform.service;

import com.empresa.userform.dto.UserCreateRequest;
import com.empresa.userform.dto.UserResponse;
import com.empresa.userform.entity.User;
import com.empresa.userform.repository.UserRepository;
import com.empresa.userform.util.MD5PasswordEncoder;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserResponse createUser(UserCreateRequest dto) {
        List<String> errors = validate(dto);

        if (!errors.isEmpty()) {
            throw new IllegalArgumentException(String.join("; ", errors));
        }

        boolean haveUserWIthThisEmail = userRepository.findByEmail(dto.getEmail()).isPresent();
        if (haveUserWIthThisEmail) {
            throw new IllegalArgumentException("Email já existe no sistema");
        }

        String hashedPassword = MD5PasswordEncoder.encode(dto.getPassword());

        User user = User.builder()
                .name(dto.getName().trim())
                .email(dto.getEmail().trim())
                .hashPassword(hashedPassword)
                .createdAt(LocalDateTime.now())
                .build();

        User createdUser = userRepository.save(user);

        return UserResponse.builder()
                .id(createdUser.getId())
                .name(createdUser.getName())
                .email(createdUser.getEmail())
                .createdAt(createdUser.getCreatedAt())
                .build();
    }

    private List<String> validate(UserCreateRequest dto) {
        List<String> errors = new ArrayList<String>();

        if (dto.getName().trim().isEmpty()) {
            errors.add("Nome não pode estar vazio");
        }

        String password = dto.getPassword();
        if (password.length() < 8 || password.length() > 16)
            errors.add("Senha deve ter entre 8 e 16 caracteres");
        if (!password.matches(".*[a-z].*"))
            errors.add("Senha deve conter letra minúscula");
        if (!password.matches(".*[A-Z].*"))
            errors.add("Senha deve conter letra maiúscula");
        if (!password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{}|;:,.<>?].*"))
            errors.add("Senha deve conter símbolo");

        return errors;
    }
}
