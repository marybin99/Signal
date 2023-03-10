package com.ssafysignal.api.user.dto.response;

import com.ssafysignal.api.user.entity.User;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class FindAllUserResponse {

    private List<UserFindResponse> userList;

    private FindAllUserResponse(final List<UserFindResponse> userList) {
        this.userList = userList;
    }

    public static FindAllUserResponse fromEntity(final Page<User> findUserList) {
        List<UserFindResponse> userList = findUserList.stream()
                .map(UserFindResponse::fromEntity)
                .collect(Collectors.toList());
        return new FindAllUserResponse(userList);
    }

}
