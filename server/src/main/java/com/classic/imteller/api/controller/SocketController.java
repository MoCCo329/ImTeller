package com.classic.imteller.api.controller;

import com.classic.imteller.api.dto.room.*;
import com.classic.imteller.api.repository.Room;
import com.classic.imteller.api.repository.RoomRepository;
import com.classic.imteller.api.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.*;

@RequiredArgsConstructor
@Controller
public class SocketController {
    private final RoomService roomService;
    private final SimpMessagingTemplate template; //특정 Broker로 메세지를 전달
    private final RoomRepository roomRepository;

    private final SimpMessageSendingOperations sendingOperations;

    // 입장 : 게임방에 입장
    // socketSessionId는 해당 클라이언트와 서버가 소켓연결이 될 때 그떄의 sessionId
    // sessionId는 stomp에서 생성한 방의 sessionId
    @MessageMapping("/room/{sessionId}/join")
    public void join(@Header("simpSessionId") String userSessionId, @DestinationVariable("sessionId") long sessionId, JoinReqDto joinReqDto) {
        Room room = roomService.joinRoom(userSessionId, sessionId, joinReqDto);
        sendingOperations.convertAndSend("/sub/room/" + sessionId + "/join", room);

        HashMap<String, Boolean> readyMap = roomService.getRoom(sessionId).getReady();
        sendingOperations.convertAndSend("/sub/room/" + sessionId + "/ready", readyMap);
    }

    // 퇴장 : 게임방에서 퇴장
    @MessageMapping("/room/{sessionId}/exit")
    public void exit(@DestinationVariable("sessionId") long sessionId, ExitReqDto exitReqDto) {
        Room room = roomService.exitRoom(sessionId, exitReqDto);

        // 텔러가 첫 페이즈에서 나간 경우
        // 진짜면 텔러 바꾸고 종료조건 확인
        if (roomService.getTurn(sessionId) == 1) {
            roomService.setNextTeller(sessionId);
            if (roomService.endCheck(sessionId)) {
                roomService.stopTimer(sessionId);
                end(sessionId);
            }
        }

        // 일반 유저가 혼자만 제출 안한 상태로 두 번째 페이즈에서 나간 경우
        // 해당 턴 종료조건 확인
        if (roomService.getTurn(sessionId) == 2) {
            if (roomService.checkStatus(sessionId)) {
                phase3(sessionId);
            }
        }

        // 일반 유저가 혼자만 선택 안한 상태로 세 번째 페이즈에서 나간 경우
        // 해당 턴 종료조건 확인
        if (roomService.getTurn(sessionId) == 3) {
            if (roomService.checkStatus(sessionId)) {
                phase4(sessionId);
            }
        }

        // 세명 미만으로 남은 경우 처리
        if (roomService.getRoom(sessionId).getPlayers().size() < 3) {
            roomService.stopTimer(sessionId);
            end(sessionId);
        }

        sendingOperations.convertAndSend("/sub/room/" + sessionId + "/exit", room);
    }

    // 준비 : 방장 제외한 유저들 게임 준비
    @MessageMapping("/room/{sessionId}/ready")
    public void ready(@DestinationVariable long sessionId, ReadyReqDto readyReqDto) {
        HashMap<String, Boolean> readyMap = roomService.ready(sessionId, readyReqDto);
        sendingOperations.convertAndSend("/sub/room/" + sessionId + "/ready", readyMap);
    }

    // 게임시작 : 방장만 게임시작
    @MessageMapping("/room/{sessionId}/start")
    public void start(@DestinationVariable long sessionId) {
        boolean isStart = roomService.start(sessionId);
        sendingOperations.convertAndSend("/sub/room/" + sessionId + "/start", isStart);
    }

    // 카드 선택 : 유저가 사용할 NFT 카드 선택 - 반환 X
    @MessageMapping("/room/{sessionId}/select")
    public void select(@DestinationVariable long sessionId, SelectReqDto selectReqDto) {
        HashMap<String, List<GameCardDto>> firstHands = roomService.selectCards(sessionId, selectReqDto);
        HashMap<String, List<ItemDto>> myItems = roomRepository.getRoom(sessionId).getItems();
        if(firstHands != null) {
            List<String> players = roomRepository.getRoom(sessionId).getPlayers();
            // 패를 나눠주고 나서 최초 텔러 설정 (players List의 맨 앞 유저)
            roomRepository.getRoom(sessionId).setTeller(players.get(0));
            for (String player : players) {
                String userSessionId = roomRepository.getRoom(sessionId).getUserSessionIds().get(player);
                template.convertAndSendToUser(userSessionId, "/room/" + sessionId + "/mycards", firstHands.get(player));
                // 아이템도 같이 받아오기
                System.out.println(myItems.get(player).size());
                template.convertAndSendToUser(userSessionId, "/room/" + sessionId + "/item", myItems.get(player));
            }
            sendingOperations.convertAndSend("/sub/room/" + sessionId + "/phase", "phase1");
            phase1(sessionId);
        }
    }

    // 게임 진행
    // 텔러 카드 제출 phase1
    public void phase1(long sessionId) {
        roomService.setPhase(sessionId, 1);
        roomService.resetTurn(sessionId);
        roomService.statusReset(sessionId);
        // 텔러 넘기기
        String teller = roomService.getRoom(sessionId).getTeller();
        sendingOperations.convertAndSend("/sub/room/" + sessionId + "/newteller", teller);
        TimerTask m_task = new TimerTask() {
            @Override
            public void run() {
                // 여기서 제출을 안한 경우 종료조건 확인 후에 끝내거나, 끝나지 않았다면 텔러를 다음 사람에게 넘김
                if (roomService.endCheck(sessionId)) end(sessionId);
                else {
                    roomService.setNextTeller(sessionId);
                    sendingOperations.convertAndSend("/sub/room/" + sessionId + "/phase", "phase1");
                    phase1(sessionId);
                }
            }
        };
        roomService.startTimer(sessionId, m_task);
    }

    // 텔러 카드선택 : 텔러가 선택한 카드와 텔러의 문장이 전달됨
    @MessageMapping("/room/{sessionId}/teller")
    public void teller(@DestinationVariable long sessionId, TellerDto tellerDto) {
        roomService.stopTimer(sessionId);
        System.out.println("텔러 카드:" + tellerDto.getCardId() + " " + tellerDto.getCardMsg());
        roomService.setPhase(sessionId, 2);
        // 텔러가 제출하면 status 변경
        roomService.saveTellerInfo(sessionId, tellerDto);

        // 텔러 정보 전달
        sendingOperations.convertAndSend("/sub/room/" + sessionId + "/teller", tellerDto.getCardMsg());
        System.out.println(tellerDto.getCardMsg());
        HashMap<String, Boolean> status = roomService.getUserStatus(sessionId);
        sendingOperations.convertAndSend("/sub/room/" + sessionId + "/status", status);
        sendingOperations.convertAndSend("/sub/room/" + sessionId + "/phase", "phase2");
        phase2(sessionId);
    }

    // 유저 카드 제출 phase2
    public void phase2(long sessionId) {
        roomService.setPhase(sessionId, 2);

        TimerTask m_task = new TimerTask() {
            @Override
            public void run() {
                // 시간 지나면 강제로 hand의 맨 앞 카드 제출
                roomService.forcedCard(sessionId);
                List<GameCardDto> gameCardList = roomService.getTable(sessionId);
                // 선택한 게임카드들 전송 (table에서 낸 사람, 그리고 누가 텔러인지 여부를 감춤)
                sendingOperations.convertAndSend("/sub/room/" + sessionId + "/table", gameCardList);
                // 다음페이즈로
                sendingOperations.convertAndSend("/sub/room/" + sessionId + "/phase", "phase3");
                phase3(sessionId);
            }
        };
        roomService.startTimer(sessionId, m_task);
    }

    // 유저 카드 제출 : 텔러를 제외한 유저들이 카드를 제출
    @MessageMapping("/room/{sessionId}/others")
    public void others(@DestinationVariable long sessionId, UserCardDto userCardDto) {
        // 제출한 카드 처리
        System.out.println("인식함");
        boolean chk = roomService.getUserCard(sessionId, userCardDto);

        // 유저들에게 제출 상태값 변경된거 전달
        HashMap<String, Boolean> status = roomService.getUserStatus(sessionId);
        sendingOperations.convertAndSend("/sub/room/" + sessionId + "/status", status);

        System.out.println("완료여부:" + chk);
        // 모두가 제출했는지 여부 확인
        if (chk) {
            roomService.stopTimer(sessionId);
            // 제출한 카드리스트 전송
            List<GameCardDto> gameCardList = roomService.getTable(sessionId);
            sendingOperations.convertAndSend("/sub/room/" + sessionId + "/table", gameCardList);
            // 다음페이즈로
            sendingOperations.convertAndSend("/sub/room/" + sessionId + "/phase", "phase3");
            phase3(sessionId);
        }
    }

    // 카드 선택 phase 3
    public void phase3(long sessionId) {
        roomService.setPhase(sessionId, 3);
        // 모든 플레이어의 상태값을 초기화 시킨다
        roomService.statusReset(sessionId);
        // 텔러의 상태값은 true로 변경함
        roomService.updateTellerStatus(sessionId);

        TimerTask m_task = new TimerTask() {
            @Override
            public void run() {
                roomService.randomSelect(sessionId);
                sendingOperations.convertAndSend("/sub/room/" + sessionId + "/phase", "phase4");
                phase4(sessionId);
            }
        };
        roomService.startTimer(sessionId, m_task);
    }

    // 유저 카드 선택 : 텔러를 제외한 유저들이 카드를 선택
    @MessageMapping("/room/{sessionId}/choice")
    public void choice(@DestinationVariable long sessionId, ChoiceCardDto choiceCardDto) {
        boolean chk = roomService.choice(sessionId, choiceCardDto);

        // 매번 선택할 때마다 누가 선택했는지 상태 List를 사용자에게 보내준다
        HashMap<String, Boolean> status = roomService.getUserStatus(sessionId);
        sendingOperations.convertAndSend("/sub/room/" + sessionId + "/status", status);
        // 모두가 제출했는지 여부 확인
        if (chk) {
            roomService.stopTimer(sessionId);
            sendingOperations.convertAndSend("/sub/room/" + sessionId + "/phase", "phase4");
            phase4(sessionId);
        }
    }

    public void phase4(long sessionId) {
        roomService.setPhase(sessionId, 4);

        // 이번 턴 유저의 점수를 result 소켓에 반환
        HashMap<String, Integer> nowScore = roomService.scoreCalc(sessionId);
        sendingOperations.convertAndSend("/sub/room/" + sessionId + "/result", nowScore);

        // 전체 합산 점수를 반환
        HashMap<String, Integer> totalScore = roomService.getTotalScore(sessionId);
        sendingOperations.convertAndSend("/sub/room/" + sessionId + "/totalresult", totalScore);

        // 플레이어들이 낸 카드를 담은 table 전송하기
        List<TableDto> table = roomService.getRoom(sessionId).getTable();
        sendingOperations.convertAndSend("/sub/room/" + sessionId + "/submitcards", table);

        // 어떤 플레이어가 어떤 카드를 선택했는지를 담은 choice 전송하기
        HashMap<String, Long> choice = roomService.getRoom(sessionId).getChoice();
        sendingOperations.convertAndSend("/sub/room/" + sessionId + "/choicecards", choice);

        // 카드 드로우 - phase4 종료시 카드가 6장 미만이면 다시 1장 채워주기
        roomService.oneCardDraw(sessionId);

        // 드로우된 카드상태를 각 유저에게 전달하기
        HashMap<String, List<GameCardDto>> newHands = roomService.getHand(sessionId);
        List<String> players = roomRepository.getRoom(sessionId).getPlayers();
        for (String player : players) {
            String userSessionId = roomRepository.getRoom(sessionId).getUserSessionIds().get(player);
            template.convertAndSendToUser(userSessionId, "/room/" + sessionId + "/mycards", newHands.get(player));
        }

        // table에 있는 카드들을 덱의 맨 뒤로 돌리기
        roomService.tableToDeck(sessionId);

        TimerTask m_task = new TimerTask() {
            @Override
            public void run() {
                roomService.statusReset(sessionId);
                HashMap<String, Boolean> status = roomService.getUserStatus(sessionId);
                // 텔러 다음으로 옮기기
                roomService.setNextTeller(sessionId);
                // 게임 종료조건 확인
                if (roomService.endCheck(sessionId)) {
                    roomService.stopTimer(sessionId);
                    end(sessionId);
                } else {
                    sendingOperations.convertAndSend("/sub/room/" + sessionId + "/status", status);
                    sendingOperations.convertAndSend("/sub/room/" + sessionId + "/phase", "phase1");
                    phase1(sessionId);
                }
            }
        };
        roomService.startTimer(sessionId, m_task);
    }

    // 아이템 사용 : 아이템의 사용을 서버에 알림
    @MessageMapping("/room/{sessionId}/item")
    public void item(@DestinationVariable long sessionId, UseItemDto useItemDto) {
        int itemNum = roomService.useItem(sessionId, useItemDto);

        // 드로우카드 썼다면 아이템 발동하고 그 사람에게 새로운 핸드 전달
        if (itemNum == 3) {
            roomService.itemOneCardDraw(sessionId, useItemDto.getNickname());
            List<GameCardDto> newHand = roomService.getHand(sessionId).get(useItemDto.getNickname());
            String userSessionId = roomRepository.getRoom(sessionId).getUserSessionIds().get(useItemDto.getNickname());
            template.convertAndSendToUser(userSessionId, "/room/" + sessionId + "/mycards", newHand);
        }

        List<EffectDto> activatedItems = roomService.getActivated(sessionId);
        // 누군가가 아이템을 사용했음을 모두에게 알림
        sendingOperations.convertAndSend("/sub/room/" + sessionId + "/item", activatedItems);
        // 아이템을 사용한 유저에게 자신의 아이템 상태를 다시 보내줌
        List<ItemDto> myItems= roomRepository.getMyItems(sessionId, useItemDto.getNickname());
        String userSessionId = roomRepository.getRoom(sessionId).getUserSessionIds().get(useItemDto.getNickname());
        template.convertAndSendToUser(userSessionId, "/room/" + sessionId + "/item", myItems);
    }

    // 끝 : 게임이 끝나고 최종 우승자를 선정
    public void end(@DestinationVariable long sessionId) {

        // end시 player가 3명 이상일 때만 DB반영
        // DB에 점수 반영
        if (roomService.getRoom(sessionId).getPlayers().size() >= 3) {
            roomService.updateExp(sessionId);

            // 3명 이상일 때만 승패 반영
            roomService.updateWinOrLose(sessionId);
        }

        // 각종 변수들 초기화
        roomService.gameEnd(sessionId);

        // 10초 뒤에 방 상태를 false로 바꾸기
        roomService.startedToFalse(sessionId);

        // 끝났음을 알림
        sendingOperations.convertAndSend("/sub/room/" + sessionId + "/phase", "end");
    }

    // 채팅 : 채팅 보내기
    @MessageMapping("/room/{sessionId}/chat")
    public void chat(@DestinationVariable long sessionId, MsgDto msgDto) {
        sendingOperations.convertAndSend("/sub/room/" + sessionId + "/chat", msgDto);
    }

    // 모든 정보 : 방 내 모든 정보를 전달
    @MessageMapping("/room/{sessionId}/roominfo")
    public void getRoom(@DestinationVariable long sessionId) {
        Room room = roomService.getRoom(sessionId);
        sendingOperations.convertAndSend("/sub/room/" + sessionId + "/roominfo", room);
    }

}
