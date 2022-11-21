package com.ssafy.hoodies.model;

public enum EvaluationType {
    NONE(0),
    CONSULTANT(1), // 1:컨설턴트
    PRO(2),        // 2:프로
    COACH(3);       // 3:코치

    private int type;

    EvaluationType(int type){
        this.type = type;
    }

    public static EvaluationType convert(int type){
        for(EvaluationType evaluationType : EvaluationType.values()){
            if(evaluationType.type == type) return evaluationType;
        }
        return NONE;
    }
}
