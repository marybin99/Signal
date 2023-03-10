package com.ssafysignal.api.posting.entity;

import com.ssafysignal.api.common.entity.CommonCode;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DynamicInsert
@DynamicUpdate
@Builder
@AllArgsConstructor
@Table(name = "posting_skill")
public class PostingSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "posting_skill_seq")
    private Integer postingSkillSeq;
    @Column(name = "posting_seq")
    private Integer postingSeq;
    @Column(name = "skill_code")
    private String skillCode;
    @OneToOne
    @JoinColumn(name = "skill_code", insertable = false, updatable = false)
    private CommonCode code;
}
