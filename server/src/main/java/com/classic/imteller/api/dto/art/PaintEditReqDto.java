package com.classic.imteller.api.dto.art;

import lombok.Getter;

@Getter
public class PaintEditReqDto {
    private Long paintId;
    private String paintTitle;
    private String description;
}
