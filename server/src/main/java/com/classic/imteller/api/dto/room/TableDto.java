package com.classic.imteller.api.dto.room;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TableDto {
    private String nickname;
    private long cardId;
    private String cardUrl;
    private boolean isTeller;

    public boolean getIsTeller() {
        return this.isTeller;
    }
}
