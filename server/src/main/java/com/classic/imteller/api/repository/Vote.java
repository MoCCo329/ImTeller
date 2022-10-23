package com.classic.imteller.api.repository;

import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class Vote extends BaseEntity {

    @ManyToOne
    @JoinColumn(name="art_id")
    @OnDelete(action= OnDeleteAction.CASCADE)
    private Art art;

    @Column(columnDefinition = "int default 0")
    private Integer count;

    @Column
    private Integer isVoting;

    public void updateIsVoting (Integer b) {
        this.isVoting = b;
    }

    public void updateCount(int a ){
        this.count += a;
    }
}