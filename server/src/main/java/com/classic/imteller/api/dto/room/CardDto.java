package com.classic.imteller.api.dto.room;

import lombok.Getter;

@Getter
public class CardDto {
    private long cardId;
    private String grade;
    private long effect;
    private int effectNum;
}
