package com.classic.imteller.api.dto.game;

import lombok.Getter;

@Getter
public class MakeReqDto {
    private String roomName;
    private String roomPw;
    private int maxNum;
    private String type;
    private int typeNum;
    private String leader;
}
