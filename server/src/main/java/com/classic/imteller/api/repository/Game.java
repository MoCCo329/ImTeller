package com.classic.imteller.api.repository;

import lombok.*;
import javax.persistence.*;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class Game extends BaseEntity {
    @Column
    private Long session;

    @Column
    private Boolean isOpen;

    // session이 0이되면 이미 없어진 방
    public void deleteSession() {
        this.session = 0L;
    }

    public void closedRoom() {this.isOpen = false;}
}
