package com.classic.imteller.api.repository;

import com.classic.imteller.api.controller.UserController;
import com.classic.imteller.api.dto.user.EditReqDto;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import javax.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class User extends BaseEntity {

    @Column(nullable = false, length=256)
    private String email;

    @JsonIgnore
    @Column(nullable = false, length=256)
    private String password;

    @Column(nullable = false, length=20)
    private String nickname;

    @Column(nullable = false, length=256)
    private String profile;

    @Column(columnDefinition = "int default 0")
    private int exp;

    @Column(columnDefinition = "INT DEFAULT 1")
    private Integer level;

    @Column(columnDefinition = "int default 0")
    private int win;

    @Column(columnDefinition = "int default 0")
    private int lose;

    @Column(columnDefinition = "DOUBLE DEFAULT 0")
    private Double winningRate;

    @JsonIgnore
    @Column(length=256)
    private String wallet;

    public void updatePassword(String password) {
        this.password = password;
    }

    public void updateWallet(String wallet) {
        this.wallet = wallet;
    }

    public void updateUser(EditReqDto editReqDto) {
        if ("".equals(editReqDto.getPassword()) == false && editReqDto.getPassword()!=null) {
            this.password = editReqDto.getPassword();
        }
        if ("".equals(editReqDto.getNickname()) == false && editReqDto.getNickname()!=null) {
            this.nickname = editReqDto.getNickname();
        }
        if ("".equals(editReqDto.getProfile()) == false && editReqDto.getProfile()!=null) {
            this.profile = editReqDto.getProfile();
        }
    }

    public void plusWin() {
        ++this.win;
        updateWinningRate();
    }

    public void plusLose() {
        ++this.lose;
        updateWinningRate();
    }

    public void updateExp(int score) {
        this.exp += score;
        updateLevel();
    }

    public void updateWinningRate() {
        this.winningRate = (double) this.win / (this.win + this.lose) * 100;
    }

    public void updateLevel() {
        this.level = this.exp / 50 + 1;
    }
}
