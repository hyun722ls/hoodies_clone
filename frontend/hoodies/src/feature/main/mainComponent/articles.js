import { useHistory } from "react-router-dom";
import classes from "./articles.module.css";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { blockArticle } from "../../../common/refineData/blockArticle";
import { timeConventer } from "../../../common/refineData/refineTime";

const Articles = (props) => {
const history = useHistory();

const freeBoardHandler = () => {
  history.push("/board/free");
};
const detailPageHandler = (article) => {
  history.push({ pathname: "/board/free/detail", state: article._id });
};

return props.articles.length ? (
  <div>
    <div>
      <span className={classes.title}>최신글</span>
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
          <th>조회수</th>
        </tr>
      </thead>
      <tbody>
        {props.articles.map((article) => {
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
              <td>{article.hit}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
) : (
    <p>작성된 글이 없습니다.</p>
  );
};

export default Articles;
