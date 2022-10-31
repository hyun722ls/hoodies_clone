package com.ssafy.hoodies.controller;

import com.mongodb.client.result.UpdateResult;
import com.ssafy.hoodies.model.dto.EvaluationDto;
import com.ssafy.hoodies.model.entity.Evaluation;
import com.ssafy.hoodies.model.entity.Mentor;
import com.ssafy.hoodies.model.repository.MentorRepository;
import com.ssafy.hoodies.util.util;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RequiredArgsConstructor
@RestController
@Api(tags = {"평가 API"})
//@CrossOrigin(origins = "*")
public class MentorController {
    private final MentorRepository mentorRepository;
    private final MongoTemplate mongoTemplate;

    // 전체 평가 페이지 조회
    @GetMapping("mentor")
    @ApiOperation(value = "전체 평가페이지 조회")
    public Page<Mentor> findAllMentor(Pageable pageable){
        Sort sort = Sort.by("modifiedAt").descending();
        return mentorRepository.findAll(PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort));
    }

    // 타입별 평가 페이지 조회
    @GetMapping("mentor/{type}")
    @ApiOperation(value = "전체 게시물 조회")
    public Page<Mentor> findMentorByType(Pageable pageable, @PathVariable String type){
        Sort sort = Sort.by("modifiedAt").descending();
        return mentorRepository.findAllByType(type, PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort));
    }

    // 특정 평가페이지 조회
    @GetMapping("mentor/detail/{id}")
    @ApiOperation(value = "특정 게시물 조회")
    public Mentor findCertainBoard(
            @ApiParam(
                    name =  "id",
                    type = "String",
                    value = "평가의 DB상 id",
                    required = true)
            @PathVariable String id){
        return mentorRepository.findById(id).get();
    }

    // 최근 게시물 조회
    @GetMapping("preview/mentor")
    @ApiOperation(value = "최근 게시물 8개 조회")
    public List<Mentor> findRecentBoard(){
        return mentorRepository.findBy(PageRequest.of(0, 8, Sort.by("modifiedAt").descending()));
    }

    // 댓글 등록
    @PostMapping("mentor/{id}/evaluation")
    @ApiOperation(value = "댓글 등록")
    public JSONObject writeEvaluation(@RequestBody EvaluationDto dto, @PathVariable String id){
        ResponseEntity<String> res = util.checkExpression("", dto.getContent(), "comment");
        Evaluation evaluation = dto.toEntity();
        evaluation.setCategory(res.getBody().trim());

        Mentor mentor = mentorRepository.findById(id).get();
        double[] avgscore = mentor.getScores();
        int length = mentor.getEvaluations().size();

        if(length == 0) avgscore = Arrays.stream(dto.getScore()).asDoubleStream().toArray();
        else {
            for (int i = 0; i < avgscore.length; ++i) {
                avgscore[i] = (avgscore[i] * length + dto.getScore()[i]) / (length + 1);
            }
        }
        Query evaluationQuery = new Query(Criteria.where("_id").is(id));
        Update evaluationUpdate = new Update();
        evaluationUpdate.set("modifiedAt", util.getTimeStamp());
        evaluationUpdate.set("scores", avgscore);
        evaluationUpdate.push("evaluations", evaluation);

        UpdateResult ur = mongoTemplate.updateFirst(evaluationQuery, evaluationUpdate, "mentor");

        int statusCode = ur.getModifiedCount() > 0 ? 200 : 400;
        JSONObject json = new JSONObject();
        json.put("statusCode", statusCode);
        return json;
    }
}
