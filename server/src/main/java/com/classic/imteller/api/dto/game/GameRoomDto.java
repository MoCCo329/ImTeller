package com.classic.imteller.api.dto.game;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GameRoomDto {
    private long roomId;
    private String roomName;
    private boolean isLocked;
    private int peopleNum;
    private int maxPeopleNum;
    private String type;
    private int typeNum;
    private boolean isStarted;
}
