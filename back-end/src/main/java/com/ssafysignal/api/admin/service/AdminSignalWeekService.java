package com.ssafysignal.api.admin.service;

import com.ssafysignal.api.admin.dto.request.BasicAdminSignalWeekRequest;
import com.ssafysignal.api.admin.dto.response.FindAdminSignalWeekResponse;
import com.ssafysignal.api.admin.dto.response.FindAllAdminSignalweekResponse;
import com.ssafysignal.api.global.exception.NotFoundException;
import com.ssafysignal.api.global.response.ResponseCode;
import com.ssafysignal.api.signalweek.entity.SignalweekSchedule;
import com.ssafysignal.api.signalweek.repository.SignalweekScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminSignalWeekService {
    private final SignalweekScheduleRepository signalweekScheduleRepository;
    @Transactional(readOnly = true)
    public FindAllAdminSignalweekResponse findAllSignalWeek(Integer page, Integer size) {
        Page<SignalweekSchedule> signalweekSchedulePage = signalweekScheduleRepository.findAll(PageRequest.of(page - 1, size, Sort.Direction.DESC, "signalweekScheduleSeq"));

        return FindAllAdminSignalweekResponse.builder()
                .signalweekList(signalweekSchedulePage.stream().map(FindAdminSignalWeekResponse::fromEntity).collect(Collectors.toList()))
                .count(signalweekSchedulePage.getTotalElements())
                .build();
    }
    @Transactional
    public void registSignalWeek(BasicAdminSignalWeekRequest basicAdminSignalWeekRequest) throws RuntimeException {
        signalweekScheduleRepository.save(SignalweekSchedule.builder()
                        .openStartDt(basicAdminSignalWeekRequest.getOpenStartDt())
                        .openEndDt(basicAdminSignalWeekRequest.getOpenEndDt())
                        .voteStartDt(basicAdminSignalWeekRequest.getVoteStartDt())
                        .voteEndDt(basicAdminSignalWeekRequest.getVoteEndDt())
                        .quarter(basicAdminSignalWeekRequest.getQuarter())
                        .year(basicAdminSignalWeekRequest.getYear())
                        .build());
    }
    @Transactional
    public void modifySignalWeek(Integer signalweekScheduleSeq, BasicAdminSignalWeekRequest basicAdminSignalWeekRequest) throws RuntimeException {
        SignalweekSchedule signalweekSchedule = signalweekScheduleRepository.findById(signalweekScheduleSeq)
                .orElseThrow(() -> new NotFoundException(ResponseCode.MODIFY_NOT_FOUND));

        signalweekSchedule.setOpenStartDt(basicAdminSignalWeekRequest.getOpenStartDt());
        signalweekSchedule.setOpenEndDt(basicAdminSignalWeekRequest.getOpenEndDt());
        signalweekSchedule.setVoteStartDt(basicAdminSignalWeekRequest.getVoteStartDt());
        signalweekSchedule.setVoteEndDt(basicAdminSignalWeekRequest.getVoteEndDt());
        signalweekSchedule.setQuarter(basicAdminSignalWeekRequest.getQuarter());
        signalweekSchedule.setYear(basicAdminSignalWeekRequest.getYear());

        signalweekScheduleRepository.save(signalweekSchedule);
    }
    @Transactional
    public void deleteSignalWeek(Integer signalweekScheduleSeq) throws RuntimeException {
        SignalweekSchedule signalweekSchedule = signalweekScheduleRepository.findById(signalweekScheduleSeq)
                .orElseThrow(() -> new NotFoundException(ResponseCode.MODIFY_NOT_FOUND));

        signalweekScheduleRepository.delete(signalweekSchedule);
    }
}
