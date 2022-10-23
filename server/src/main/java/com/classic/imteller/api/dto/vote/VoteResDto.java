package com.classic.imteller.api.dto.vote;

import com.classic.imteller.api.repository.Vote;
import lombok.*;

@Builder
@Getter
public class VoteResDto {
    private Vote vote;
    private boolean isLike;
}
