package com.classic.imteller.api.dto.deal;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor
public class DealDetailResDto {

    private DealInfo dealInfo;
    private CardInfo cardInfo;
    private List<DealHistory> dealHistoryList;

    public DealDetailResDto(DealInfo dealInfo, CardInfo cardInfo, List<DealHistory> dealHistoryList) {
        this.dealInfo = dealInfo;
        this.cardInfo = cardInfo;
        this.dealHistoryList = dealHistoryList;
    }

    @Getter
    @Builder
    public static class DealInfo {
        private Long dealId;
        private Integer instantPrice;
        private Integer finalBidPrice;
        private String tag;
        private String dealAddress;
        private LocalDateTime finishedAt;
    }

    @Getter
    @Builder
    public static class CardInfo {
        private Long cardId;
        private String cardTitle;
        private String cardImageURL;
        private String description;
        private Long tokenId;
        private Long designerId;
        private String designerNickname;
        private Long ownerId;
        private String ownerNickname;
        private String grade;
        private Integer effect;
        private Integer effectNum;
        private LocalDateTime createdAt;
    }

    @Getter
    @Builder
    public static class DealHistory {
        private Long sellerId;
        private String sellerNickname;
        private Long buyerId;
        private String buyerNickname;
        private Integer price;
        private LocalDateTime dealedAt;
    }

}
