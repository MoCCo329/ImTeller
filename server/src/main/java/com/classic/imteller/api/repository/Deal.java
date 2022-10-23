package com.classic.imteller.api.repository;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@Entity
public class Deal extends BaseEntity {

    @ManyToOne(optional = false)
    private Art art;

    @ManyToOne(optional = false)
    private User seller;

    @Column(nullable = false)
    private Integer lowPrice;

    @Column(nullable = false)
    private Integer instantPrice;

    @Column
    private String tag;

    @OneToOne
    private Bid finalBid;

    @Column(nullable = false)
    private String dealAddress;

    @Column(nullable = false, columnDefinition = "DATETIME")
    private LocalDateTime finishedAt;

    @OneToMany(mappedBy = "deal")
    private List<Bid> bidList = new ArrayList<>();

    @Builder
    public Deal(Art art, User seller, Integer lowPrice, Integer instantPrice, String tag, Bid finalBid,
                String dealAddress, LocalDateTime finishedAt, List<Bid> bidList) {
        this.art = art;
        this.seller = seller;
        this.lowPrice = lowPrice;
        this.instantPrice = instantPrice;
        this.tag = tag;
        this.finalBid = finalBid;
        this.dealAddress = dealAddress;
        this.finishedAt = finishedAt;
        this.bidList = bidList;
    }

    public void updateFinalBid(Bid bid) {
        this.finalBid = bid;
    }

    public void updateFinishAt(){
        this.finishedAt = LocalDateTime.now();
    }

}
