package com.classic.imteller.api.dto.room;

import lombok.Getter;

@Getter
public class ReadyReqDto {
    private String nickname;
    private boolean isReady;

    public boolean getIsReady() {
        return this.isReady;
    }
}
