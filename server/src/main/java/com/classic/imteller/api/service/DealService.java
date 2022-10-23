package com.classic.imteller.api.service;

import com.classic.imteller.api.dto.deal.*;
import com.classic.imteller.api.repository.*;
import com.classic.imteller.exception.CustomException;
import com.classic.imteller.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RequiredArgsConstructor
@Service
public class DealService {

    private final DealRepository dealRepository;
    private final ArtRepository artRepository;
    private final UserRepository userRepository;
    private final BidRepository bidRepository;

    @Transactional
    public Long registerDeal(RegisterDealReqDto requestDto) {
        Art art = artRepository.findById(requestDto.getArtId()).orElseThrow(() -> new CustomException(ErrorCode.BAD_REQUEST));
        if (art.getTokenId() == null) {
            throw new CustomException((ErrorCode.BAD_REQUEST));
        }

        LocalDateTime now = LocalDateTime.now();
        for (Deal d : art.getDealList()) {
            if (d.getFinishedAt().isAfter(now)) {
                throw new CustomException((ErrorCode.BAD_REQUEST));
            }
        }

        Deal newDeal = Deal.builder()
                .art(art)
                .seller(art.getOwner())
                .lowPrice(requestDto.getLowPrice())
                .instantPrice(requestDto.getInstantPrice())
                .tag(requestDto.getTag())
                .dealAddress(requestDto.getDealAddress())
                .finishedAt(requestDto.getFinishedAt())
                .build();

        return dealRepository.save(newDeal).getId();
    }

    @Transactional(readOnly = true)
    public List<SearchDealResDto> search(String keyword, int target, int sort, int status) {
        List<Deal> dealList = getDealList(keyword, target, status);
        List<SearchDealResDto> resDtoList = getResponseDtoList(dealList);
        sortList(sort, resDtoList);
        return resDtoList;
    }

    private void sortList(int sort, List<SearchDealResDto> resDtoList) {
        if (sort == 1) {
            Collections.sort(resDtoList, (o1, o2) -> {
                if (o1.getFinalBidPrice().equals(o2.getFinalBidPrice())) {
                    return Long.compare(o2.getDealId(), o1.getDealId());
                } else {
                    return Integer.compare(o2.getFinalBidPrice(), o1.getFinalBidPrice());
                }
            });
        } else if (sort == 2) {
            Collections.sort(resDtoList, (o1, o2) -> {
                if (o1.getFinalBidPrice().equals(o2.getFinalBidPrice())) {
                    return Long.compare(o2.getDealId(), o1.getDealId());
                } else {
                    return Integer.compare(o1.getFinalBidPrice(), o2.getFinalBidPrice());
                }
            });
        } else if (sort == 3) {
            Collections.sort(resDtoList, (o1, o2) -> {
                if (o1.getFinishedAt().equals(o2.getFinishedAt())) {
                    return Long.compare(o2.getDealId(), o1.getDealId());
                } else {
                    return o2.getFinishedAt().compareTo(o1.getFinishedAt());
                }
            });
        } else {
            Collections.sort(resDtoList, (o1, o2) -> Long.compare(o2.getDealId(), o1.getDealId()));
        }
    }

    private List<SearchDealResDto> getResponseDtoList(List<Deal> dealList) {
        List<SearchDealResDto> resDtoList = new ArrayList<>();
        for (Deal d : dealList) {
            Integer finalBidPrice = d.getLowPrice();
            if (d.getFinalBid() != null) {
                finalBidPrice = d.getFinalBid().getBidPrice();
            }
            Art card = d.getArt();
            SearchDealResDto resDto = SearchDealResDto.builder()
                    .dealId(d.getId())
                    .instantPrice(d.getInstantPrice())
                    .finalBidPrice(finalBidPrice)
                    .tag(d.getTag())
                    .finishedAt(d.getFinishedAt())
                    .cardId(card.getId())
                    .cardTitle(card.getTitle())
                    .cardImageUrl(card.getUrl())
                    .designerId(card.getDesigner().getId())
                    .designerNickname(card.getDesigner().getNickname())
                    .grade(card.getEffect().getGrade())
                    .effect(card.getEffect().getEffect())
                    .build();
            resDtoList.add(resDto);
        }
        return resDtoList;
    }

    private List<Deal> getDealList(String keyword, int target, int status) {
        List<Deal> dealList = null;
        if (keyword == null) {
            if (status == 1) {
                dealList = dealRepository.findByFinishedAtAfter(LocalDateTime.now());
            } else if (status == 2) {
                dealList = dealRepository.findByFinishedAtBefore(LocalDateTime.now());
            } else {
                dealList = dealRepository.findAll();
            }
        } else {
            if (target == 1) {   // 제작자
                if (status == 1) {
                    dealList = dealRepository.searchByCardDesignerLikeAndFinishedAtAfter(keyword, LocalDateTime.now());
                } else if (status == 2) {
                    dealList = dealRepository.searchByCardDesignerLikeAndFinishedAtBefore(keyword, LocalDateTime.now());
                } else {
                    dealList = dealRepository.searchByCardDesignerLike(keyword);
                }
            } else if (target == 2) {   // 소유자(판매자)
                if (status == 1) {
                    dealList = dealRepository.searchByCardOwnerLikeAndFinishedAtAfter(keyword, LocalDateTime.now());
                } else if (status == 2) {
                    dealList = dealRepository.searchByCardOwnerLikeAndFinishedAtBefore(keyword, LocalDateTime.now());
                } else {
                    dealList = dealRepository.searchByCardOwnerLike(keyword);
                }
            } else {  // 작품명
                if (status == 1) {
                    dealList = dealRepository.searchByCardTitleLikeAndFinishedAtAfter(keyword, LocalDateTime.now());
                } else if (status == 2) {
                    dealList = dealRepository.searchByCardTitleLikeAndFinishedAtBefore(keyword, LocalDateTime.now());
                } else {
                    dealList = dealRepository.searchByCardTitleLike(keyword);
                }
            }
        }
        return dealList;
    }

    @Transactional(readOnly = true)
    public DealDetailResDto showDealDetail(Long dealId) {
        Deal deal = dealRepository.findById(dealId).orElseThrow(() -> new CustomException(ErrorCode.BAD_REQUEST));
        Integer finalBidPrice = deal.getLowPrice();
        if (deal.getFinalBid() != null) {
            finalBidPrice = deal.getFinalBid().getBidPrice();
        }
        DealDetailResDto.DealInfo dealInfo = DealDetailResDto.DealInfo.builder()
                .dealId(deal.getId())
                .instantPrice(deal.getInstantPrice())
                .finalBidPrice(finalBidPrice)
                .dealAddress(deal.getDealAddress())
                .tag(deal.getTag())
                .finishedAt(deal.getFinishedAt())
                .build();

        Art card = deal.getArt();
        DealDetailResDto.CardInfo cardInfo = DealDetailResDto.CardInfo.builder()
                .cardId(card.getId())
                .cardTitle(card.getTitle())
                .cardImageURL(card.getUrl())
                .description(card.getDescription())
                .tokenId(card.getTokenId())
                .designerId(card.getDesigner().getId())
                .designerNickname(card.getDesigner().getNickname())
                .ownerId(deal.getSeller().getId())
                .ownerNickname(deal.getSeller().getNickname())
                .grade(card.getEffect().getGrade())
                .effect(card.getEffect().getEffect())
                .effectNum(card.getEffect().getEffectNum())
                .createdAt(card.getCreatedAt())
                .build();

        List<Deal> dealList = card.getDealList();
        List<DealDetailResDto.DealHistory> dealHistoryList = new ArrayList<>();
        for (Deal d : dealList) {
            if (d.getId() == dealId || d.getFinalBid() == null) {
                continue;
            }
            User seller = d.getSeller();
            User buyer = d.getFinalBid().getBidder();
            LocalDateTime dealedAt = d.getFinishedAt();
            if (d.getFinalBid().getBidType() == 1) {
                dealedAt = d.getFinalBid().getCreatedAt();
            }
            DealDetailResDto.DealHistory dealHistory = DealDetailResDto.DealHistory.builder()
                    .sellerId(seller.getId())
                    .sellerNickname(seller.getNickname())
                    .buyerId(buyer.getId())
                    .buyerNickname(buyer.getNickname())
                    .price(d.getFinalBid().getBidPrice())
                    .dealedAt(dealedAt)
                    .build();
            dealHistoryList.add(dealHistory);
        }

        return new DealDetailResDto(dealInfo, cardInfo, dealHistoryList);
    }

    @Transactional
    public void deleteDeal(Long dealId) {
        Deal deal = dealRepository.findById(dealId).orElseThrow(() -> new CustomException(ErrorCode.BAD_REQUEST));
        if (deal.getBidList().size() > 0) {
            throw new CustomException(ErrorCode.BAD_REQUEST);
        }
        dealRepository.deleteById(dealId);
    }


    @Transactional
    public Long completeDeal(Long dealId, CompleteDealReqDto requestDto) {
        Deal deal = dealRepository.findById(dealId).orElseThrow(() -> new CustomException(ErrorCode.BAD_REQUEST));

        if (requestDto.getBidderNickname() == null || requestDto.getTokenId() == null) {
            deal.updateFinalBid(null);
            throw new CustomException(ErrorCode.BAD_REQUEST);
        }

        Bid finalBid = deal.getFinalBid();
        User bidder = userRepository.findByNickname(requestDto.getBidderNickname())
                .orElseThrow(() -> new CustomException(ErrorCode.BAD_REQUEST));
        Art card = artRepository.findByTokenId(requestDto.getTokenId())
                .orElseThrow(() -> new CustomException(ErrorCode.BAD_REQUEST));

        if (!finalBid.getBidder().getId().equals(bidder.getId())
                || !deal.getArt().getId().equals(card.getId())) {
            throw new CustomException(ErrorCode.BAD_REQUEST);
        }

        card.changeOwner(bidder, bidder.getNickname(), finalBid.getBidPrice());
        deal.updateFinishAt();

        return deal.getId();
    }

    @Transactional
    public Long bidForDeal(Long dealId, BidReqDto requestDto) {
        Deal deal = dealRepository.findById(dealId).orElseThrow(() -> new CustomException(ErrorCode.BAD_REQUEST));
        if (deal.getFinishedAt().isBefore(LocalDateTime.now())) {
            throw new CustomException(ErrorCode.BAD_REQUEST);
        }
        if (deal.getFinalBid() != null) {
            throw new CustomException(ErrorCode.BAD_REQUEST);
        }

        User bidder = userRepository.findByNickname(requestDto.getBidderNickname())
                .orElseThrow(() -> new CustomException(ErrorCode.BAD_REQUEST));

        Bid newBid = Bid.builder()
                .bidder(bidder)
                .deal(deal)
                .bidPrice(requestDto.getBidPrice())
                .bidType(requestDto.getBidType())
                .build();
        Bid savedBid = bidRepository.save(newBid);
        deal.updateFinalBid(savedBid);

        return savedBid.getId();
    }
}
