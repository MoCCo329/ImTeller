package com.classic.imteller.api.repository;

import lombok.*;
import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Effect extends BaseEntity {

    @Column(length=20)
    private String grade;

    @Column
    private Integer effect;

    @Column
    private Integer effectNum;
}
