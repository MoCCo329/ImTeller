package com.classic.imteller.api.controller;

import com.classic.imteller.api.dto.ResponseDto;
import com.classic.imteller.api.dto.game.GameRoomDto;
import com.classic.imteller.api.dto.game.GameRoomJoinReqDto;
import com.classic.imteller.api.dto.game.MakeReqDto;
import com.classic.imteller.api.repository.RoomRepository;
import com.classic.imteller.api.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import io.swagger.annotations.Api;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import io.swagger.annotations.ApiOperation;

import java.util.List;

@Api(value = "게임 API", tags = {"게임"})
@CrossOrigin("*")
@RequestMapping("/game")
@RestController
@RequiredArgsConstructor
public class GameController {
    private final GameService gameService;
    private final RoomRepository roomRepository;

    // 이메일 중복체크
    @GetMapping("/rooms")
    @ApiOperation(value = "게임방 리스트 받기", notes = "게임방 리스트 전체 반환")
    public ResponseEntity<ResponseDto> getRooms(){
        // 소켓 or Redis 자료들 전부 가져와서 던져주기
        List<GameRoomDto> gameRooms = gameService.getRoomsInfo();
        return new ResponseEntity<ResponseDto>(new ResponseDto(gameRooms), HttpStatus.OK);
    }

    @GetMapping("/rooms/{roomId}")
    @ApiOperation(value = "해당 게임방 정보 받기", notes = "해당 게임방의 정보를 JSON형태로 반환")
    public ResponseEntity<ResponseDto> getRoom(@PathVariable final long roomId){
        // 소켓 or Redis 에서 해당 roomId 정보 가져와서 던져주기
        GameRoomDto gameRoom = gameService.getRoomInfo(roomId);
        return new ResponseEntity<ResponseDto>(new ResponseDto(gameRoom), HttpStatus.OK);
    }

    @PostMapping("/rooms/{roomId}/join")
    @ApiOperation(value = "해당 게임방 접속", notes = "해당 게임의 방이름과 비밀번호로 접근")
    public ResponseEntity<ResponseDto> joinRoom(@PathVariable final long roomId, @RequestBody final GameRoomJoinReqDto gameRoomJoinReqDto){
        // 비밀번호 맞는지 여부를 파악하고 boolean값을 보냄
        boolean chk = gameService.pwCheck(roomId, gameRoomJoinReqDto);
        return new ResponseEntity<ResponseDto>(new ResponseDto(chk), HttpStatus.OK);
    }

    @PostMapping("/make")
    @ApiOperation(value = "게임방 생성", notes = "게임방을 생성하고 해당 내용을 DB에 저장")
    public ResponseEntity<ResponseDto> makeRoom(@RequestBody final MakeReqDto roomInfo){
        // 방 정보를 소켓과 인메모리에 저장
        // 생성된 roomId 반환
        long newRoomId = gameService.createRoom(roomInfo);

        return new ResponseEntity<ResponseDto>(new ResponseDto(newRoomId), HttpStatus.OK);
    }
}
