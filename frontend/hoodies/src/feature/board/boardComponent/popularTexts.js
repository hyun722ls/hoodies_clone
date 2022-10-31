import { useHistory } from "react-router-dom";
import { blockArticle } from "../../../common/refineData/blockArticle";
import classes from "./popularTexts.module.css";
const PopularTexts = (props) => {
  const history = useHistory();
  const detailPageHandler = (article) => {
    history.push({ pathname: "/board/free/detail", state: article._id });
  };
 
  return props.popularTexts.length ? (
    <div>
      <div>
        <span className={classes.title}>인기게시글</span>
      </div>
      <table className={classes.table}>
        <thead>
          <tr>
            
            <th>제목</th>
            <th>작성자</th>
          </tr>
        </thead>
        <tbody>
          {props.popularTexts.map((article) => {
            return (
              <tr
                onClick={() => {
                  detailPageHandler(article);
                }}
                key={article._id}
              >
                <td>{blockArticle(article, article.category)}</td>
                <td>{article.writer}</td>
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
