package com.ssafy.hoodies.controller;

import com.mongodb.client.result.UpdateResult;
import com.ssafy.hoodies.model.dto.EvaluationDto;
import com.ssafy.hoodies.model.entity.Evaluation;
import com.ssafy.hoodies.model.entity.Mentor;
import com.ssafy.hoodies.model.entity.User;
import com.ssafy.hoodies.model.repository.MentorRepository;
import com.ssafy.hoodies.model.repository.UserRepository;
import com.ssafy.hoodies.util.util;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final UserRepository userRepository;

    @Value("${nickname.salt}")
    private String salt;

    // 전체 평가 페이지 조회
    @GetMapping("mentor")
    @ApiOperation(value = "전체 평가페이지 조회")
    public List<Mentor> findAllMentor(){
        Sort sort = Sort.by("modifiedAt").descending();
        return mentorRepository.findAll(sort);
    }

    // 타입별 평가 페이지 조회
    @GetMapping("mentor/{type}")
    @ApiOperation(value = "타입별 전체 평가 페이지 조회")
    public List<Mentor> findMentorByType(@PathVariable int type){
        Sort sort = Sort.by("modifiedAt").descending();
        return mentorRepository.findAllByType(type, sort);
    }

    // 특정 평가페이지 조회
    @GetMapping("mentor/detail/{id}")
    @ApiOperation(value = "특정 평가 페이지 조회")
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
    @ApiOperation(value = "최근 평가 8개 조회")
    public List<Mentor> findRecentBoard(){
        return mentorRepository.findBy(PageRequest.of(0, 8, Sort.by("modifiedAt").descending()));
    }

    // 평가 등록
    @PostMapping("mentor/{id}/evaluation")
    @ApiOperation(value = "평가 등록")
    public JSONObject writeEvaluation(@RequestBody EvaluationDto dto, @PathVariable String id){
        Mentor mentor = mentorRepository.findById(id).get();
        List<String> contributors = mentor.getContributor();

        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();
        String email = ((org.springframework.security.core.userdetails.User) authentication.getPrincipal()).getUsername();

        User user = userRepository.findById(email).get();
        String ewriter = util.getEncryptPassword(user.getNickname(), salt);

        int statusCode = 400;

        if(!contributors.contains(ewriter)){ // 평가를 처음하는 사람
            contributors.add(ewriter);

            ResponseEntity<String> res = util.checkExpression("", dto.getContent(), "comment");
            Evaluation evaluation = dto.toEntity();
            evaluation.setCategory(res.getBody().trim());
            evaluation.setWriter(ewriter);

            double[] avgscore = mentor.getAverageScores();
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
            evaluationUpdate.set("averageScores", avgscore);
            evaluationUpdate.push("contributor", ewriter);
            evaluationUpdate.push("evaluations", evaluation);

            UpdateResult ur = mongoTemplate.updateFirst(evaluationQuery, evaluationUpdate, "mentor");

            statusCode = ur.getModifiedCount() > 0 ? 200 : 400;
        }

        JSONObject json = new JSONObject();
        json.put("statusCode", statusCode);
        return json;
    }

    // 평가 삭제 --> 관리자 전용 기능
    @DeleteMapping("mentor/{mid}/evaluation/{eid}")
    @ApiOperation(value = "평가 삭제")
    public JSONObject deleteEvaluation(@PathVariable String mid, @PathVariable String eid){
        int statusCode = 400;
        String target = "";

        double[] sum = new double[]{0,0,0,0,0};
        int cnt = 0;
        for(Evaluation evaluation : mentorRepository.findById(mid).get().getEvaluations()){
            if(eid.equals(evaluation.get_id())){
                target = evaluation.getWriter();
            }else{
                for(int idx=0; idx<5; ++idx){
                    sum[idx] += evaluation.getScore()[idx];
                }
                cnt++;
            }
        }
        if(cnt > 0){
            for(int idx=0; idx<5; ++idx) sum[idx] = sum[idx] / cnt;
        }

        if(!"".equals(target)){
            Query evaluationQuery = new Query();
            evaluationQuery.addCriteria(Criteria.where("_id").is(mid));
            evaluationQuery.addCriteria(Criteria.where("evaluations").elemMatch(Criteria.where("_id").is(eid)));
            Update evaluationUpdate = new Update();
            evaluationUpdate.set("averageScores", sum);
            evaluationUpdate.pull("evaluations", Query.query(Criteria.where("_id").is(eid)));
            evaluationUpdate.pull("contributor", target);

            UpdateResult ur = mongoTemplate.updateFirst(evaluationQuery, evaluationUpdate, "mentor");

            statusCode = ur.getModifiedCount() > 0 ? 200 : 400;
        }

        JSONObject json = new JSONObject();
        json.put("statusCode", statusCode);
        return json;
    }
}
