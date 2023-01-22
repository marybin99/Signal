package com.ssafysignal.api.global.db.repository;

import com.ssafysignal.api.global.db.entity.CommonCode;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CommonCodeRepositoryTest {

    @Autowired
    private CommonCodeRepository commonCodeRepository;

    @Test
    void findAllTest() {
        List<CommonCode> commonCodeList = commonCodeRepository.findAll();
        assertTrue(commonCodeList.size() == 95);
    }

    @Test
    void findByIdTest() {
        CommonCode commonCode = commonCodeRepository.findById("AI100").get();
        assertEquals(commonCode.getName(), "keras");
    }

    @Test
    void findByGroupCodeTest() {
        List<CommonCode> commonCodeList = commonCodeRepository.findByGroupCode("LO");
        assertEquals(commonCodeList.get(0).getName(), "서울특별시");
    }

}