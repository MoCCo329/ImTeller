package com.classic.imteller.api.repository;

import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class Art extends BaseEntity {

    @OneToOne
    @JoinColumn(name="effect_id")
    @OnDelete(action= OnDeleteAction.CASCADE)
    private Effect effect;

    @ManyToOne
    @JoinColumn(name="designer_id", nullable = false)
    @OnDelete(action= OnDeleteAction.CASCADE)
    private User designer;

    @ManyToOne
    @JoinColumn(name="owner_id", nullable = false)
    @OnDelete(action= OnDeleteAction.CASCADE)
    private User owner;

    @Column(nullable = false, length=20)
    private String ownerNickname;

    @Column
    private Long tokenId;

    @Column(nullable = false, length=256)
    private String url;

    @Column(nullable = false)
    private Integer isVote;

    @Column(nullable = false, length=20)
    private String title;

    @Column(nullable = false, length=256)
    private String description;

    @Column
    private Integer recentPrice;

    @OneToMany(mappedBy = "art")
    private List<Deal> dealList = new ArrayList<>();

    public void updatePaint(String url, String title, String desc) {
        this.url = url;
        this.title = title;
        this.description = desc;
    }

    public void updateIsVote(Integer b) {
        this.isVote = b;
    }

    public void insertNft(Long tokenId){
        this.tokenId = tokenId;
    }

    public void changeOwner(User owner, String ownerNickname, Integer recentPrice){
        this.owner = owner;
        this.ownerNickname = ownerNickname;
        this.recentPrice = recentPrice;
    }

    public void updateEffect(Effect effect) {
        this.effect = effect;
    }
}
