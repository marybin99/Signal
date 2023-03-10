package com.ssafysignal.api.apply.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ssafysignal.api.apply.entity.Apply;
import com.ssafysignal.api.common.entity.CommonCode;
import io.swagger.annotations.ApiModel;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ApiModel(value = "ApplyWriterFindResponse", description = "공고 작성자 기준 지원서 목록 항목")
public class FindApplyWriterResponse {
    @Schema(description = "지원서 Seq", example = "1")
    private Integer applySeq;
    @Schema(description = "지원자 Seq", example = "1")
    private Integer userSeq;
    @Schema(description = "지원자 nickname")
    private String nickname;
    @Schema(description = "지원자 포지션코드")
    private CommonCode positionCode;
    @Schema(description = "지원자 메모")
    private String memo;
    @Schema(description = "지원서의 상태코드")
    private CommonCode applyCode;
    @Schema(description = "사전미팅 Seq", example = "1")
    private Integer postingMeetingSeq;
    @Schema(description = "사전미팅 상태코드")
    private CommonCode postingMeetingCode;
    @Schema(description = "사전미팅 시간")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSS", shape = JsonFormat.Shape.STRING)
    private LocalDateTime meetingDt;

    public static List<FindApplyWriterResponse> toList(List<Apply> applyList){
        return applyList.stream()
                .map(FindApplyWriterResponse::fromEntity)
                .collect(Collectors.toList());
    }


    public static FindApplyWriterResponse fromEntity(Apply apply) {
        return FindApplyWriterResponse.builder()
                .applySeq(apply.getApplySeq())
                .userSeq(apply.getUserSeq())
                .nickname(apply.getUser().getNickname())
                .positionCode(apply.getPosition())
                .memo(apply.getMemo())
                .applyCode(apply.getCode())
                .postingMeetingSeq(apply.getPostingMeetingSeq())
                .postingMeetingCode(apply.getPostingMeeting().getCode())
                .meetingDt(apply.getPostingMeeting().getMeetingDt())
                .build();
    }
}
