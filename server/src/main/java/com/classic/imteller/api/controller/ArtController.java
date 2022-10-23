package com.classic.imteller.api.controller;

import com.classic.imteller.api.dto.ResponseDto;
import com.classic.imteller.api.dto.art.*;
import com.classic.imteller.api.repository.ArtRepository;
import com.classic.imteller.api.service.ArtService;
import com.classic.imteller.api.service.S3Service;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Api(value = "카드 API", tags = {"카드"})
@CrossOrigin("*")
@RequestMapping("/art")
@RestController
@RequiredArgsConstructor
public class ArtController {
    private final ArtService artService;
    private final ArtRepository artRepository;
    private final S3Service s3Service;

    @PostMapping("/cards")
    @ApiOperation(value = "해당 유저 NFT 카드 목록", notes = "해당 유저가 가진 모든 NFT 카드 목록을 가져온다")
    public ResponseEntity<ResponseDto> getCards(@RequestBody CardsReqDto cardsReqDto) {
        List<CardsResDto> data = artService.getCards(cardsReqDto.getNickname());
        return new ResponseEntity<>(new ResponseDto(data), HttpStatus.ACCEPTED);
    }

    @PostMapping("/paints")
    @ApiOperation(value = "내 그림 목록", notes = "내가 가진 모든 그림 목록을 가져온다")
    // NFT 카드에서 사용한 ReqDto를 재활용
    public ResponseEntity<ResponseDto> getPaints(@RequestBody CardsReqDto cardsReqDto) {
        List<PaintsResDto> data = artService.getPaints(cardsReqDto.getNickname());
        return new ResponseEntity<>(new ResponseDto(data), HttpStatus.ACCEPTED);
    }

    // form 데이터 처리 필요
    @PostMapping("/paints/save")
    @ApiOperation(value = "내 그림 새로 저장", notes = "내가 그린 그림을 저장한다")
    public ResponseEntity<ResponseDto> savePaint(@RequestPart(value="saveInfo") PaintSaveReqDto paintSaveReqDto, @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {
        String msg = artService.savePaint(paintSaveReqDto, file);
        if (msg == "그림 업로드 성공") return new ResponseEntity<>(new ResponseDto("저장 성공"), HttpStatus.ACCEPTED);
        else return new ResponseEntity<>(new ResponseDto("저장 실패"), HttpStatus.ACCEPTED);
    }

    // form 데이터 처리 필요
    @PatchMapping("/paints/edit")
    @ApiOperation(value = "내 그림 수정", notes = "해당하는 내 그림을 수정한다")
    public ResponseEntity<ResponseDto> editPaint(@RequestPart(value="editInfo") PaintEditReqDto paintEditReqDto, @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {
        String msg = artService.editPaint(paintEditReqDto, file);
        if (msg == "그림 수정 성공") return new ResponseEntity<>(new ResponseDto("수정 성공"), HttpStatus.ACCEPTED);
        else return new ResponseEntity<>(new ResponseDto("수정 실패"), HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/paints/delete/{id}")
    @ApiOperation(value = "내 그림 삭제", notes = "해당하는 내 그림을 삭제한다")
    public ResponseEntity<ResponseDto> getPaints(@PathVariable Long id, @RequestHeader(value="Authorization") String email) {
        boolean chk = artService.deletePaint(id, email);
        if (chk) return new ResponseEntity<>(new ResponseDto("삭제 성공"), HttpStatus.ACCEPTED);
        else return new ResponseEntity<>(new ResponseDto("삭제 실패"), HttpStatus.FORBIDDEN);
    }

    @PatchMapping("/paints/onvote/{id}")
    @ApiOperation(value = "내 그림 투표 제출", notes = "내 그림을 투표에 올린다")
    public ResponseEntity<ResponseDto> onVote (@PathVariable Long id, @RequestHeader(value="Authorization") String email) {
        boolean chk = artService.onVote(id, email);
        if (chk) return new ResponseEntity<>(new ResponseDto("제출 성공"), HttpStatus.ACCEPTED);
        else return new ResponseEntity<>(new ResponseDto("제출 실패"), HttpStatus.FORBIDDEN);
    }

    @PatchMapping("/paints/offvote/{id}")
    @ApiOperation(value = "내 그림 투표 제출 해제", notes = "내 그림을 투표에서 내린다")
    public ResponseEntity<ResponseDto> offVote (@PathVariable Long id, @RequestHeader(value="Authorization") String email) {
        boolean chk = artService.offVote(id, email);
        if (chk) return new ResponseEntity<>(new ResponseDto("제출 해제 성공"), HttpStatus.ACCEPTED);
        else return new ResponseEntity<>(new ResponseDto("제출 해제 실패"), HttpStatus.FORBIDDEN);
    }

    @PatchMapping("/nft")
    @ApiOperation(value="토큰 아이디 저장", notes = "민팅에 성공한 후에 토큰 아이디를 저장한다.")
    public ResponseEntity<ResponseDto> saveTokenId(@RequestBody NftReqDto nftReqDto){
        artService.insertTokenId(nftReqDto.getArtId(), nftReqDto.getTokenId());
        artService.insertEffect(nftReqDto.getArtId());
        return new ResponseEntity<>(new ResponseDto("NFT tokenId 저장 성공"), HttpStatus.ACCEPTED);
    }

}
