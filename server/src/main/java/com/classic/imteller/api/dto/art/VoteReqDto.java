package com.classic.imteller.api.dto.art;

import lombok.Getter;

@Getter
public class VoteReqDto {
    private String userNickname;
    private Long artId;
}
