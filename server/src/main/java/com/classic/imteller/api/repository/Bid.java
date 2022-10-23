package com.classic.imteller.api.repository;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Getter
@NoArgsConstructor
@Entity
public class Bid extends BaseEntity {

    @ManyToOne(optional = false)
    private User bidder;

    @ManyToOne(optional = false)
    private Deal deal;

    @Column(nullable = false)
    private Integer bidPrice;

    @Column(nullable = false)
    private Integer bidType;    // 0 : 구매입찰, 1 : 즉시구매

    @Builder
    public Bid(User bidder, Deal deal, Integer bidPrice, Integer bidType) {
        this.bidder = bidder;
        this.deal = deal;
        this.bidPrice = bidPrice;
        this.bidType = bidType;
    }
}
