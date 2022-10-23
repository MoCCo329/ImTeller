package com.classic.imteller.api.service;

import com.classic.imteller.api.dto.user.DetailResDto;
import com.classic.imteller.api.dto.user.EditReqDto;
import com.classic.imteller.api.dto.user.SignupReqDto;
import com.classic.imteller.api.dto.user.WalletReqDto;
import com.classic.imteller.api.repository.User;
import com.classic.imteller.api.repository.UserRepository;
import com.classic.imteller.exception.CustomException;
import com.classic.imteller.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final S3Service s3Service;
    private final PasswordEncoder encoder;

    // 이메일 체크
    @Transactional(readOnly = true)
    public Boolean checkEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    // 닉네임 체크
    @Transactional(readOnly = true)
    public Boolean checkNickname(String nickname) {
        return userRepository.existsByNickname(nickname);
    }

    // 비밀번호 체크
    @Transactional(readOnly = true)
    public Boolean checkPassword(String email, String password) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(ErrorCode.POSTS_NOT_FOUND));
        if (user == null || !encoder.matches(password, user.getPassword())) return false;
        return true;
    }

    // 회원가입
    @Transactional
    public Boolean signUp(SignupReqDto signupReqDto, String newPw) {
        User newUser = User.builder()
                .email(signupReqDto.getEmail())
                .password(encoder.encode(newPw))
                .nickname(signupReqDto.getNickname())
                .profile("https://imtellercard.s3.ap-northeast-2.amazonaws.com/null.png")
                .exp(0)
                .win(0)
                .lose(0)
                .wallet(null)
                .build();
        User result = userRepository.save(newUser);
        if (result != null) return true;
        else return false;
    }

    @Transactional(readOnly = true)
    public User findUser(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new CustomException(ErrorCode.POSTS_NOT_FOUND));
    }

    @Transactional
    public void setNewPw(String email, String newPw) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(ErrorCode.POSTS_NOT_FOUND));
        user.updatePassword(encoder.encode(newPw));
        userRepository.save(user);
    }

    // 수정을 위한 함수
    @Transactional
    public void modify(EditReqDto editReqDto) {
        User user = userRepository.findByEmail(editReqDto.getEmail()).orElseThrow(() -> new CustomException(ErrorCode.POSTS_NOT_FOUND));
        // 비밀번호 안넣은 케이스 설정
        if("".equals(editReqDto.getPassword()) == false && user.getPassword() != null) {
            String password = editReqDto.getPassword();
            editReqDto.updatePassword(encoder.encode(password));
        }
        else {
            editReqDto.updatePassword(encoder.encode(user.getPassword()));
        }
        user.updateUser(editReqDto);
        userRepository.save(user);
    }

    @Transactional
    public String editInfo(EditReqDto editReqDto, MultipartFile file) {
        try {
            if (file != null) {
                if (file.getSize() >= 10485760) {
                    return "이미지 크기 제한은 10MB 입니다.";
                }
                String originFile = file.getOriginalFilename();
                String originFileExtension = originFile.substring(originFile.lastIndexOf("."));
                if (!originFileExtension.equalsIgnoreCase(".jpg") && !originFileExtension.equalsIgnoreCase(".png")
                        && !originFileExtension.equalsIgnoreCase(".jpeg")) {
                    return "jpg, jpeg, png의 이미지 파일만 업로드해주세요";
                }
                User user = userRepository.findByEmail(editReqDto.getEmail()).orElseThrow(() -> new CustomException(ErrorCode.POSTS_NOT_FOUND));
                String imgPath = s3Service.upload(user.getProfile(), file);
                editReqDto.updateProfile("https://imtellercard.s3.ap-northeast-2.amazonaws.com/" + imgPath);
                this.modify(editReqDto);
            } else if(editReqDto.getProfile().equals("reset")) {
                User user = userRepository.findByEmail(editReqDto.getEmail()).orElseThrow(() -> new CustomException(ErrorCode.POSTS_NOT_FOUND));
                //이미지 있으면 s3 버킷에서 지움
                s3Service.delete(user.getProfile());

                //이미지 컬럼 null로 변경
                editReqDto.updateProfile("https://imtellercard.s3.ap-northeast-2.amazonaws.com/null.png");
                this.modify(editReqDto);
            } else {
                this.modify(editReqDto);
            }
            return "유저 정보수정 성공";
        } catch (Exception e){
            e.printStackTrace();
            return "에러가 발생했습니다.";
        }
    }

    @Transactional
    public void setWallet(String email, String wallet) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new CustomException(ErrorCode.POSTS_NOT_FOUND));
        user.updateWallet(wallet);
        userRepository.save(user);
    }

    @Transactional
    public DetailResDto getDetail(String nickname) {
        User user = userRepository.findByNickname(nickname).orElseThrow(() -> new CustomException(ErrorCode.POSTS_NOT_FOUND));
        return DetailResDto.builder()
                .nickname(user.getNickname())
                .profile(user.getProfile())
                .exp(user.getExp())
                .win(user.getWin())
                .lose(user.getLose())
                .wallet(user.getWallet())
                .createdAt(user.getCreatedAt()).build();
    }
}