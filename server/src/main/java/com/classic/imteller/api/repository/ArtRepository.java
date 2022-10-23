package com.classic.imteller.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArtRepository extends JpaRepository<Art, Long> {
    @Query(value="SELECT * FROM art WHERE owner_nickname = :nickname AND token_id IS NOT NULL", nativeQuery = true)
    List<Art> findAllByNicknameAndIsNFT(@Param("nickname") String email);

    @Query(value="SELECT * FROM art WHERE owner_nickname = :nickname AND token_id IS NULL", nativeQuery = true)
    List<Art> findAllByNicknameAndIsPaint(@Param("nickname") String email);

    @Query(value="SELECT * FROM art WHERE owner_id = :email AND token_id IS NULL", nativeQuery = true)
    List<Art> findAllByEmailAndIsPaint(@Param("email") String email);

    @Query(value="SELECT count(*) FROM art WHERE owner_id = :email AND token_id IS NULL", nativeQuery = true)
    int countByEmailAndIsPaint(@Param("email") String email);

    Optional<Art> findById(Long id);

    Optional<Art> findByTokenId(Long tokenId);

    void deleteById(Long id);

    @Query(value="SELECT * FROM art a JOIN user u WHERE u.email = :email AND token_id IS NULL AND is_vote = 1", nativeQuery = true)
    List<Art> findAllByEmailAndTokenIdAndIsVote(String email);

    @Query(value="SELECT * FROM art WHERE token_id IS NULL AND is_vote = 1", nativeQuery = true)
    List<Art> findAllByTokenIdAndIsVote();
}