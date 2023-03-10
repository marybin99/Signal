package com.ssafysignal.api.board.entity;

import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DynamicInsert
@DynamicUpdate
@Builder
@AllArgsConstructor
@Table(name = "qna")
public class Qna {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "qna_seq")
    private Integer qnaSeq;

    @Column(name = "user_seq")
    private Integer userSeq;

    @Column(name = "title")
    private String title;

    @Column(name = "content")
    private String content;

    @Column(name = "is_top")
    private Boolean isTop;

    @Column(name = "view")
    private Integer view;

    @Column(name = "answer")
    private String answer;

    @Column(name = "is_answer")
    private Boolean isAnswer;

    @Column(name = "reg_dt")
    private LocalDateTime regDt;
}
