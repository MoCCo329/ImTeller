package com.classic.imteller.api.dto.art;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PaintsResDto {
    private Long paintId;
    private String paintTitle;
    private String paintImageURL;
    private String content;
    private Integer isVote;
}
