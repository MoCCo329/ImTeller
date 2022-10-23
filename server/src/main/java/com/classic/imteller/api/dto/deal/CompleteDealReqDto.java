package com.classic.imteller.api.dto.deal;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CompleteDealReqDto {

    private String bidderNickname;
    private Long tokenId;

}
