package com.classic.imteller.api.service;

import com.classic.imteller.api.dto.art.CardsResDto;
import com.classic.imteller.api.dto.art.PaintEditReqDto;
import com.classic.imteller.api.dto.art.PaintSaveReqDto;
import com.classic.imteller.api.dto.art.PaintsResDto;
import com.classic.imteller.api.repository.*;
import com.classic.imteller.exception.CustomException;
import com.classic.imteller.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ArtService {
    private final ArtRepository artRepository;
    private final UserRepository userRepository;
    private final VoteRepository voteRepository;
    private final EffectRepository effectRepository;
    private final S3Service s3Service;

    @Transactional(readOnly = true)
    public List<CardsResDto> getCards(String nickname) {
        List<Art> allCards = artRepository.findAllByNicknameAndIsNFT(nickname);
        List<CardsResDto> data = new ArrayList<>();

        // 하나씩 뒤져가면서 effect_id 카드효과에서 찾아서 넣기
        for(Art card : allCards) {
            CardsResDto singleCard = CardsResDto.builder()
                    .cardId(card.getId())
                    .cardTitle(card.getTitle())
                    .cardImageURL(card.getUrl())
                    .description(card.getDescription())
                    .tokenId(card.getTokenId())
                    .grade(card.getEffect().getGrade())
                    .effect(card.getEffect().getEffect())
                    .effectNum(card.getEffect().getEffectNum())
                    .createdDT(card.getEffect().getCreatedAt())
                    .recentPrice(card.getRecentPrice()).build();
            data.add(singleCard);
        }
        return data;
    }

    @Transactional(readOnly = true)
    public List<PaintsResDto> getPaints(String nickname) {
        List<Art> allPaints = artRepository.findAllByNicknameAndIsPaint(nickname);
        List<PaintsResDto> data = new ArrayList<>();

        // 하나씩 뒤져가면서 effect_id 카드효과에서 찾아서 넣기
        for(Art card : allPaints) {
            PaintsResDto singlePaint = PaintsResDto.builder()
                    .paintId(card.getId())
                    .paintTitle(card.getTitle())
                    .paintImageURL(card.getUrl())
                    .isVote(card.getIsVote())
                    .content(card.getDescription()).build();
            data.add(singlePaint);
        }
        return data;
    }

    @Transactional
    public String savePaint(PaintSaveReqDto paintSaveReqDto, MultipartFile file) {
        try {
            String originFile = file.getOriginalFilename();
            String originFileExtension = originFile.substring(originFile.lastIndexOf("."));
            if (!originFileExtension.equalsIgnoreCase(".jpg") && !originFileExtension.equalsIgnoreCase(".png")
                    && !originFileExtension.equalsIgnoreCase(".jpeg")) {
                return "jpg, jpeg, png의 이미지 파일만 업로드해주세요";
            }

            User user = userRepository.findByEmail(paintSaveReqDto.getEmail()).orElseThrow(() -> new CustomException(ErrorCode.POSTS_NOT_FOUND));
            String imgPath = s3Service.upload("", file);

            Art art = Art.builder()
                    .designer(user)
                    .owner(user)
                    .ownerNickname(user.getNickname())
                    .url("https://imtellercard.s3.ap-northeast-2.amazonaws.com/" + imgPath)
                    .isVote(0)
                    .title(paintSaveReqDto.getPaintTitle())
                    .description(paintSaveReqDto.getDescription()).build();
            artRepository.save(art);
            return "그림 업로드 성공";
        } catch (Exception e){
            e.printStackTrace();
            return "에러가 발생했습니다.";
        }

    }

    @Transactional
    public String editPaint(PaintEditReqDto paintEditReqDto, MultipartFile file) {
        try {
            String originFile = file.getOriginalFilename();
            String originFileExtension = originFile.substring(originFile.lastIndexOf("."));
            if (!originFileExtension.equalsIgnoreCase(".jpg") && !originFileExtension.equalsIgnoreCase(".png")
                    && !originFileExtension.equalsIgnoreCase(".jpeg")) {
                return "jpg, jpeg, png의 이미지 파일만 업로드해주세요";
            }

            Art art = artRepository.findById(paintEditReqDto.getPaintId()).orElseThrow(() -> new CustomException(ErrorCode.POSTS_NOT_FOUND));
            String imgPath = s3Service.upload(art.getUrl(), file);
            art.updatePaint("https://imtellercard.s3.ap-northeast-2.amazonaws.com/" + imgPath, paintEditReqDto.getPaintTitle(), paintEditReqDto.getDescription());
            artRepository.save(art);
            return "그림 수정 성공";
        } catch (Exception e){
            e.printStackTrace();
            return "에러가 발생했습니다.";
        }
    }

    @Transactional
    public boolean deletePaint(Long id, String email) {
        Art art = artRepository.findById(id).orElseThrow(() -> new CustomException(ErrorCode.POSTS_NOT_FOUND));
        if (art.getOwner().getEmail().equals(email)) {
            artRepository.deleteById(id);
            return true;
        }
        else return false;
    }

    @Transactional
    public boolean onVote(Long id, String email) {
        Art art = artRepository.findById(id).orElseThrow(() -> new CustomException(ErrorCode.POSTS_NOT_FOUND));
        boolean chk = voteRepository.existsByArtIdAndIsVoting(art.getId(), 1);

        if (!chk && art.getOwner().getEmail().equals(email)) {
            art.updateIsVote(1);
            artRepository.save(art);
            Vote vote = Vote.builder()
                .art(art)
                .count(0)
                .isVoting(1).build();
            voteRepository.save(vote);
            return true;
        }
        else return false;
    }

    @Transactional
    public boolean offVote(Long id, String email) {
        Art art = artRepository.findById(id).orElseThrow(() -> new CustomException(ErrorCode.POSTS_NOT_FOUND));
        boolean chk = voteRepository.existsByArtIdAndIsVoting(art.getId(), 1);
        if (chk && art.getOwner().getEmail().equals(email)) {
            art.updateIsVote(0);
            artRepository.save(art);
            Vote vote = voteRepository.findByArtIdAndIsVoting(art.getId(), 1).orElseThrow(() -> new CustomException(ErrorCode.POSTS_NOT_FOUND));
            vote.updateIsVoting(0);
            voteRepository.save(vote);
            return true;
        }
        else return false;
    }

    @Transactional
    public void insertTokenId(Long artId, Long tokenId) {
        Art art = artRepository.findById(artId).orElseThrow(() -> new CustomException(ErrorCode.POSTS_NOT_FOUND));
        art.insertNft(tokenId);
    }

    @Transactional
    public void insertEffect(Long artId) {
        Art art = artRepository.findById(artId).orElseThrow(() -> new CustomException(ErrorCode.POSTS_NOT_FOUND));
        // 등급뽑기
        String grade;
        int randomNum = (int)(Math.random() * 100);
        if (randomNum >= 0 && randomNum < 5) grade = "S";
        else if (randomNum >= 5 && randomNum < 35) grade = "A";
        else grade = "B";

        // 아이템 종류뽑기
        long randomId;
        int typeRandomNum = (int)(Math.random() * 100);
        if (grade.equals("S")) {
            if (typeRandomNum >= 0 && typeRandomNum < 30) randomId = 1;
            else if (typeRandomNum >= 30 && typeRandomNum < 60) randomId = 2;
            else if (typeRandomNum >= 60 && typeRandomNum < 75) randomId = 3;
            else randomId = 4;
        }
        else if (grade.equals("A")) {
            if (typeRandomNum >= 0 && typeRandomNum < 15) randomId = 5;
            else if (typeRandomNum >= 15 && typeRandomNum < 35) randomId = 6;
            else if (typeRandomNum >= 35 && typeRandomNum < 40) randomId = 7;
            else if (typeRandomNum >= 40 && typeRandomNum < 55) randomId = 8;
            else if (typeRandomNum >= 55 && typeRandomNum < 75) randomId = 9;
            else randomId = 10;
        }
        else {
            if (typeRandomNum >= 0 && typeRandomNum < 30) randomId = 11;
            else if (typeRandomNum >= 30 && typeRandomNum < 60) randomId = 12;
            else if (typeRandomNum >= 60 && typeRandomNum < 75) randomId = 13;
            else randomId = 14;
        }

        // Effect 테이블에서 추출해서 art에 넣고 저장
        Effect effect = effectRepository.findById(randomId).orElseThrow(() -> new CustomException(ErrorCode.POSTS_NOT_FOUND));
        art.updateEffect(effect);
        artRepository.save(art);
    }
}
