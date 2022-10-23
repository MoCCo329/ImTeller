package com.classic.imteller.api.dto.deal;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class BidReqDto {

    private String bidderNickname;
    private Integer bidPrice;
    private Integer bidType;

}
