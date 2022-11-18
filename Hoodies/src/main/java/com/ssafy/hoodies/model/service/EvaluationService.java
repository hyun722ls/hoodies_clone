package com.ssafy.hoodies.model.service;

import com.ssafy.hoodies.model.dto.EvaluationDto;

public interface EvaluationService {
    int addEvaluation(EvaluationDto dto, String id);

    int removeEvaluation(String mid, String eid);
}
