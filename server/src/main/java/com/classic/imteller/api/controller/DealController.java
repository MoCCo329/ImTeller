package com.classic.imteller.api.controller;

import com.classic.imteller.api.dto.ResponseDto;
import com.classic.imteller.api.dto.deal.*;
import com.classic.imteller.api.service.ArtService;
import com.classic.imteller.api.service.DealService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Api(value = "거래 API", tags = {"거래"})
@RequestMapping("/deal")
@RestController
@RequiredArgsConstructor
public class DealController {

    private final DealService dealService;
    private final ArtService artService;

    @PostMapping("/register")
    @ApiOperation(value = "카드 거래 등록", notes = "판매할 카드 유효성 체크 및 거래 등록")
    public ResponseEntity<ResponseDto> registerDeal(@RequestBody RegisterDealReqDto requestDto) {
        Long newDealId = dealService.registerDeal(requestDto);
        return new ResponseEntity<>(new ResponseDto(newDealId), HttpStatus.CREATED);
    }

    @GetMapping("/search")
    @ApiOperation(value = "카드 거래 목록 검색", notes = "카드 목록 검색 - 쿼리 : keyword, target, sort, status")
    public ResponseEntity<ResponseDto> searchDeals(@RequestParam Map<String, String> filters) {
        String keyword = filters.get("keyword");
        int target = Integer.parseInt(filters.getOrDefault("target", "0"));     // 0 : 작품명, 1 : 제작자, 2 : 소유자(판매자)
        int sort = Integer.parseInt(filters.getOrDefault("sort", "0"));         // 0 : 등록최신순, 1 : 최고입찰가순, 2 : 최저입찰가순, 3 : 거래종료 빠른 순
        int status = Integer.parseInt(filters.getOrDefault("status", "0"));     // 0 : 전체, 1 : 경매진행중, 2 : 경매완료

        List<SearchDealResDto> responseDtoList = dealService.search(keyword, target, sort, status);
        return new ResponseEntity<>(new ResponseDto(responseDtoList), HttpStatus.OK);
    }

    @GetMapping("/{dealId}")
    @ApiOperation(value = "카드 상세 정보", notes = "거래, 카드, 거래 이력 정보")
    public ResponseEntity<ResponseDto> showDealDetail(@PathVariable Long dealId) {
        DealDetailResDto responseDto = dealService.showDealDetail(dealId);
        return new ResponseEntity<>(new ResponseDto(responseDto), HttpStatus.OK);
    }

    @DeleteMapping("/{dealId}")
    @ApiOperation(value = "카드 거래 취소", notes = "해당 거래에 대한 입찰이 없는 경우만 취소 가능")
    public ResponseEntity<ResponseDto> deleteDeal(@PathVariable Long dealId) {
        dealService.deleteDeal(dealId);
        return new ResponseEntity<>(new ResponseDto(), HttpStatus.OK);
    }

    @PostMapping("/{dealId}/bid")
    @ApiOperation(value = "카드 거래 입찰", notes = "현재 즉시 거래로만 동작")
    public ResponseEntity<ResponseDto> bidForDeal(@PathVariable Long dealId, @RequestBody BidReqDto requestDto) {
        Long bidId = dealService.bidForDeal(dealId, requestDto);
        return new ResponseEntity<>(new ResponseDto(bidId), HttpStatus.OK);
    }

    @PatchMapping("/{dealId}/complete")
    @ApiOperation(value = "카드 거래 완료", notes = "SmartContract에서 거래 완료 후 DB 거래 정보 업데이트")
    public ResponseEntity<ResponseDto> completeDeal(@PathVariable Long dealId, @RequestBody CompleteDealReqDto requestDto){
        Long completedDealId = dealService.completeDeal(dealId, requestDto);
        return new ResponseEntity<>(new ResponseDto(completedDealId), HttpStatus.OK);
    }

}
