import { useHistory } from "react-router-dom";
import classes from "./popularTexts.module.css";
const PopularTexts = (props) => {
  const history = useHistory();
  const detailPageHandler = (article) => {
    history.push({ pathname: "/board/free/detail", state: article });
  };
  return props.popularTexts.length ? (
    <div>
      <div>
        <span className={classes.title}>인기게시글</span>
      </div>
      <table className={classes.table}>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
          </tr>
        </thead>
        <tbody>
          {props.popularTexts.map((article) => {
            return (
              <tr
                onClick={() => {
                  detailPageHandler(article);
                }}
                key={article.id}
              >
                <td>{article.id}</td>
                <td>{article.title}</td>
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

// 이거는 리스트 처리로

export default PopularTexts;
