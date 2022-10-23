package com.classic.imteller.api.service;

import com.classic.imteller.api.dto.rank.RankResDto;
import com.classic.imteller.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class RankService {

    private final DealRepository dealRepository;
    private final UserRepository userRepository;
    private final VoteRepository voteRepository;

    @Transactional(readOnly = true)
    public RankResDto getRanking() {
        List<RankResDto.DealRank> dealRankList = getDealRank();
        List<RankResDto.WinningRateRank> winningRateRankList = getWinningRateRank();
        List<RankResDto.LevelRank> levelRankList = getLevelRank();
        RankResDto.BestPaint bestPaint = getBestPaint();
        return new RankResDto(dealRankList, winningRateRankList, levelRankList, bestPaint);
    }

    @Transactional(readOnly = true)
    public RankResDto.BestPaint getBestPaint() {
        int prevYear = LocalDate.now().minusMonths(1).getYear();
        int prevMonth = LocalDate.now().minusMonths(1).getMonthValue();
        List<Vote> voteList = voteRepository.findByIsVotingAndCreatedAt(prevYear, prevMonth);
        if (voteList == null || voteList.size() == 0) {
            return null;
        }
        Art paint = voteList.get(0).getArt();
        RankResDto.BestPaint bestPaint = RankResDto.BestPaint.builder()
                .paintTitle(paint.getTitle())
                .paintImageURL(paint.getUrl())
                .designerNickname(paint.getDesigner().getNickname())
                .build();
        return bestPaint;
    }

    @Transactional(readOnly = true)
    public List<RankResDto.LevelRank> getLevelRank() {
        List<User> userList = userRepository.findTop10ByOrderByLevelDescExpDesc();
        if (userList == null || userList.size() == 0) {
            return null;
        }
        List<RankResDto.LevelRank> levelRankList = new ArrayList<>();
        for (User u : userList) {
            RankResDto.LevelRank levelRank = RankResDto.LevelRank.builder()
                    .nickname(u.getNickname())
                    .level(u.getLevel())
                    .totalGame(u.getWin() + u.getLose())
                    .build();
            levelRankList.add(levelRank);
        }
        return levelRankList;
    }

    @Transactional(readOnly = true)
    public List<RankResDto.WinningRateRank> getWinningRateRank() {
        List<User> userList = userRepository.findTop10ByOrderByWinningRateDescWinDesc();
        if (userList == null || userList.size() == 0) {
            return null;
        }
        List<RankResDto.WinningRateRank> winningRateRankList = new ArrayList<>();
        for (User u : userList) {
            RankResDto.WinningRateRank winningRateRank = RankResDto.WinningRateRank.builder()
                    .nickname(u.getNickname())
                    .winningRate(String.format("%.2f", u.getWinningRate()))
                    .win(u.getWin())
                    .lose(u.getLose())
                    .build();
            winningRateRankList.add(winningRateRank);
        }
        return winningRateRankList;
    }

    @Transactional(readOnly = true)
    public List<RankResDto.DealRank> getDealRank() {
        LocalDateTime dayAgo = LocalDateTime.now().minusDays(1);
        List<Deal> dealList = dealRepository.findByFinalBidNotNullAndFinishedAtAfterOrderByFinalBidPrice(dayAgo);

        if (dealList == null || dealList.size() == 0) {
            return null;
        }

        int size = 10;
        if (dealList.size() < 10) {
            size = dealList.size();
        }

        List<RankResDto.DealRank> dealRankList = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            Deal deal = dealList.get(i);
            Art card = deal.getArt();
            Bid finalBid = deal.getFinalBid();
            RankResDto.DealRank dealRank = RankResDto.DealRank.builder()
                    .cardTitle(card.getTitle())
                    .cardImageURL(card.getUrl())
                    .designerNickname(card.getDesigner().getNickname())
                    .buyerNickname(finalBid.getBidder().getNickname())
                    .price(finalBid.getBidPrice())
                    .dealedAt(deal.getFinishedAt())
                    .build();
            dealRankList.add(dealRank);
        }
        return dealRankList;
    }
}
