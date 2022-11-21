package com.ssafy.hoodies.model.service;

import com.ssafy.hoodies.model.dto.MentorDto;
import com.ssafy.hoodies.model.repository.MentorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MentorServiceImpl implements MentorService{
    private final MentorRepository mentorRepository;
    @Transactional(readOnly = true)
    public List<MentorDto> findMentors() {
        Sort sort = Sort.by("modifiedAt").descending()
                        .and(Sort.by("_id").ascending());
        return mentorRepository.findAll(sort)
                               .stream()
                               .map(MentorDto::fromEntity)
                               .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MentorDto> findTypicalMentors(int type) {
        Sort sort = Sort.by("modifiedAt").descending()
                        .and(Sort.by("_id").ascending());
        return mentorRepository.findAllByType(type, sort)
                               .stream()
                               .map(MentorDto::fromEntity)
                               .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MentorDto findMentor(String id) {
        Optional<MentorDto> dto = mentorRepository.findById(id).map(MentorDto::fromEntity);
        if(!dto.isPresent()) return null;

        return dto.get();
    }

    @Transactional(readOnly = true)
    public List<MentorDto> findRecentMentor() {
        return mentorRepository.findBy(PageRequest.of(0, 8, Sort.by("modifiedAt").descending()
                                                                 .and(Sort.by("_id").ascending())))
                               .stream()
                               .map(MentorDto::fromEntity)
                               .collect(Collectors.toList());
    }
}
