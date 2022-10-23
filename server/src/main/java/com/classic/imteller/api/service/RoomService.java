package com.classic.imteller.api.service;

import com.classic.imteller.api.dto.room.*;
import com.classic.imteller.api.repository.Room;
import com.classic.imteller.api.repository.RoomRepository;
import com.classic.imteller.api.repository.UserRepository;
import com.classic.imteller.exception.CustomException;
import com.classic.imteller.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    @Transactional
    public Room joinRoom(String userSessionId, long sessionId, JoinReqDto joinReqDto) {
        // 게임이 시작되었다면 방에 들어갈 수 없어야 함
        if (roomRepository.getRoom(sessionId) == null) return null;
        if (roomRepository.getRoom(sessionId).getStarted()) return null;

        // 인원수가 초과됐어도 방에 들어갈 수 없어야 함
        if (roomRepository.getRoom(sessionId).getPlayers().size() >= roomRepository.getRoom(sessionId).getMaxNum()) return null;

        // 같은 닉네임을 가진 유저가 있어도 방에 들어갈 수 없어야 함
        List<String> players = roomRepository.getRoom(sessionId).getPlayers();
        if (players.contains(joinReqDto.getNickname())) return null;

        boolean isGood = roomRepository.joinRoom(userSessionId, sessionId, joinReqDto);
        if (isGood) {
            Room room = roomRepository.getRoom(sessionId);
            return room;
        }
        return null;
    }

    @Transactional
    public Room exitRoom(long sessionId, ExitReqDto exitReqDto) {
        String res = roomRepository.exitRoom(sessionId, exitReqDto);
        if (res == "ok"){
            Room room = roomRepository.getRoom(sessionId);
            return room;
        }
        return null;
    }

    @Transactional
    public HashMap<String, Boolean> ready(long sessionId, ReadyReqDto readyReqDto) {
        return roomRepository.ready(sessionId, readyReqDto);
    }

    @Transactional(readOnly = true)
    public Room getRoom(long sessionId) {
        return roomRepository.getRoom(sessionId);
    }

    @Transactional
    public boolean start(long sessionId) {
        Room room = roomRepository.getRoom(sessionId);
        if (room == null) return false;

        // 모두가 레디했는지 확인
        HashMap<String, Boolean> isReady = room.getReady();
        List<String> players = room.getPlayers();
        boolean chk = true;
        for (String player : players) {
            if(!isReady.get(player)) {
                chk = false;
                break;
            }
        }
        if (!chk) return false;

        // 3명 이상인지 확인
        if(players.size() < 3) return false;

        // 다 안걸리면 시작
        roomRepository.start(sessionId);
        return true;
    }

    @Transactional
    public HashMap<String, List<GameCardDto>> selectCards(long sessionId, SelectReqDto selectReqDto) {
        boolean chk = roomRepository.selectCards(sessionId, selectReqDto);
        // 모두가 내면 firstHands 반환
        if (chk && roomRepository.getRoom(sessionId).getCards().size() == roomRepository.getRoom(sessionId).getPlayers().size()) {
            HashMap<String, List<GameCardDto>> firstHands = roomRepository.draw(sessionId);
            return firstHands;
        }
        else return null;
    }

    @Transactional
    public List<GameCardDto> getTable(long sessionId) {
        List<TableDto> tables = roomRepository.getRoom(sessionId).getTable();
        // 테이블에서 GameCardDto정보만 제공
        List<GameCardDto> gameCardList = new ArrayList<>();
        for (TableDto table: tables) {
            GameCardDto gameCard = GameCardDto.builder()
                    .cardId(table.getCardId())
                    .cardUrl(table.getCardUrl()).build();
            gameCardList.add(gameCard);
        }
        // 한번 셔플
        Collections.shuffle(gameCardList);
        return gameCardList;
    }

    @Transactional
    public void setPhase (long sessionId, int phase){
        roomRepository.setPhase(sessionId, phase);
    }

    @Transactional
    public void startTimer (long sessionId, TimerTask task) {
        roomRepository.startTimer(sessionId, task);
    }

    @Transactional
    public void stopTimer (long sessionId) {
        roomRepository.stopTimer(sessionId);
    }

    @Transactional
    public void saveTellerInfo(long sessionId, TellerDto tellerDto){
        roomRepository.saveTellerInfo(sessionId, tellerDto);
    }

    @Transactional
    public boolean endCheck(long sessionId) {
        String endType = roomRepository.getRoom(sessionId).getType();
        List<String> players = roomRepository.getRoom(sessionId).getPlayers();

        // 나갔을 때 3명 미만이 되면 게임 종료 - 비정상종료
        if (players.size() < 3) return true;

        // 점수 및 lap 조건 - 정상종료
        if (endType.equals("score")) {
            HashMap<String, Integer> totalScore = roomRepository.getTotalScore(sessionId);
            for (String player : players) {
                if (totalScore.get(player) >= roomRepository.getTypeNum(sessionId)) {
                    return true;
                }
            }
            return false;
        } else {
            int laps = roomRepository.getRoom(sessionId).getLaps();
            int typeNum = roomRepository.getRoom(sessionId).getTypeNum();
            return (laps > typeNum);
        }
    }

    @Transactional
    public void setNextTeller(long sessionId) {
        roomRepository.setNextTeller(sessionId);
    }

    @Transactional
    public void forcedCard(long sessionId){
        roomRepository.forcedCard(sessionId);
    }

    @Transactional
    public boolean getUserCard(long sessionId, UserCardDto userCardDto){
        return roomRepository.getUserCard(sessionId, userCardDto);
    }

    @Transactional
    public HashMap<String, Boolean> getUserStatus(long sessionId) {
        return roomRepository.getUserStatus(sessionId);
    }

    @Transactional
    public boolean choice(long sessionId, ChoiceCardDto choiceCardDto) {
        return roomRepository.choice(sessionId, choiceCardDto);
    }

    @Transactional
    public void statusReset(long sessionId) {
        roomRepository.statusReset(sessionId);
    }

    @Transactional
    public void updateTellerStatus(long sessionId) {
        roomRepository.updateTellerStatus(sessionId);
    }

    @Transactional
    public void randomSelect(long sessionId) {
        roomRepository.randomSelect(sessionId);
    }

    @Transactional
    public HashMap<String, Integer> scoreCalc(long sessionId) {
        return roomRepository.scoreCalc(sessionId);
    }

    @Transactional
    public HashMap<String, Integer> getTotalScore(long sessionId) {
        return roomRepository.getTotalScore(sessionId);
    }

    @Transactional
    public void resetTurn(long sessionId) {
        roomRepository.resetTurn(sessionId);
    }

    @Transactional
    public int getTurn(long sessionId) {
        return roomRepository.getTurn(sessionId);
    }

    @Transactional
    public boolean checkStatus(long sessionId) {
        // 모든 status를 받아서 true인지 확인
        HashMap<String, Boolean> status = roomRepository.getUserStatus(sessionId);
        boolean chk = true;
        for (String player : status.keySet()) {
            if (status.get(player) == false) {
                chk = false;
                break;
            }
        }
        return chk;
    }

    @Transactional
    public void oneCardDraw(long sessionId) {
        roomRepository.oneCardDraw(sessionId);
    }

    @Transactional
    public void itemOneCardDraw(long sessionId, String nickname) {
        roomRepository.itemOneCardDraw(sessionId, nickname);
    }

    @Transactional
    public HashMap<String, List<GameCardDto>> getHand(long sessionId) {
        return roomRepository.getHand(sessionId);
    }

    @Transactional
    public int useItem (long sessionId, UseItemDto useItemDto) {
        return roomRepository.useItem(sessionId, useItemDto);
    }

    @Transactional
    public List<EffectDto> getActivated (long sessionId) {
        return roomRepository.getActivated(sessionId);
    }

    // 테이블에 있는 카드를 덱으로 이동
    @Transactional
    public void tableToDeck (long sessionId) {
        roomRepository.tableToDeck(sessionId);
    }

    // 변수 초기화
    @Transactional
    public void gameEnd(long sessionId) {
        roomRepository.gameEnd(sessionId);
    }

    @Transactional
    public void updateExp(long sessionId) {
        // DB에 경험치 반영 로직 - 이야기 더 해봐야함
        // roomRepository의 score를 받아서 적절하게 DB의 경험치(exp)에 반영해주면 된다
        roomRepository.updateExp(sessionId);
    }

    public void updateWinOrLose(long sessionId) {
        roomRepository.updateWinOrLose(sessionId);
    }

    @Transactional
    public List<ItemDto> getMyItems(long sessionId, String nickname) {
        return roomRepository.getMyItems(sessionId, nickname);
    }

    public void startedToFalse(long sessionId) {
        Timer timer = new Timer();
        TimerTask timerTask = new TimerTask() {
            @Override
            public void run() {
                roomRepository.getRoom(sessionId).setStarted(false);
            }
        };
        timer.schedule(timerTask, 10000);
    }

}
