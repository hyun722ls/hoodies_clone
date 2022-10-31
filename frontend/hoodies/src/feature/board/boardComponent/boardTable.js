import { useHistory } from "react-router-dom";
import { blockArticle } from "../../../common/refineData/blockArticle";
import classes from "./boardTable.module.css";
import {timeConventer} from "../../../common/refineData/refineTime"

const BoardTable = (props) => {
  const history = useHistory();

  const detailPageHandler = (article) => {
    history.push({ pathname: "/board/free/detail", state: article._id });
  };


  return props.articles.length ? (
    <div>
      <table className={classes.table}>
        <thead>
          <tr>
            <th>제목</th>
            <th>작성자</th>
            <th>시간</th>
            <th>조회수</th>
            <th>추천수</th>
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
                <td>{article.like}</td>
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

export default BoardTable;
