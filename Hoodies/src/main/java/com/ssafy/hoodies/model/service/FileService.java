package com.ssafy.hoodies.model.service;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.util.IOUtils;
import com.j256.simplemagic.ContentInfo;
import com.j256.simplemagic.ContentInfoUtil;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
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
        try {
            StringBuilder fileName = new StringBuilder().append(UUID.randomUUID()).append("_").append(file.getOriginalFilename());
            InputStream getFileInputStream = file.getInputStream();

            ContentInfoUtil contentInfoUtil = new ContentInfoUtil();
            ContentInfo fileInfo = contentInfoUtil.findMatch(getFileInputStream);
            String fileExtension = fileInfo.getName();
            // 업로드할 수 없는 확장자일 경우
            if (!availableExtensions.contains(fileExtension)) {
                return uploadResult;
            }

            byte[] bytes = IOUtils.toByteArray(getFileInputStream);
            ObjectMetadata objectMetadata = new ObjectMetadata();
            objectMetadata.setContentLength(bytes.length);
            ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);

            amazonS3.putObject(new PutObjectRequest(bucket, fileName.toString(), byteArrayInputStream, objectMetadata).withCannedAcl(CannedAccessControlList.PublicRead));
            uploadResult = fileName.toString();
        } catch (Exception e) {
        }
        return uploadResult;
    }

    public void deleteFile(String fileName) {
        amazonS3.deleteObject(new DeleteObjectRequest(bucket, fileName));
    }
}
