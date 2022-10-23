package com.classic.imteller.api.controller;

import com.classic.imteller.api.dto.ResponseDto;
import com.classic.imteller.api.dto.rank.RankResDto;
import com.classic.imteller.api.service.RankService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api(value = "랭킹 API", tags = {"랭킹"})
@RequiredArgsConstructor
@RequestMapping("/rank")
@RestController
public class RankController {

    private final RankService rankService;

    @GetMapping
    @ApiOperation(value = "랭킹 목록 조회", notes = "랭킹 목록 조회 - 24시간 내 거래 가격, 승률, 레벨, 투표 당선작")
    public ResponseEntity<ResponseDto> getRanking() {
        RankResDto responseDto = rankService.getRanking();
        return new ResponseEntity<>(new ResponseDto(responseDto), HttpStatus.OK);
    }
}
