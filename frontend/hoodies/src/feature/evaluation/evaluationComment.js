import { useState } from "react";
import { Rating } from "@mui/material";
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import styled from "styled-components";
import { blockComment } from "../../common/refineData/blockArticle";

const RightArticles = styled.div`
  grid-column: 3/4;
  grid-row: 1;
  width: 320px;
  margin-bottom: auto;
  background-color: #F9F5EB;
`
const Article = styled.article`
  margin-bottom: -1px;
  box-sizing: border-box;
  border: 1px solid #EAE3D2;
  cursor: pointer;
`

const ArticleA = styled.a`
  margin: 0;
  padding: 14px;
  display: block;
`

const ArticleH2 = styled.h2`
  margin: 0;
  margin-bottom: 5px;
  line-height: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: normal;
`

const ArticleH2_filter = styled.h2`
  margin: 0;
  margin-bottom: 5px;
  line-height: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
  font-weight: normal;
  color: #ff5f5f;
`

const ArticleH3 = styled.h3`
  margin: 0;
  padding: 0;
  float: left;
  max-width: 90px;
  height: 15px;
  line-height: 15px;
  font-size: 11px;
  font-weight: normal;
  letter-spacing: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Title = styled.div`
  padding: 16px;
  border-bottom: 3px solid #EAE3D2;
  box-sizing: border-box;
`

const H2 = styled.h2`
  color: #1D3979;
  margin: 0;
`

const ArticleTime = styled.time`
  margin: 0;
  padding: 0;
  float: left;
  margin-right: 5px;
  height: 15px;
  line-height: 15px;
  font-size: 11px;
  color: #a6a6a6;
`

const Score = styled.ul`
  margin: 0;
  padding: 0;
  float: right;
  list-style: none;
`

const Item = styled.li`
  margin: 0;
  float: left;
  margin-left: 0px;
  padding: 0 2px;
  padding-left: 2px;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  background-repeat: no-repeat;
  background-position: left center;
  background-size: 11px 11px;
  cursor: pointer;
`

const ArticleHr = styled.hr`
  margin: 0;
  padding: 0;
  clear: both;
  height: 0;
  border: 0;
  width: 100%;
`

const EvaulationComment = (props) => {
  const [modifyForm, setModifyForm] = useState(false);
  const [modifyContent, setModifyContent] = useState("");
  const [commentId, setCommentId] = useState(null);
  const [newContent, setNewContent] = useState("");
  const [like, setLike] = useState(false);

  function handleLike(){
    //다 불켜짐
    setLike(!like)
  }

  function average(array){
    let sum = 0
    for (const item of array){
      sum += item;
    }
    return sum/5
  }

  return props.comments.length ? (
    <div style={{border: '1px solid #EAE3D2', backgroundColor:'#F9F5EB'}}>
      <Title>
        <H2>한줄평</H2>
      </Title>
      {props.comments.map((comment) => {
        return (
          <div key={comment._id} style={{borderBottom:'1px solid #EAE3D2', marginLeft:'10px'}}>
            <div style={{display:'flex', flexWrap:'wrap', fontWeight:500}}><div>{comment.content}</div></div>
            <div style={{fontSize:'11px'}}>{comment.createdAt.slice(0,10)}</div>
            <div style={{display:'inline-flex'}}><Rating value={parseFloat(average(comment.score).toFixed(1))} precision={0.1} icon={<StarRateRoundedIcon/>} emptyIcon={<StarOutlineRoundedIcon/>} readOnly></Rating><div style={{marginLeft:'5px',fontSize:'10px'}}>{average(comment.score).toFixed(1)}</div></div>
            {localStorage.getItem("flag") && (
                    <button
                      onClick={() => props.deleteCommentHandler(comment._id)}
                    >
                      삭제
                    </button>
                  )}
            {/* <div style={{display:'flex'}}><ThumbUpAltIcon fontSize='small'></ThumbUpAltIcon><div style={{marginLeft:'3px'}}>{comment.like}</div></div> */}
          </div>
        );
      })}
    </div>
  ) : (
    <div style={{border: '1px solid #EAE3D2', backgroundColor:'#F9F5EB'}}>
      <Title>
        <H2>한줄평</H2>
      </Title>
      <div style={{borderBottom:'1px solid #EAE3D2', marginLeft:'10px'}}>평가가 존재하지 않습니다.</div>
    </div>
  );
};

export default EvaulationComment;
