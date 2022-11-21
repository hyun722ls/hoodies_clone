package com.ssafy.hoodies.model.service;

import com.ssafy.hoodies.model.dto.EvaluationDto;
import com.ssafy.hoodies.model.dto.MentorDto;
import com.ssafy.hoodies.model.entity.Evaluation;
import com.ssafy.hoodies.model.entity.Mentor;
import com.ssafy.hoodies.model.repository.MentorRepository;
import com.ssafy.hoodies.util.util;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EvaluationServiceImpl implements EvaluationService{
    @Value("${nickname.salt}")
    private String salt;
    private final MentorRepository mentorRepository;
    private final MongoTemplate mongoTemplate;
    @Transactional
    public int addEvaluation(EvaluationDto evaluationDto, String id) {
        Optional<Mentor> dto = mentorRepository.findById(id);
        if(!dto.isPresent()) return 0; // DB에서 평가글을 찾지 못함

        Mentor mentor = dto.get();

        if(mentor == null || evaluationDto.getWriter() == null) return 0;

        String encodedNickname = util.getEncryptStr(evaluationDto.getWriter(), salt);
        evaluationDto.setWriter(encodedNickname);

        List<String> contributors = mentor.getContributor();

        if(contributors == null || contributors.contains(encodedNickname)) return 0;

        double[] avgscore = mentor.getAverageScores();
        int length = mentor.getEvaluations().size();

        if(length == 0) avgscore = Arrays.stream(evaluationDto.getScore()).asDoubleStream().toArray();
        else {
            for (int i = 0; i < avgscore.length; ++i) {
                avgscore[i] = (avgscore[i] * length + evaluationDto.getScore()[i]) / (length + 1);
            }
        }

        Query evaluationQuery = new Query(Criteria.where("_id").is(id));
        Update evaluationUpdate = new Update();

        evaluationUpdate.set("modifiedAt", util.getTimeStamp());
        evaluationUpdate.set("averageScores", avgscore);
        evaluationUpdate.push("contributor", encodedNickname);
        evaluationUpdate.push("evaluations", evaluationDto.toEntity());

        return Long.valueOf(mongoTemplate.updateFirst(evaluationQuery, evaluationUpdate, Mentor.class)
                                         .getModifiedCount())
                                         .intValue();
    }

    @Transactional
    public int removeEvaluation(String mid, String eid) {
        Optional<MentorDto> dto = mentorRepository.findById(mid).map(MentorDto::fromEntity);
        if(!dto.isPresent()) return 0; // DB에서 평가글을 찾지 못함
        
        List<Evaluation> evaluations = dto.get().getEvaluations();
        if(evaluations == null || eid == null) return 0; // 평가가 없는 평가글

//        Optional<Evaluation> evaluation = evaluations.stream()
//                                          .filter(e -> eid.equals(e.get_id()))
//                                          .findAny();
//        if(!evaluation.isPresent()) return 0; // 해당하는 평가를 찾지 못함
//        String target = evaluation.get().getWriter();

        String target = "";

        double[] sum = new double[]{0,0,0,0,0};
        int cnt = 0;
        for(Evaluation evaluation : evaluations){
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

            return Long.valueOf(mongoTemplate.updateFirst(evaluationQuery, evaluationUpdate, Mentor.class)
                                             .getModifiedCount())
                                             .intValue();
        }else return 0;
    }
}
