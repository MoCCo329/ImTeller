package com.classic.imteller.api.dto.room;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UseItemDto {
    private String nickname;
    private long cardId;
    private String grade;
    private int effect;
    private int effectNum;
    private boolean isUsed;
}