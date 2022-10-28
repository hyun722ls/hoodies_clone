import { useHistory } from "react-router-dom";
import classes from "./boardTable.module.css";

const BoardTable = (props) => {
  const history = useHistory();

  const detailPageHandler = (article) => {
    history.push({ pathname: "/board/free/detail", state: article });
  };

  return props.articles.length ? (
    <div>
      <table className={classes.table}>
        <thead>
          <tr>
            <th>번호</th>
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
                key={article.id}
              >
                <td>{article.id}</td>
                <td>{article.title}</td>
                <td>{article.writer}</td>
                <td>{article.createdAt}</td>
                <td>{article.viewCnt}</td>
                <td>{article.recommend}</td>
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
