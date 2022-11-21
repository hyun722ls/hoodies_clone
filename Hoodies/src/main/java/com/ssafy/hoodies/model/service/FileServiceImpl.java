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
import com.j256.simplemagic.ContentInfo;
import com.j256.simplemagic.ContentInfoUtil;
import com.ssafy.hoodies.model.entity.Board;
import com.ssafy.hoodies.model.repository.BoardRepository;
import com.ssafy.hoodies.util.util;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.InputStream;
import java.util.*;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {
    private AmazonS3 amazonS3;

    @Value("${cloud.aws.credentials.accessKey}")
    private String accessKey;

    @Value("${cloud.aws.credentials.secretKey}")
    private String secretKey;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.region.static}")
    private String region;

    private final HashSet<String> availableExtensions = new HashSet<>(Arrays.asList("jpeg", "png", "gif"));

    private final MongoTemplate mongoTemplate;
    private final BoardRepository boardRepository;

    private final SecurityService securityService;
    private final UserService userService;

    @Value("${nickname.salt}")
    private String salt;

    @PostConstruct
    public void setAmazonS3() {
        AWSCredentials credentials = new BasicAWSCredentials(this.accessKey, this.secretKey);

        amazonS3 = AmazonS3ClientBuilder.standard().withCredentials(new AWSStaticCredentialsProvider(credentials)).withRegion(this.region).build();
    }

    public String upload(MultipartFile file, boolean randomFilenameFlag) {
        String uploadResult = "fail";
        try (InputStream getFileInputStream = file.getInputStream()) {
            StringBuilder filename = new StringBuilder();
            if (randomFilenameFlag)
                filename.append(UUID.randomUUID()).append("_");
            filename.append(file.getOriginalFilename());

            ContentInfoUtil contentInfoUtil = new ContentInfoUtil();
            ContentInfo fileInfo = contentInfoUtil.findMatch(getFileInputStream);
            String fileExtension = fileInfo.getName();

            // 업로드할 수 없는 확장자일 경우
            if (!availableExtensions.contains(fileExtension)) {
                return uploadResult;
            }

            ObjectMetadata objectMetadata = new ObjectMetadata();
            objectMetadata.setContentType(file.getContentType());
            objectMetadata.setContentLength(file.getSize());
            PutObjectRequest objectRequest = new PutObjectRequest(bucket, filename.toString(), file.getInputStream(), objectMetadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead);
            amazonS3.putObject(objectRequest);
            uploadResult = filename.toString();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return uploadResult;
    }

    @Override
    public void deleteFile(String fileName) {
        amazonS3.deleteObject(new DeleteObjectRequest(bucket, fileName));
    }

    @Override
    public List<String> uploadFile(String id, List<MultipartFile> files) {
        String email = securityService.findEmail();
        String nickname = userService.findNickname(email);
        String encodedNickname = util.getEncryptStr(nickname, salt);

        try {
            Board board = boardRepository.findById(id).get();
            String writer = board.getWriter();

            // 권한이 없는 요청
            if (!(writer.equals(nickname) || writer.equals(encodedNickname)))
                return Collections.emptyList();

            // 기존 업로드 파일 삭제
            List<String> getFilePaths = board.getFilePaths();
            if (getFilePaths != null) {
                for (String path : getFilePaths) {
                    deleteFile(path);
                }
            }

            // 파일 업로드
            List<String> filePaths = new ArrayList<>();
            if (files != null) {
                for (int i = 0; i < Math.min(files.size(), 4); i++) {
                    MultipartFile file = files.get(i);
                    boolean randomFilenameFlag = true;
                    if (getFilePaths != null && getFilePaths.contains(file.getOriginalFilename()))
                        randomFilenameFlag = false;
                    String path = upload(file, randomFilenameFlag);
                    // upload에 실패한 경우
                    if (path.equals("fail"))
                        continue;
                    filePaths.add(path);
                }
            }

            Query boardQuery = new Query(Criteria.where("_id").is(id));
            Update boardUpdate = new Update();
            boardUpdate.set("filePaths", filePaths);
            mongoTemplate.updateFirst(boardQuery, boardUpdate, Board.class);

            return filePaths;
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}
