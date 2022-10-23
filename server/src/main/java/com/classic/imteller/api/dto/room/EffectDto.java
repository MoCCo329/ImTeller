package com.classic.imteller.api.dto.room;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EffectDto {
    private long cardId;
    private String nickname;
    private int effect;
    private int effectNum;
}
