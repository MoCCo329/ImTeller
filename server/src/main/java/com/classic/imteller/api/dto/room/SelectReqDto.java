package com.classic.imteller.api.dto.room;

import lombok.Getter;

import java.util.List;

@Getter
public class SelectReqDto {
    private String nickname;
    private List<Long> selectedCard;
}
