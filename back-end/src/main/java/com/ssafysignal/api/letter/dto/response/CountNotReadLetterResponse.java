package com.ssafysignal.api.letter.dto.response;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
@Builder
public class CountNotReadLetterResponse {
    private long count;

    @Builder
    public CountNotReadLetterResponse(long count) {
        this.count = count;
    }
}
