package com.classic.imteller.api.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserVoteRepository extends JpaRepository<UserVote, Long> {
    Optional<UserVote> findByUserAndVote(User user, Vote vote);
    boolean existsByUserAndVote(User user, Vote vote);
}
