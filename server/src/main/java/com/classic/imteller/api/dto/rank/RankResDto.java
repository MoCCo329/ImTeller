package com.classic.imteller.api.dto.rank;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor
public class RankResDto {

    private List<DealRank> dealRankList;
    private List<WinningRateRank> winningRateRankList;
    private List<LevelRank> levelRankList;
    private BestPaint bestPaint;

    public RankResDto(List<DealRank> dealRankList, List<WinningRateRank> winningRateRankList, List<LevelRank> levelRankList, BestPaint bestPaint) {
        this.dealRankList = dealRankList;
        this.winningRateRankList = winningRateRankList;
        this.levelRankList = levelRankList;
        this.bestPaint = bestPaint;
    }

    @Getter
    @Builder
    public static class DealRank {
        private String cardTitle;
        private String cardImageURL;
        private String designerNickname;
        private String buyerNickname;
        private Integer price;
        private LocalDateTime dealedAt;
    }

    @Getter
    @Builder
    public static class WinningRateRank {
        private String nickname;
        private String winningRate;
        private Integer win;
        private Integer lose;
    }

    @Getter
    @Builder
    public static class LevelRank {
        private String nickname;
        private Integer level;
        private Integer totalGame;
    }

    @Getter
    @Builder
    public static class BestPaint {
        private String paintTitle;
        private String paintImageURL;
        private String designerNickname;
    }

}
