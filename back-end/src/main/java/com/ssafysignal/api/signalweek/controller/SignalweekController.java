package com.ssafysignal.api.signalweek.controller;

import com.ssafysignal.api.global.exception.NotFoundException;
import com.ssafysignal.api.global.response.BasicResponse;
import com.ssafysignal.api.global.response.ResponseCode;
import com.ssafysignal.api.signalweek.dto.request.RegistSignalweekVoteRequest;
import com.ssafysignal.api.signalweek.dto.response.*;
import com.ssafysignal.api.signalweek.service.SignalweekService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Tag(name = "시그널 위크", description = "시그널 위크를 CRUD 할 수 있는 컨트롤러")
@RestController
@RequestMapping("/signalweek")
public class SignalweekController {
    private final SignalweekService signalweekService;
    @Tag(name = "시그널 위크")
    @Operation(summary = "시그널 위크 등록", description = "프로젝트를 시그널 위크에 등록한다")
    @PostMapping("")
    private ResponseEntity<BasicResponse> registSignalweek(
                                                            @Parameter(name = "projectSeq", required = true) @RequestParam Integer projectSeq,
                                                            @Parameter(name = "title", required = true) @RequestParam String title,
                                                            @Parameter(name = "uccUrl", required = true) @RequestParam String uccUrl,
                                                            @Parameter(name = "deployUrl", required = true) @RequestParam String deployUrl,
                                                            @Parameter(name = "content", required = true) @RequestParam String content,
                                                            @RequestPart(value = "pptFile", required = false) MultipartFile pptFile,
                                                            @RequestPart(value = "readmeFile", required = false) MultipartFile readmeFile) {
        log.info("registSignalweek - Call");

        HashMap<String, Object> signalweekRegistRequest = new HashMap<>();
        signalweekRegistRequest.put("projectSeq", projectSeq);
        signalweekRegistRequest.put("title", title);
        signalweekRegistRequest.put("uccUrl", uccUrl);
        signalweekRegistRequest.put("deployUrl", deployUrl);
        signalweekRegistRequest.put("content", content);

        try {
            signalweekService.registSinalweek(signalweekRegistRequest, pptFile, readmeFile);
            return ResponseEntity.ok().body(BasicResponse.Body(ResponseCode.SUCCESS, null));
        } catch (RuntimeException | IOException e) {
            return ResponseEntity.ok().body(BasicResponse.Body(ResponseCode.REGIST_FAIL, null));
        }
    }

    @Tag(name = "시그널 위크")
    @Operation(summary = "시그널 위크 목록 조회", description = "시그널 위크의 목록을 조회한다")
    @GetMapping("")
    private ResponseEntity<BasicResponse> findAllSignalweek(@Parameter(description = "page", required = true) Integer page,
                                                            @Parameter(description = "size", required = true) Integer size,
                                                            @Parameter(description = "search keyword(subject)") String subject) {
        log.info("findAllSignalweek - Call");

        try {
            FindAllSignalweekResponse signalweekList = signalweekService.findAllSignalweek(page, size, subject);
            return ResponseEntity.ok().body(BasicResponse.Body(ResponseCode.SUCCESS, signalweekList));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(BasicResponse.Body(ResponseCode.LIST_NOT_FOUND, null));
        }
    }

    @Tag(name = "시그널 위크")
    @Operation(summary = "시그널 위크 상세 조회", description = "시그널 위크 중 하나의 항목을 조회한다")
    @GetMapping("{signalweekSeq}")
    private ResponseEntity<BasicResponse> findSignalweek(@Parameter(description = "시그널 위크 seq") @PathVariable(name = "signalweekSeq") Integer signalweekSeq,
                                                         @Parameter(description = "유저 seq") Integer userSeq) {
        log.info("findSignalweek - Call");

        try {
            FindSignalweekResponse signalweek = signalweekService.findSignalweek(signalweekSeq, userSeq);
            return ResponseEntity.ok().body(BasicResponse.Body(ResponseCode.SUCCESS, signalweek));
        } catch (NotFoundException e){
            return ResponseEntity.ok().body(BasicResponse.Body(ResponseCode.SUCCESS, null));
        } catch (RuntimeException e) {
            return ResponseEntity.ok().body(BasicResponse.Body(ResponseCode.NOT_FOUND, null));
        }
    }

    @Tag(name = "시그널 위크")
    @Operation(summary = "시그널 위크 투표", description = "시그널 위크 프로젝트에 투표를 한다.")
    @PostMapping("vote")
    private ResponseEntity<BasicResponse> registSignalweekVote(@Parameter(description = "시그널 위크 투표 등록 정보") @RequestBody RegistSignalweekVoteRequest registSignalweekVoteRequest) {
        log.info("registSignalweekVote - Call");

        try {
            return ResponseEntity.ok().body(BasicResponse.Body(ResponseCode.SUCCESS, signalweekService.registSignalweekVote(registSignalweekVoteRequest)));
        } catch (RuntimeException e) {
            return ResponseEntity.ok().body(BasicResponse.Body(ResponseCode.REGIST_FAIL, null));
        }
    }

    @Tag(name = "시그널 위크")
    @Operation(summary = "시그널 위크 명예의 전당 목록 조회", description = "시그널 위크 명예의 전당을 조회한다.")
    @GetMapping("rank")
    private ResponseEntity<BasicResponse> findAllSignalweekRank(@Parameter(description = "연도") Integer year,
                                                                @Parameter(description = "분기") Integer quarter) {
        log.info("findAllSignalweekRank - Call");

        try {
            List<FindSignalweekRankResponse> signalweekRankList = signalweekService.findAllSiganlweekRank(year, quarter);
            return ResponseEntity.ok().body(BasicResponse.Body(ResponseCode.SUCCESS, signalweekRankList));
        } catch (RuntimeException e) {
            return ResponseEntity.ok().body(BasicResponse.Body(ResponseCode.LIST_NOT_FOUND, null));
        }
    }

    @Tag(name = "시그널 위크")
    @Operation(summary = "시그널 위크 쿼터 종료 시 정산", description = "시그널 위크 투표 결과에 따라 명예의 전당 등록, 쿼터 종료, 하트 지급")
    @PostMapping("ending")
    private ResponseEntity<BasicResponse> quarterEndSignalweek() {
        log.info("quarterEndSignalweek - Call");

        try {
            signalweekService.endSignalweek();
            return ResponseEntity.ok().body(BasicResponse.Body(ResponseCode.SUCCESS, null));
        } catch (RuntimeException e) {
            return ResponseEntity.ok().body(BasicResponse.Body(ResponseCode.LIST_NOT_FOUND, null));
        }
    }
    
    @Tag(name = "시그널 위크")
    @Operation(summary = "역대 시그널 위크 수상작 목록 조회", description = "역대 시그널 위크 수상작 목록 조회")
    @GetMapping("signalweekschedule")
    private ResponseEntity<BasicResponse> findAllSignalweekSchedule(@Parameter(description = "page", required = true) Integer page,
                                                                    @Parameter(description = "size", required = true) Integer size) {
        log.info("findAllSignalweekSchedule - Call");

        try {
            FindAllSignalweekScheduleResponse findAllSignalweekScheduleResponse = signalweekService.findAllSignalweekSchedule(page, size);
            return ResponseEntity.ok().body(BasicResponse.Body(ResponseCode.SUCCESS, findAllSignalweekScheduleResponse));
        } catch (RuntimeException e) {
            return ResponseEntity.ok().body(BasicResponse.Body(ResponseCode.LIST_NOT_FOUND, null));
        }
    }

    @Tag(name = "시그널 위크")
    @Operation(summary = "시그널 위크 기간 조회", description = "시그널 위크 기간 조회")
    @GetMapping("signalweekdate")
    private ResponseEntity<BasicResponse> findSignalweekSchedule() {
        log.info("findSignalweekSchedule - Call");

        try {
            FindSignalweekDateResponse findSignalweekDateResponse = signalweekService.findSignalweekSchedule();
            return ResponseEntity.ok().body(BasicResponse.Body(ResponseCode.SUCCESS, findSignalweekDateResponse));
        } catch (RuntimeException e) {
            return ResponseEntity.ok().body(BasicResponse.Body(ResponseCode.NOT_FOUND, null));
        }
    }

    @Tag(name = "시그널 위크")
    @Operation(summary = "시그널 위크 이전 분기", description = "시그널 위크 이전 분기")
    @GetMapping("signalweekmain")
    private ResponseEntity<BasicResponse> findSignalweekScheduleMain() {
        log.info("findSignalweekScheduleMain - Call");

        try {
            FindSignalweekDateResponse findSignalweekDateResponse = signalweekService.findSignalweekScheduleMain();
            return ResponseEntity.ok().body(BasicResponse.Body(ResponseCode.SUCCESS, findSignalweekDateResponse));
        } catch (RuntimeException e) {
            return ResponseEntity.ok().body(BasicResponse.Body(ResponseCode.NOT_FOUND, null));
        }
    }
}