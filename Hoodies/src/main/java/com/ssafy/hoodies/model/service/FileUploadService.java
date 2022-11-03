package com.ssafy.hoodies.model.service;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.util.IOUtils;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

@Service
@NoArgsConstructor
public class FileUploadService {
    private AmazonS3 fileUploadClient;

    @Value("${cloud.aws.credentials.accessKey}")
    private String accessKey;

    @Value("${cloud.aws.credentials.secretKey}")
    private String secretKey;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.region.static}")
    private String region;

    private final String URL = "https://seoulhoodies.s3.ap-northeast-2.amazonaws.com/";

    @PostConstruct
    public void setFileUploadClient() {
        AWSCredentials credentials = new BasicAWSCredentials(this.accessKey, this.secretKey);

        fileUploadClient = AmazonS3ClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(this.region)
                .build();
    }

    public String upload(MultipartFile file) throws IOException {
        StringBuilder fileName = new StringBuilder().append(UUID.randomUUID()).append("_").append(file.getOriginalFilename());
        InputStream getFileInputStream = file.getInputStream();
        byte[] bytes = IOUtils.toByteArray(getFileInputStream);

        ObjectMetadata objectMetadata = new ObjectMetadata();
        objectMetadata.setContentLength(bytes.length);
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);

        fileUploadClient.putObject(new PutObjectRequest(bucket, fileName.toString(), byteArrayInputStream, objectMetadata)
                .withCannedAcl(CannedAccessControlList.PublicRead));
        return URL + fileName;
    }
}
