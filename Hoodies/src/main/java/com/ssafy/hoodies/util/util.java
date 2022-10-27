package com.ssafy.hoodies.util;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;

public class util {
    private util(){}
    public static String getTimeStamp(){
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd kk:mm:ss");
        return sdf.format(timestamp);
    }
}
