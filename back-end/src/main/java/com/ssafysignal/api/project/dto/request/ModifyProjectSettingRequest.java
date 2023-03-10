package com.ssafysignal.api.project.dto.request;

import io.swagger.annotations.ApiModel;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ApiModel(value = "ProjectSettingModifyRequest", description = "프로젝트 설정 수정 정보")
public class ModifyProjectSettingRequest {
    @Schema(description = "공고 Seq")
    private String subject;
    @Schema(description = "지역 코드")
    private String localCode;
    @Schema(description = "분야 코드")
    private String fieldCode;
    @Schema(description = "대면 비대면 여부")
    private boolean isContact;
    @Schema(description = "프로젝트 기간")
    private Integer term;
    @Schema(description = "프로젝트 설명")
    private String content;
    @Schema(description = "프로젝트 Git Url")
    private String gitUrl;
    @Schema(description = "이미지 삭제")
    private Boolean isDelete;
}
