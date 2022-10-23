package com.classic.imteller.api.dto.art;

import lombok.Getter;

@Getter
public class PaintSaveReqDto {
    private String email;
    private String paintTitle;
    private String description;
}
