package com.classic.imteller.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    boolean existsByArtIdAndIsVoting(long artId, int isVoting);

    Optional<Vote> findByArtIdAndIsVoting(long artId, int isVoting);

    List<Vote> findByIsVoting(int isVoting);

    @Query(value = "SELECT * FROM vote v " +
            "JOIN art a ON a.id = v.art_id " +
            "WHERE YEAR(v.created_at) = :year AND MONTH(v.created_at) = :month AND v.is_voting = 2 " +
            "ORDER BY v.count DESC",
            nativeQuery = true)
    List<Vote> findByIsVotingAndCreatedAt(int year, int month);

}
