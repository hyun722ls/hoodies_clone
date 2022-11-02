export const blockArticle = (article, tmpCategory) => {
    const category = JSON.parse(tmpCategory)
    console.log(category['titleResuit'])
    if (category.titleResuit === 'clean' && category.contentResult === 'clean'){
      return article.title
    } else if(category.titleResuit !== 'clean' && category.contentResult === 'clean'){
        return `제목에서 욕설이 감지되었습니다.`
        // return `제목에서 ${category.titleResuit}가 감지되었습니다.`
    } else if(category.titleResuit === 'clean' && category.contentResult !== 'clean'){
      if (category.contentResult === '악플/욕설'){
        return '게시글의 내용에서 욕설이 감지되었습니다.'
      } else{
        return `게시글의 내용에서 욕설이 감지되었습니다.`
          // return `게시글에서 ${category.contentResult} 혐오 표현이 감지되었습니다.`
      }
    } else {
        return `제목과 게시글에서 욕설이 감지되었습니다.`
      // return `제목에서 ${category.titleResuit} 혐오 표현이, 게시글에서 ${category.contentResult} 혐오 표현이 감지되었습니다.`
    }   
  }