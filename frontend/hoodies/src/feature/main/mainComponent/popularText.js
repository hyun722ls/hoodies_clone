import { useHistory } from "react-router-dom";
import classes from "./articles.module.css";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { blockArticle } from "../../../common/refineData/blockArticle";
import { timeConventer } from "../../../common/refineData/refineTime";
import Grid from '@mui/material/Grid';

const PopularText = (props) => {
  const history = useHistory();
  const freeBoardHandler = () => {
    history.push("/board/free");
  };
  const detailPageHandler = (article) => {
    history.push({ pathname: "/board/free/detail", state: article._id });
  };
  return props.popularText.length ? (
    <Grid item xs={12} md={6}>
      <div>
        <span className={classes.title}>인기글</span>
        <ReadMoreIcon
          fontSize="large"
          onClick={() => {
            freeBoardHandler();
          }}
        />
      </div>
      <table className={classes.table}>
        <thead>
          <tr>
            <th>제목</th>
            <th>작성자</th>
            <th>시간</th>
            <th>추천수</th>
          </tr>
        </thead>
        <tbody>
          {props.popularText.map((article) => {
            return (
              <tr
                onClick={() => {
                  detailPageHandler(article);
                }}
                key={article._id}
              >
                <td>{blockArticle(article, article.category)}</td>
                <td>{article.writer}</td>
                <td>{timeConventer(article.createdAt)}</td>
                <td>{article.like}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Grid>
  ) : (
    <Grid item xs={12} md={6}>작성된 글이 없습니다.</Grid>
  );
};

export default PopularText;
