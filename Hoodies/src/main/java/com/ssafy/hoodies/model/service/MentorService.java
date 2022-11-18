package com.ssafy.hoodies.model.service;

import com.ssafy.hoodies.model.dto.MentorDto;

import java.util.List;

public interface MentorService {

    List<MentorDto> findMentors();

    List<MentorDto> findTypicalMentors(int type);

    MentorDto findMentor(String id);

    List<MentorDto> findRecentMentor();
}
