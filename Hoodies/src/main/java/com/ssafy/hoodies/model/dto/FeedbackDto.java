package com.ssafy.hoodies.model.dto;

import com.ssafy.hoodies.model.entity.Feedback;
import com.ssafy.hoodies.util.util;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.bson.types.ObjectId;

@Data
@ApiModel
public class FeedbackDto {
    @ApiModelProperty(value = "작성자")
    private String writer;

    @ApiModelProperty(value = "내용")
    private String content;

    @ApiModelProperty(value = "작성시간", accessMode = ApiModelProperty.AccessMode.READ_ONLY)
    private String createdAt;

    public Feedback toEntity() {
        String now = util.getTimeStamp();
        return Feedback.builder()
                ._id(String.valueOf(new ObjectId()))
                .writer(writer)
                .content(content)
                .createdAt(now)
                .build();
    }
}
