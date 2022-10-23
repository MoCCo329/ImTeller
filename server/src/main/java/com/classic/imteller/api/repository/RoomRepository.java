package com.classic.imteller.api.repository;

import com.classic.imteller.api.dto.room.*;
import com.classic.imteller.exception.CustomException;
import com.classic.imteller.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.*;

@Repository
@RequiredArgsConstructor
public class RoomRepository {
    private static final HashMap<Long, Room> roomList = new HashMap<>();
    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final ArtRepository artRepository;

    public Room getRoom (Long sessionId) {
        Room room = roomList.get(sessionId);
        return room;
    }

    public HashMap<Long, Room> getRooms() {
        return roomList;
    }

    @Transactional
    public void createRoom (Room room) {
        try {
            roomList.put(room.getId(), room);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public boolean joinRoom (String userSessionId, long sessionId, JoinReqDto joinReqDto) {
        try {
            // 세션아이디 등록
            HashMap<String, String> usids = roomList.get(sessionId).getUserSessionIds();
            usids.put(joinReqDto.getNickname(), userSessionId);
            roomList.get(sessionId).setUserSessionIds(usids);

            // 접속자
            List<String> players = roomList.get(sessionId).getPlayers();
            players.add(joinReqDto.getNickname());
            roomList.get(sessionId).setPlayers(players);

            // 프로필사진
            HashMap<String, String> profiles = roomList.get(sessionId).getProfiles();
            User user = userRepository.findByNickname(joinReqDto.getNickname()).orElseThrow(() -> new CustomException(ErrorCode.POSTS_NOT_FOUND));
            profiles.put(joinReqDto.getNickname(), user.getProfile());
            System.out.println(profiles.get(joinReqDto.getNickname()));
            roomList.get(sessionId).setProfiles(profiles);

            // 레디 여부
            HashMap<String, Boolean> ready = roomList.get(sessionId).getReady();

            // 방장이면 항상 true
            if (roomList.get(sessionId).getLeader().equals(joinReqDto.getNickname())) {
                ready.put(joinReqDto.getNickname(), true);
            }
            else ready.put(joinReqDto.getNickname(), false);
            roomList.get(sessionId).setReady(ready);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Transactional
    public String exitRoom (long sessionId, ExitReqDto exitReqDto) {
        try {
            // 만약 1명뿐이라면 특수케이스
            if (roomList.get(sessionId).getPlayers().size() > 1) {
                // 나간사람이 방장이면 방장 바꾸기
                // 그게 아니면 바꿀 필요 없음
                String originalLeader = roomList.get(sessionId).getLeader();
                if (originalLeader.equals(exitReqDto.getNickname())) {
                    // 맨 앞에 있는 사람이 방장이니까 다음 사람으로 바꿈
                    String nextLeader = roomList.get(sessionId).getPlayers().get(1);
                    roomList.get(sessionId).setLeader(nextLeader);
                }
            }
            // players에서 없애기
            List<String> players = roomList.get(sessionId).getPlayers();
            players.remove(exitReqDto.getNickname());
            roomList.get(sessionId).setPlayers(players);
            // 만약 모든 플레이어가 다 나갔다면?
            if (players.size() == 0) {
                Game game = gameRepository.findBySessionAndIsOpen(sessionId, true).orElseThrow(() -> new CustomException(ErrorCode.POSTS_NOT_FOUND));
                game.closedRoom();
                game.deleteSession();
                gameRepository.save(game);
                // 게임소켓방에서도 나가기
                roomList.remove(sessionId);
                return "ok";
            }

            // profiles에서 없애기
            HashMap<String, String> newProfiles = roomList.get(sessionId).getProfiles();
            newProfiles.remove(exitReqDto.getNickname());
            roomList.get(sessionId).setProfiles(newProfiles);
            // ready에서 없애기
            HashMap<String, Boolean> newReady = roomList.get(sessionId).getReady();
            newReady.remove(exitReqDto.getNickname());
            // 나간사람이 방장이면 새로운 방장의 ready상태를 true로 변경
            newReady.replace(roomList.get(sessionId).getLeader(), true);
            roomList.get(sessionId).setReady(newReady);
            // userSessionId에서 없애기
            HashMap<String, String> usids = roomList.get(sessionId).getUserSessionIds();
            usids.remove(exitReqDto.getNickname());
            roomList.get(sessionId).setUserSessionIds(usids);

            // 밑 요소들은 게임중일 때 작동
            if (roomList.get(sessionId).getStarted()) {
                // cards에서 없애기
                HashMap<String, List<Long>> newCards = roomList.get(sessionId).getCards();
                newCards.remove(exitReqDto.getNickname());
                roomList.get(sessionId).setCards(newCards);
                // items에서 없애기
                HashMap<String, List<ItemDto>> newItems = roomList.get(sessionId).getItems();
                newItems.remove(exitReqDto.getNickname());
                roomList.get(sessionId).setItems(newItems);
                // score에서 없애기
                HashMap<String, Integer> newScore = roomList.get(sessionId).getScore();
                newScore.remove(exitReqDto.getNickname());
                roomList.get(sessionId).setScore(newScore);
                // hand에서 없애기
                HashMap<String, List<GameCardDto>> newHand = roomList.get(sessionId).getHand();
                newHand.remove(exitReqDto.getNickname());
                roomList.get(sessionId).setHand(newHand);
                // status에서 없애기
                HashMap<String, Boolean> newStatus = roomList.get(sessionId).getStatus();
                newStatus.remove(exitReqDto.getNickname());
                roomList.get(sessionId).setStatus(newStatus);
                // choice에서 없애기
                HashMap<String, Long> newChoice = roomList.get(sessionId).getChoice();
                newChoice.remove(exitReqDto.getNickname());
                roomList.get(sessionId).setChoice(newChoice);

                // 만약 게임 도중에 나가면 1패가 추가되도록 만들기

                User user = userRepository.findByNickname(exitReqDto.getNickname()).orElseThrow(() -> new CustomException(ErrorCode.POSTS_NOT_FOUND));
                user.plusLose();
                userRepository.save(user);
            }

            return "ok";
        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }
    }

    public HashMap<String, Boolean> ready (long sessionId, ReadyReqDto readyReqDto) {
        try {
            HashMap<String, Boolean> readyMap = roomList.get(sessionId).getReady();
            readyMap.replace(readyReqDto.getNickname(), readyReqDto.getIsReady());
            roomList.get(sessionId).setReady(readyMap);
            return roomList.get(sessionId).getReady();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public void start (long sessionId) {
        // 시작변수 변경
        roomList.get(sessionId).setStarted(true);

        // 최초 텔러는 방장
        String leader = roomList.get(sessionId).getLeader();
        roomList.get(sessionId).setTeller(leader);
    }

    public boolean selectCards (long sessionId, SelectReqDto selectReqDto) {
        try {
            // 유저가 제출한 카드 등록
            roomList.get(sessionId).getCards().put(selectReqDto.getNickname(), selectReqDto.getSelectedCard());
            roomList.get(sessionId).getNftDeck().addAll(selectReqDto.getSelectedCard());
            // 낸 유저 status에 등록하기
            roomList.get(sessionId).getStatus().put(selectReqDto.getNickname(), false);
            // 아이템 등록하기
            List<ItemDto> itemList = new ArrayList<>();
            for (Long artId : selectReqDto.getSelectedCard()) {
                Art art = artRepository.findById(artId).orElseThrow(() -> new CustomException(ErrorCode.POSTS_NOT_FOUND));
                ItemDto item = ItemDto.builder()
                        .cardId(art.getId())
                        .grade(art.getEffect().getGrade())
                        .effect(art.getEffect().getEffect())
                        .effectNum(art.getEffect().getEffectNum())
                        .isUsed(false).build();
                itemList.add(item);
            }
            roomList.get(sessionId).getItems().put(selectReqDto.getNickname(), itemList);

            // 점수 초기화
            roomList.get(sessionId).getScore().put(selectReqDto.getNickname(), 0);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 덱을 만들고 카드를 드로우하는 함수
    public HashMap<String, List<GameCardDto>> draw(long sessionId) {
        HashMap<String, List<GameCardDto>> basicHand = new HashMap<>();
        // 기본덱은 1부터 74
        List<Long> deck = new ArrayList<>();
        for (long i = 1; i <= 74; ++i) deck.add(i);

        // 새로 넣어야 하는 nft카드의 개수 추출하기
        int nftNum = roomList.get(sessionId).getNftDeck().size();
        // 랜덤으로 deck 요소 하나씩 빼는걸 nft카드의 개수만큼 반복
        for (int i = 0; i < nftNum; ++i) {
            double random = Math.random();
            int num = (int)Math.round(random * (deck.size() - 1));
            System.out.println(num);
            deck.remove(num);
        }
        // nft카드 넣기
        deck.addAll(roomList.get(sessionId).getNftDeck());

        // 셔플하기
        Collections.shuffle(deck);

        // 플레이어에게 6개씩 할당하기
        List<String> players = roomList.get(sessionId).getPlayers();

        for (int i = 0; i < players.size(); ++i) {
            List<GameCardDto> myHand = new ArrayList<>();
            for (int j = 0; j < 6; ++j) {
                Art art = artRepository.findById(deck.get(j)).orElseThrow(() -> new CustomException(ErrorCode.POSTS_NOT_FOUND));
                GameCardDto tmpCard = GameCardDto.builder()
                    .cardId(deck.get(j))
                    .cardUrl(art.getUrl()).build();
                myHand.add(tmpCard);
            }
            // 덱에서 사용한 카드 잘라내기
            deck = deck.subList(6, deck.size());
            basicHand.put(players.get(i), myHand);
        }

        roomList.get(sessionId).setDeck(deck);

        // 할당한 내용 hand변수에 반영하고 반환하기
        roomList.get(sessionId).setHand(basicHand);
        return basicHand;
    }

    public void resetTurn(long sessionId) {
        // 제출 카드, 선택 목록, 아이템 발동 내역 삭제
        roomList.get(sessionId).setTable(new ArrayList<TableDto>());
        roomList.get(sessionId).setChoice(new HashMap<String, Long>());
        roomList.get(sessionId).setActivated(new ArrayList<EffectDto>());
    }

    public void setPhase (long sessionId, int phase) {
        roomList.get(sessionId).setTurn(phase);
    }

    public void startTimer (long sessionId, TimerTask task) {
        // 혹시 모를 오류에 대비해 타이머 종료!
        roomList.get(sessionId).getTimer().cancel();
        // 새로운 타이머 초기화
        roomList.get(sessionId).setTimer(new Timer());

        int phase = roomList.get(sessionId).getTurn();
        int time;
        if (phase == 1 || phase == 2) time = 30;
        else if (phase == 3) {
            if (roomList.get(sessionId).getActivated().size() > 0) {
                int maxEffectNum = 0;
                for (EffectDto effect : roomList.get(sessionId).getActivated()) {
                    if (effect.getEffect() == 1 && maxEffectNum < effect.getEffectNum()) {
                        maxEffectNum = effect.getEffectNum();
                    }
                }
                time = 30 - maxEffectNum;
            } else time = 30;
        }
        else if (phase == 4) time = 10;
        else time = 0;

        roomList.get(sessionId).getTimer().schedule(task, time * 1000);
    }

    public void stopTimer (long sessionId) {
        System.out.println("1: " + roomList.get(sessionId).getTimer());
        roomList.get(sessionId).getTimer().cancel();
        System.out.println("2: " + roomList.get(sessionId).getTimer());
        roomList.get(sessionId).setTimer(new Timer());
        System.out.println("3: " + roomList.get(sessionId).getTimer());
    }

    public void saveTellerInfo (long sessionId, TellerDto tellerDto) {
        TableDto table = TableDto.builder()
                .nickname(tellerDto.getNickname())
                .cardId(tellerDto.getCardId())
                .cardUrl(tellerDto.getCardUrl())
                .isTeller(true).build();
        roomList.get(sessionId).getStatus().replace(tellerDto.getNickname(), true);
        // 텔러 손패에서 낸 카드 제거
        System.out.println("텔러 이름 : " + tellerDto.getNickname());
        List<GameCardDto> tellerHand = roomList.get(sessionId).getHand().get(tellerDto.getNickname());

        for (GameCardDto gameCard: tellerHand) {
            System.out.println("게임카드 : " + gameCard.getCardId());
            System.out.println("같은지 여부 : " + (gameCard.getCardId() == tellerDto.getCardId()));
            if (gameCard.getCardId() == tellerDto.getCardId()) {
                roomList.get(sessionId).getHand().get(tellerDto.getNickname()).remove(gameCard);
                break;
            }
        }
        System.out.println("저장될 카드 :" + table.getNickname() + table.getCardId());
        roomList.get(sessionId).getTable().add(table);
    }

    public void setNextTeller (long sessionId) {
        List<String> players = roomList.get(sessionId).getPlayers();
        String teller = roomList.get(sessionId).getTeller();
        if (players.indexOf(teller) == players.size() - 1) {
            int laps = roomList.get(sessionId).getLaps() + 1;
            roomList.get(sessionId).setLaps(laps);
            roomList.get(sessionId).setTeller(players.get(0));
        } else {
            int idx = players.indexOf(teller) + 1;
            roomList.get(sessionId).setTeller(players.get(idx));
        }
    }

    public void forcedCard (long sessionId) {
        List<String> players = roomList.get(sessionId).getPlayers();
        HashMap<String, Boolean> status = roomList.get(sessionId).getStatus();
        for (String player: players) {
            // 해당플레이어가 아직 제출하지 않았다면?
            if (!status.get(player)) {
                // 해당 플레이어의 첫 번째 hand카드를 강제로 추출
                GameCardDto gameCard = roomList.get(sessionId).getHand().get(player).get(0);
                // 손패에서 제거
                roomList.get(sessionId).getHand().get(player).remove(0);
                // 추출한 카드를 강제제출등록
                TableDto table = TableDto.builder()
                        .nickname(player)
                        .cardId(gameCard.getCardId())
                        .cardUrl(gameCard.getCardUrl())
                        .isTeller(false).build();
                roomList.get(sessionId).getTable().add(table);
            }
        }
    }

    public boolean getUserCard (long sessionId, UserCardDto userCardDto) {
        System.out.println("레포지토리들어옴");
        TableDto table = TableDto.builder()
                .nickname(userCardDto.getNickname())
                .cardId(userCardDto.getCardId())
                .cardUrl(userCardDto.getCardUrl())
                .isTeller(false).build();

        roomList.get(sessionId).getStatus().replace(userCardDto.getNickname(), true);
        List<GameCardDto> userHand = roomList.get(sessionId).getHand().get(userCardDto.getNickname());

        // 같은 nickname을 가진 table이 이미 존재한다면 add하지 않는다
        boolean nameChk = true;
        for (TableDto tmpTable : roomList.get(sessionId).getTable()) {
            if (tmpTable.getNickname().equals(userCardDto.getNickname())) {
                nameChk = false;
                break;
            }
        }

        if (nameChk) {
            // 텔러 손패에서 낸 카드 제거
            for (GameCardDto gameCard: userHand) {
                if (gameCard.getCardId() == userCardDto.getCardId()) {
                    roomList.get(sessionId).getHand().get(userCardDto.getNickname()).remove(gameCard);
                    break;
                }
            }
            roomList.get(sessionId).getTable().add(table);
        }

        System.out.println("손패에 있는지 : " + nameChk);

        // 모두가 제출했는지 확인하는 부분
        // 제출 카드 개수로 확인
        if (roomList.get(sessionId).getPlayers().size() <= roomList.get(sessionId).getTable().size()) return true;
        else return false;
    }

    public HashMap<String, Boolean> getUserStatus (long sessionId) {
        return roomList.get(sessionId).getStatus();
    }

    public boolean choice (long sessionId, ChoiceCardDto choiceCardDto) {
        // getChoice HashMap구조에 아이디와 닉네임 순으로 넣는다
        roomList.get(sessionId).getChoice().put(choiceCardDto.getNickname(), choiceCardDto.getCardId());
        // status 업데이트
        roomList.get(sessionId).getStatus().replace(choiceCardDto.getNickname(), true);

        // 모두가 제출했는지 확인하는 부분
        HashMap<String, Long> choices = roomList.get(sessionId).getChoice();
        List<String> players = roomList.get(sessionId).getPlayers();
        if (choices.size() == players.size() - 1) return true;
        else return false;
    }

    public void statusReset(long sessionId) {
        List<String> players = roomList.get(sessionId).getPlayers();
        HashMap<String, Boolean> resetStatus = new HashMap<>();
        for (String player : players) {
            resetStatus.put(player, false);
        }
        roomList.get(sessionId).setStatus(resetStatus);
    }

    public void updateTellerStatus(long sessionId) {
        String teller = roomList.get(sessionId).getTeller();
        roomList.get(sessionId).getStatus().replace(teller, true);
    }

    public void randomSelect(long sessionId) {
        List<String> players = roomList.get(sessionId).getPlayers();
        HashMap<String, Boolean> status = roomList.get(sessionId).getStatus();
        List<TableDto> table = roomList.get(sessionId).getTable();
        for (String player: players) {
            if (!status.get(player)) {
                // 랜덤한 인덱스 뽑아서
                int randomIdx = (int)(Math.random() * table.size());
                // DB에 박음
                roomList.get(sessionId).getChoice().put(player, table.get(randomIdx).getCardId());
            }
        }
    }

    public HashMap<String, Integer> scoreCalc(long sessionId) {
        // 이번 턴의 점수
        HashMap<String, Integer> scores = new HashMap<>();
        // 제출한 카드
        List<TableDto> tables = roomList.get(sessionId).getTable();
        // 일반 유저 선택
        HashMap<String, Long> choice = roomList.get(sessionId).getChoice();
        String teller = roomList.get(sessionId).getTeller();
        List<String> players = roomList.get(sessionId).getPlayers();

        // 해당 턴의 점수 HashMap인 scores를 초기화
        for (String player : players) {
            scores.put(player, 0);
        }

        // 점수계산
        int answerPlayer = 0;
        int normalPlayerNum = players.size() - 1;
        // 카드 주인에게 2점씩, 텔러꺼 골랐으면 6점
        for (String player : players) {
            // 텔러는 체크안함
            if (player.equals(teller)) continue;
            // 나머지케이스 체크
            for (TableDto table : tables) {
                if (choice.get(player) == table.getCardId()){
                    if (table.getNickname().equals(teller)) {
                        int newScore = scores.get(player) + 6;
                        scores.replace(player, newScore);
                        ++answerPlayer;
                    }
                    else {
                        int newScore = scores.get(table.getNickname()) + 2;
                        scores.replace(table.getNickname(), newScore);
                    }
                    break;
                }
            }
        }
        // 텔러는 특별계산 - 모두가 못맞추거나 다맞추면 텔러는 0점, 나머지 케이스에서 텔러는 6점
        if (answerPlayer == normalPlayerNum || answerPlayer == 0)  {
            scores.replace(teller, 0);
            // 나머지 모든사람들에게 추가 4점
            for (String player : players) {
                if (!player.equals(teller)) {
                    int newScore = scores.get(player) + 4;
                    scores.replace(player, newScore);
                }
            }
        }  else {
            scores.replace(teller, 6);
        }

        // 아이템처리
        List<EffectDto> activatedItem = roomList.get(sessionId).getActivated();
        for (EffectDto item : activatedItem) {
            // 개인 점수 추가 아이템을 썼고, 그 사람이 점수를 얻었다면? + 점수
            if (item.getEffect() == 4 && scores.get(item.getNickname()) != 0) {
                int newScore = scores.get(item.getNickname()) + item.getEffectNum();
                scores.replace(item.getNickname(), newScore);
            }
            // 전체 추가점수 만들기
            if (item.getEffect() == 5) {
                for (String player : players) {
                    int newScore = scores.get(player) * item.getEffectNum() / 100;
                    scores.replace(player, newScore);
                }
            }
        }

        // DB에 이번턴 scores 반영
        for (String player : players) {
            int newScore = roomList.get(sessionId).getScore().get(player) + scores.get(player);
            roomList.get(sessionId).getScore().replace(player, newScore);
        }

        return scores;
    }

    public HashMap<String, Integer> getTotalScore(long sessionId) {
        return roomList.get(sessionId).getScore();
    }

    public int getTypeNum(long sessionId) {
        return roomList.get(sessionId).getTypeNum();
    }

    public int getTurn(long sessionId) {
        return roomList.get(sessionId).getTurn();
    }

    public void oneCardDraw(long sessionId) {
        HashMap<String, List<GameCardDto>> hands = roomList.get(sessionId).getHand();
        for (String player : hands.keySet()) {
            if (hands.get(player).size() < 6) {
                roomList.get(sessionId).getHand();
                // 덱에서 맨 앞에꺼 빼오기
                Long newCardId = roomList.get(sessionId).getDeck().remove(0);
                Art art = artRepository.findById(newCardId).orElseThrow(() -> new CustomException(ErrorCode.POSTS_NOT_FOUND));
                GameCardDto tmpCard = GameCardDto.builder()
                        .cardId(newCardId)
                        .cardUrl(art.getUrl()).build();
                roomList.get(sessionId).getHand().get(player).add(tmpCard);
            }
        }
    }

    public HashMap<String, List<GameCardDto>> getHand(long sessionId) {
        return roomList.get(sessionId).getHand();
    }

    public int useItem(long sessionId, UseItemDto useItemDto){
        // 아이템 쓴사람이 보유한 아이템 현황
        List<ItemDto> afterUsed = roomList.get(sessionId).getItems().get(useItemDto.getNickname());

        // 그 사람 아이템셋에서 찾아서 바꿔주기
        for (int i = 0; i < afterUsed.size(); ++i) {
            if (afterUsed.get(i).getCardId() == useItemDto.getCardId()){
                afterUsed.get(i).makeUsed();
                break;
            }
        }
        roomList.get(sessionId).getItems().replace(useItemDto.getNickname(), afterUsed);

        // 아이템의 적용
        // 드로우 아이템은 중복적용 가능하게
        boolean chk = true;
        List<EffectDto> activated = roomList.get(sessionId).getActivated();
        if (useItemDto.getEffect() != 3) {
            for (int i = 0; i < activated.size(); ++i) {
                if (activated.get(i).getEffect() == useItemDto.getEffect()) {
                    if (activated.get(i).getEffectNum() >= useItemDto.getEffectNum()) {
                        chk = false;
                    } else {
                        activated.remove(i);
                    }
                    break;
                }
            }
        }


        // 추가해도 되는 상황이면 추가하기
        if (chk) {
            EffectDto newEffect = EffectDto.builder()
                    .cardId(useItemDto.getCardId())
                    .nickname(useItemDto.getNickname())
                    .effect(useItemDto.getEffect())
                    .effectNum(useItemDto.getEffectNum()).build();
            activated.add(newEffect);
        }

        return useItemDto.getEffect();
    }

    // 아이템을 사용한 카드 한장 드로우
    public void itemOneCardDraw(long sessionId, String nickname) {
        // 덱에서 맨 앞에꺼 빼오기
        Long newCardId = roomList.get(sessionId).getDeck().remove(0);
        Art art = artRepository.findById(newCardId).orElseThrow(() -> new CustomException(ErrorCode.POSTS_NOT_FOUND));
        GameCardDto tmpCard = GameCardDto.builder()
                .cardId(newCardId)
                .cardUrl(art.getUrl()).build();
        roomList.get(sessionId).getHand().get(nickname).add(tmpCard);
    }

    public List<EffectDto> getActivated (long sessionId) {
        return roomList.get(sessionId).getActivated();
    }

    public void tableToDeck (long sessionId) {
        List<TableDto> tables = roomList.get(sessionId).getTable();
        // 한번 셔플한다
        Collections.shuffle(tables);
        for (TableDto table : tables) {
            roomList.get(sessionId).getDeck().add(table.getCardId());
        }
    }

    @Transactional
    public void updateExp(long sessionId) {
        HashMap<String, Integer> score = roomList.get(sessionId).getScore();
        List<String> players = roomList.get(sessionId).getPlayers();
        // DB에 현재까지의 최종 score를 그대로 경험치로 반영한다
        for (String player : players) {
            User user = userRepository.findByNickname(player).orElseThrow(() -> new CustomException(ErrorCode.POSTS_NOT_FOUND));
            user.updateExp(score.get(player));
            userRepository.save(user);
        }
    }

    public void updateWinOrLose(long sessionId) {
        HashMap<String, Integer> score = roomList.get(sessionId).getScore();
        List<String> players = roomList.get(sessionId).getPlayers();
        int max = -1;
        for (String player : players) {
            if (max < score.get(player)) max = score.get(player);
        }
        for (String player : players) {
            User user = userRepository.findByNickname(player).orElseThrow(() -> new CustomException(ErrorCode.POSTS_NOT_FOUND));
            if (max == score.get(player)) user.plusWin();
            else user.plusLose();
            userRepository.save(user);
        }
    }

    public List<ItemDto> getMyItems(long sessionId, String nickname) {
        return roomList.get(sessionId).getItems().get(nickname);
    }

    public void gameEnd(long sessionId) {
        // 레디 초기화
        HashMap<String, Boolean> readyMap = roomList.get(sessionId).getReady();
        List<String> players = roomList.get(sessionId).getPlayers();
        String leader = roomList.get(sessionId).getLeader();
        for (String player : players) {
            if (!player.equals(leader)) {
                readyMap.replace(player, false);
            }
        }
        roomList.get(sessionId).setReady(readyMap);
        // cards 변수 초기화
        roomList.get(sessionId).setCards(new HashMap<String, List<Long>>());
        // score 변수 초기화
        roomList.get(sessionId).setScore(new HashMap<String, Integer>());
        // items 변수 초기화
        roomList.get(sessionId).setItems(new HashMap<String, List<ItemDto>>());
        // deck 초기화
        roomList.get(sessionId).setDeck(new ArrayList<Long>());
        // nftDeck 초기화
        roomList.get(sessionId).setNftDeck(new ArrayList<Long>());
        // hand 초기화
        roomList.get(sessionId).setHand(new HashMap<String, List<GameCardDto>>());
        // status 초기화
        roomList.get(sessionId).setStatus(new HashMap<String, Boolean>());
        // teller 초기화
        roomList.get(sessionId).setTeller("");
        // turn 초기화
        roomList.get(sessionId).setTurn(0);
        // laps 초기화
        roomList.get(sessionId).setLaps(1);
        // table 초기화
        roomList.get(sessionId).setTable(new ArrayList<TableDto>());
        // choice 초기화
        roomList.get(sessionId).setChoice(new HashMap<String, Long>());
        // activated 초기화
        roomList.get(sessionId).setActivated(new ArrayList<EffectDto>());
    }
}
