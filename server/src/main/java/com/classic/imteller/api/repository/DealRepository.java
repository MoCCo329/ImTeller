package com.classic.imteller.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DealRepository extends JpaRepository<Deal, Long> {

    List<Deal> findByFinishedAtAfter(LocalDateTime now);

    List<Deal> findByFinishedAtBefore(LocalDateTime now);

    @Query("select d, a from Deal d left join d.art a where a.title like %:title%")
    List<Deal> searchByCardTitleLike(String title);

    @Query("select d, a from Deal d left join d.art a where a.title like %:title% and d.finishedAt > :now")
    List<Deal> searchByCardTitleLikeAndFinishedAtAfter(String title, LocalDateTime now);

    @Query("select d, a from Deal d left join d.art a where a.title like %:title% and d.finishedAt < :now")
    List<Deal> searchByCardTitleLikeAndFinishedAtBefore(String title, LocalDateTime now);

    @Query(value = "SELECT * FROM deal d " +
            "LEFT JOIN art a ON a.id = d.art_id " +
            "LEFT JOIN user u ON u.id = a.designer_id " +
            "WHERE u.nickname LIKE %:nickname%",
            nativeQuery = true)
    List<Deal> searchByCardDesignerLike(String nickname);

    @Query(value = "SELECT * FROM deal d " +
            "LEFT JOIN art a ON a.id = d.art_id " +
            "LEFT JOIN user u ON u.id = a.designer_id " +
            "WHERE u.nickname LIKE %:nickname% AND d.finished_at > :now",
            nativeQuery = true)
    List<Deal> searchByCardDesignerLikeAndFinishedAtAfter(String nickname, LocalDateTime now);

    @Query(value = "SELECT * FROM deal d " +
            "LEFT JOIN art a ON a.id = d.art_id " +
            "LEFT JOIN user u ON u.id = a.designer_id " +
            "WHERE u.nickname LIKE %:nickname% AND d.finished_at < :now",
            nativeQuery = true)
    List<Deal> searchByCardDesignerLikeAndFinishedAtBefore(String nickname, LocalDateTime now);

    @Query(value = "SELECT * FROM deal d " +
            "LEFT JOIN art a ON a.id = d.art_id " +
            "LEFT JOIN user u ON u.id = a.owner_id " +
            "WHERE u.nickname LIKE %:nickname%",
            nativeQuery = true)
    List<Deal> searchByCardOwnerLike(String nickname);

    @Query(value = "SELECT * FROM deal d " +
            "LEFT JOIN art a ON a.id = d.art_id " +
            "LEFT JOIN user u ON u.id = a.owner_id " +
            "WHERE u.nickname LIKE %:nickname% AND d.finished_at > :now",
            nativeQuery = true)
    List<Deal> searchByCardOwnerLikeAndFinishedAtAfter(String nickname, LocalDateTime now);

    @Query(value = "SELECT * FROM deal d " +
            "LEFT JOIN art a ON a.id = d.art_id " +
            "LEFT JOIN user u ON u.id = a.owner_id " +
            "WHERE u.nickname LIKE %:nickname% AND d.finished_at < :now",
            nativeQuery = true)
    List<Deal> searchByCardOwnerLikeAndFinishedAtBefore(String nickname, LocalDateTime now);

    @Query("select d from Deal d left join fetch d.finalBid b where d.finalBid is not null and d.finishedAt > :base order by b.bidPrice desc")
    List<Deal> findByFinalBidNotNullAndFinishedAtAfterOrderByFinalBidPrice(LocalDateTime base);
}
