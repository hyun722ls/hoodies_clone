import { useHistory } from "react-router-dom";
import classes from "./articles.module.css";
import ReadMoreIcon from "@mui/icons-material/ReadMore";

const PopularText = (props) => {
  const history = useHistory();
  const freeBoardHandler = () => {
    history.push("/board/free");
  };
  const detailPageHandler = (article) => {
    history.push({ pathname: "/board/free/detail", state: article });
  };
  return props.popularText.length ? (
    <div>
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
                key={article.id}
              >
                <td>{article.title}</td>
                <td>{article.writer}</td>
                <td>{article.createdAt}</td>
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

export default PopularText;
