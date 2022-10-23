package com.classic.imteller.api.dto.user;

import lombok.Getter;

@Getter
public class EditReqDto {
    private String email;
    private String password;
    private String nickname;
    private String profile;

    public void updatePassword(String password) {
        this.password = password;
    }

    public void updateProfile(String profilePath) {
        this.profile = profilePath;
    }
}
