package com.empresa.userform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserCreateRequest {
    @NotBlank(message = "O Nome do Usuário é obrigatorio")
    private String name;

    @NotBlank(message = "O Email do Usuário é obrigatorio")
    @Email(message = "O Email do Usuário deve ser valido")
    private String email;

    @NotBlank(message = "A Senha do Usuário é obrigatorio")
    private String password;
}
