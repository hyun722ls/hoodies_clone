import { useHistory } from "react-router-dom";
import classes from "./boardTable.module.css";

const BoardTable = (props) => {
  const history = useHistory();

  const detailPageHandler = (article) => {
    history.push({ pathname: "/board/free/detail", state: article });
  };


  const blockingArticle = (article, tmpCategory) => {
    const category = JSON.parse(tmpCategory)
    console.log(category['titleResuit'])
    if (category.titleResuit === 'clean' && category.contentResult === 'clean'){
      return article.title
    } else if(category.titleResuit !== 'clean' && category.contentResult === 'clean'){
      return `제목에서 ${category.titleResuit}가 감지되었습니다.`
    } else if(category.titleResuit === 'clean' && category.contentResult !== 'clean'){
      if (category.contentResult === '악플/욕설'){
        return '게시글에서 욕설이 감지되었습니다.'
      } else{
        return `게시글에서 ${category.contentResult} 혐오 표현이 감지되었습니다.`
      }
    } else {
      return `제목에서 ${category.titleResuit} 혐오 표현이, 게시글에서 ${category.contentResult} 혐오 표현이 감지되었습니다.`
    }   
  }
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
                <td>{blockingArticle(article, article.category)}</td>
                <td>{article.writer}</td>
                <td>{article.createdAt}</td>
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
