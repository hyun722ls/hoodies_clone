import classes from "./articles.module.css";

const Articles = (props) => {
  return props.articles.length ? (
    <div>
      <div>
        <span className={classes.title}>자유게시판</span>
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
              <tr key={article.id}>
                <td>{article.title}</td>
                <td>{article.writer}</td>
                <td>{article.createdAt}</td>
                <td>{article.viewCnt}</td>
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
