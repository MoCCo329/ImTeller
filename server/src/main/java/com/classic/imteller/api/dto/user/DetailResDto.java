package com.classic.imteller.api.dto.user;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class DetailResDto {
    private String nickname;
    private String profile;
    private int exp;
    private int win;
    private int lose;
    private LocalDateTime createdAt;
    private String wallet;
}
