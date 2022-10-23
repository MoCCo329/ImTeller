package com.classic.imteller.api.dto.deal;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SearchDealResDto {

    private Long dealId;
    private Integer instantPrice;
    private Integer finalBidPrice;
    private String tag;
    private LocalDateTime finishedAt;

    private Long cardId;
    private String cardTitle;
    private String cardImageUrl;
    private Long designerId;
    private String designerNickname;
    private String grade;
    private Integer effect;

}
