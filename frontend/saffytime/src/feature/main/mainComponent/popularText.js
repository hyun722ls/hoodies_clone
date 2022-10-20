import classes from "./articles.module.css";

const PopularText = (props) => {
  return props.popularText.length ? (
    <div>
      <div>
        <span className={classes.title}>인기게시판</span>
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
              <tr key={article.id}>
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
