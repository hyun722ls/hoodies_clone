import { useHistory } from "react-router-dom";
import classes from "./popularTexts.module.css";
const PopularTexts = (props) => {
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
                <td>{blockingArticle(article, article.category)}</td>
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
