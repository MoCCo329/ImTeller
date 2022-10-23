package com.classic.imteller.api.controller;

import com.classic.imteller.api.dto.ResponseDto;
import com.classic.imteller.api.dto.vote.ElectReqDto;
import com.classic.imteller.api.dto.art.VoteReqDto;
import com.classic.imteller.api.dto.vote.VoteResDto;
import com.classic.imteller.api.repository.Art;
import com.classic.imteller.api.service.VoteService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Api(value = "투표 API", tags = {"투표"})
@CrossOrigin("*")
@RequestMapping("/vote")
@RestController
@RequiredArgsConstructor
public class VoteController {
    private final VoteService voteService;

    @GetMapping(path = "/paints")
    @ApiOperation(value = "투표리스트 반환", notes = "현재 투표중인 모든 그림을 전달받는 API")
    // detailResDto 재활용
    public ResponseEntity<ResponseDto> allOnVotePaints(@RequestHeader(value="Authorization") String email) {
        List<VoteResDto> Paints = new ArrayList<>();
        if(email.equals("guest")){
            Paints = voteService.getVoteList();
        }else{
            Paints = voteService.getVotePaints(email);
        }
        return new ResponseEntity<ResponseDto>(new ResponseDto(Paints), HttpStatus.ACCEPTED);
    }

    @GetMapping("/paints/onvote")
    @ApiOperation(value = "내 투표중인 그림 반환", notes = "내 그림 중에 현재 투표중인 그림을 전달받는 API")
    // detailResDto 재활용
    public ResponseEntity<ResponseDto> myOnVotePaints(@RequestHeader(value = "Authorization") String email) {
        List<Art> myPaints = voteService.getMyVotePaint(email);
        return new ResponseEntity<ResponseDto>(new ResponseDto(myPaints), HttpStatus.ACCEPTED);
    }

    @PostMapping("/paints/elect")
    @ApiOperation(value = "그림 당선처리", notes = "당선된 그림의 nft화 대기를 위해 체크해놓는 API")
    // detailResDto 재활용
    public ResponseEntity<ResponseDto> electedPaint(@RequestBody ElectReqDto electReqDto) {
        voteService.electedPaint(electReqDto.getArtId());
        return new ResponseEntity<ResponseDto>(new ResponseDto("민팅 대기 완료"), HttpStatus.ACCEPTED);
    }

    @PostMapping("/like")
    @ApiOperation(value = "그림 좋아요", notes = "그림에 좋아요를 전송하는 API")
    public ResponseEntity<ResponseDto> votePaint(@RequestBody VoteReqDto voteReqDto){
        String result = voteService.votePaint(voteReqDto.getUserNickname(), voteReqDto.getArtId());
        return new ResponseEntity<ResponseDto>(new ResponseDto(result), HttpStatus.ACCEPTED);
    }
}
