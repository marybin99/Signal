package com.ssafysignal.api.user.service;

import com.ssafysignal.api.auth.entity.Auth;
import com.ssafysignal.api.auth.repository.AuthRepository;
import com.ssafysignal.api.auth.repository.UserAuthRepository;
import com.ssafysignal.api.common.dto.EmailDto;
import com.ssafysignal.api.common.entity.ImageFile;
import com.ssafysignal.api.common.repository.ImageFileRepository;
import com.ssafysignal.api.common.service.EmailService;
import com.ssafysignal.api.common.service.FileService;
import com.ssafysignal.api.global.exception.NotFoundException;
import com.ssafysignal.api.global.response.ResponseCode;
import com.ssafysignal.api.user.dto.request.ModifyUserRequest;
import com.ssafysignal.api.user.dto.request.RegistUserRequest;
import com.ssafysignal.api.user.entity.User;
import com.ssafysignal.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final AuthRepository authRepository;
    private final UserAuthRepository userAuthRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final ImageFileRepository imageFileRepository;
    private final FileService fileService;

    @Value("${server.host}")
    private String host;
    @Value("${app.fileUpload.uploadPath.userImage}")
    private String imageUploadPath;
    @Value("${app.fileUpload.uploadPath}")
    private String uploadPath;

    @Transactional(readOnly = true)
    public User findUser(final int userSeq) {
        return userRepository.findByUserSeq(userSeq)
                .orElseThrow(() -> new NotFoundException(ResponseCode.NOT_FOUND));
    }
    
    @Transactional
    public void registUser(RegistUserRequest registUserRequest) throws Exception {
        String authCode = UUID.randomUUID().toString();

        // ???????????? ?????????
        String passwordEncode = passwordEncoder.encode(registUserRequest.getPassword());

        if (passwordEncoder.matches(registUserRequest.getPassword(), passwordEncode)) System.out.println(true);

        // ?????????????????? ??????
        User user = userRepository.save(User.builder()
                        .name(registUserRequest.getName())
                        .email(registUserRequest.getEmail())
                        .password(passwordEncode)
                        .nickname(registUserRequest.getNickname())
                        .birth(registUserRequest.getBirth())
                        .phone(registUserRequest.getPhone())
                        .build());

        // ????????? ?????? ?????? ??????
        Auth auth = Auth.builder()
                .userSeq(user.getUserSeq())
                .authCode("AU101")
                .code(authCode)
                .build();

        // ?????? ?????? ??????
        authRepository.save(auth);

        // ?????? ?????? ??????
        emailService.sendMail(
                EmailDto.builder()
                        .receiveAddress(user.getEmail())
                        .title("Signal ?????? ?????? - ????????? ??????")
                        .content("?????? ????????? ???????????? ???????????? ??????????????????.")
                        .text("????????? ??????")
                        .host(host)
                        .url(String.format("/api/auth/emailauth/%s", authCode))
                        .build());
    }
    
    @Transactional
    public void deleteUser(int userSeq) throws RuntimeException {
        User user = userRepository.findByUserSeq(userSeq)
                        .orElseThrow(() -> new NotFoundException(ResponseCode.DELETE_NOT_FOUND));
        userAuthRepository.deleteByUser(user);
    }
    
    @Transactional
    public void modifyUser(int userSeq, ModifyUserRequest modifyUserRequest) throws RuntimeException, IOException {
    	User user = userRepository.findByUserSeq(userSeq)
    			.orElseThrow(() -> new NotFoundException(ResponseCode.NOT_FOUND));

        if(modifyUserRequest.getProfileImageFile() != null) {
            // ????????? ?????? ?????????
            ImageFile imageFile = fileService.registImageFile(modifyUserRequest.getProfileImageFile(), imageUploadPath);
            // ?????? ???????????? ???????????? ????????? ??????
            if (user.getImageFile().getImageFileSeq() != 0) {
                // ?????? ?????? ?????? ??????
                fileService.deleteImageFile(uploadPath + user.getImageFile().getUrl());
                user.getImageFile().setType(imageFile.getType());
                user.getImageFile().setUrl(imageFile.getUrl());
                user.getImageFile().setName(imageFile.getName());
                user.getImageFile().setSize(imageFile.getSize());
                user.getImageFile().setRegDt(LocalDateTime.now());
            } else {
                ImageFile newImageFile = ImageFile.builder()
                        .name(imageFile.getName())
                        .size(imageFile.getSize())
                        .url(imageFile.getUrl())
                        .type(imageFile.getType())
                        .build();
                imageFileRepository.save(newImageFile);
                user.setUserImageFileSeq(newImageFile.getImageFileSeq());
            }
        }
        user.setNickname(modifyUserRequest.getNickname());
        user.setPhone(modifyUserRequest.getPhone());
        userRepository.save(user);
    }

    @Transactional
    public void modifyPassword(int userSeq, String password, String newPassword){
        User user = userRepository.findByUserSeq(userSeq)
                .orElseThrow(() -> new NotFoundException(ResponseCode.NOT_FOUND));

        if (!passwordEncoder.matches(password, user.getPassword())){
            throw new NotFoundException(ResponseCode.UNAUTHORIZED);
        }
        // ???????????? ?????????
        String passwordEncode = passwordEncoder.encode(newPassword);
        user.modifyPassword(passwordEncode);
        userRepository.save(user);
    }

}
