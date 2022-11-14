package com.ssafy.hoodies.model.service;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.internal.Mimetypes;
import com.amazonaws.services.s3.model.*;
import com.amazonaws.services.s3.transfer.TransferManager;
import com.amazonaws.services.s3.transfer.TransferManagerBuilder;
import com.amazonaws.util.IOUtils;
import com.j256.simplemagic.ContentInfo;
import com.j256.simplemagic.ContentInfoUtil;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.HashSet;
import java.util.UUID;

@Service
@NoArgsConstructor
public class FileService {
    private AmazonS3 amazonS3;

    @Value("${cloud.aws.credentials.accessKey}")
    private String accessKey;

    @Value("${cloud.aws.credentials.secretKey}")
    private String secretKey;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.region.static}")
    private String region;

    private final HashSet<String> availableExtensions = new HashSet<>(Arrays.asList("jpeg", "png"));

    @PostConstruct
    public void setAmazonS3() {
        AWSCredentials credentials = new BasicAWSCredentials(this.accessKey, this.secretKey);

        amazonS3 = AmazonS3ClientBuilder.standard().withCredentials(new AWSStaticCredentialsProvider(credentials)).withRegion(this.region).build();
    }

    public String upload(MultipartFile file) {
        String uploadResult = "fail";
        try (InputStream getFileInputStream = file.getInputStream()){
            StringBuilder fileName = new StringBuilder().append(UUID.randomUUID()).append("_").append(file.getOriginalFilename());

//            ContentInfoUtil contentInfoUtil = new ContentInfoUtil();
//            ContentInfo fileInfo = contentInfoUtil.findMatch(getFileInputStream);
//            String fileExtension = fileInfo.getName();
//            // 업로드할 수 없는 확장자일 경우
//            if (!availableExtensions.contains(fileExtension)) {
//                return uploadResult;
//            }

            ObjectMetadata objectMetadata = new ObjectMetadata();
            objectMetadata.setContentType(file.getContentType());
            objectMetadata.setContentLength(file.getSize());
            PutObjectRequest objectRequest = new PutObjectRequest(bucket, fileName.toString(), file.getInputStream(), objectMetadata)
                                                .withCannedAcl(CannedAccessControlList.PublicRead);
            amazonS3.putObject(objectRequest);

//            byte[] bytes = IOUtils.toByteArray(getFileInputStream);
//            ObjectMetadata objectMetadata = new ObjectMetadata();
//            objectMetadata.setContentLength(bytes.length);
//            objectMetadata.setContentType(file.getContentType());
//
//            ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);
//
//            amazonS3.putObject(new PutObjectRequest(bucket, fileName.toString(), byteArrayInputStream, objectMetadata)
//                    .withCannedAcl(CannedAccessControlList.PublicRead)
//            );
            uploadResult = fileName.toString();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return uploadResult;
    }

    public void deleteFile(String fileName) {
        amazonS3.deleteObject(new DeleteObjectRequest(bucket, fileName));
    }
}
