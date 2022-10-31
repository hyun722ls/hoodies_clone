package com.ssafy.hoodies.model.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@NoArgsConstructor
@Data
@Document(collection = "board")
public class Board {
    @Id
    private String _id;

    private String title;
    private String userName;
    private String content;
    private int hit;
    private int like;
    private String createdAt;
    private String modifiedAt;
//    private Comment comment; // List<Comment> ?
    // private ??? image;

}
