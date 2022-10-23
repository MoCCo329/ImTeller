package com.classic.imteller.api.dto.room;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GameCardDto {
    private long cardId;
    private String cardUrl;
}
