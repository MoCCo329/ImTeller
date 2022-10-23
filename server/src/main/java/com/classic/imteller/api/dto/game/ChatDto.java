package com.classic.imteller.api.dto.game;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatDto {
    private String roomId;
    private String writer;
    private String message;
}
