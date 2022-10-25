package com.ssafy.hoodies.model.model;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.sql.Timestamp;

@NoArgsConstructor
@Data
@Document(collection = "comment")
public class Comment {
    @Id
    private String _id;

    private String userName;
    private String content;
    private Timestamp timestamp;

    @Builder
    public Comment(String userName, String content){
        this.userName = userName;
        this.content = content;
        this.timestamp = new Timestamp(System.currentTimeMillis());
    }

}
