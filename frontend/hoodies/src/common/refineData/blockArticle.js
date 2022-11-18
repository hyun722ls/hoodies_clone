import { blockCnt } from "../api/url"

export const blockArticle = (article, tmpCategory) => {
    const category = JSON.parse(tmpCategory)
    const reportCnt = article.reporter?.length
    if (reportCnt > blockCnt){
        return '신고 누적된 게시글 입니다.'
    } else {
        if (category.titleResuit === 'clean' && category.contentResult === 'clean'){
          return article.title
        } else if(category.titleResuit !== 'clean' && category.contentResult === 'clean'){
            if (category.titleResuit === '악플/욕설'){
                return `제목에 욕설이 포함되어 있습니다.`
            } else {
                if (category.titleResuit === '성소수자' || category.titleResuit === '종교') {
                    return `제목에 ${category.titleResuit} 비하 표현이 포함되어 있습니다.`
                } else if(category.titleResuit === '여성/가족') {
                    return '제목에 여성 혐오 표현이 포함되어 있습니다.'
                } else if (category.titletResult === '남성'){
                    return '제목에 남성 혐오 표현이 포함되어 있습니다.'
                } else{
                    return `제목에 혐오 표현이 포함되어 있습니다.`
                }
            }
        } else if(category.titleResuit === 'clean' && category.contentResult !== 'clean'){
          if (category.contentResult === '악플/욕설'){
            return `게시글에 욕설이 포함되어 있습니다.`
          } else {
            if (category.contentResult === '성소수자' || category.contentResult === '종교') {
                return `게시글에 ${category.contentResult} 비하 표현이 포함되어 있습니다.`
            } else if(category.contentResult === '여성/가족') {
                return '게시글에 여성 혐오 표현이 포함되어 있습니다.'
            } else if (category.contentResult === '남성'){
                return '게시글에 남성 혐오 표현이 포함되어 있습니다.'
            } else{
                return `게시글에 혐오 표현이 포함되어 있습니다.`
            }
          }
        } else {
            if (category.contentResult === '악플/욕설'){
                return `게시글에 욕설이 포함되어 있습니다.`
              } else {
                if (category.contentResult === '성소수자' || category.contentResult === '종교') {
                    return `게시글에 ${category.contentResult} 비하 표현이 포함되어 있습니다.`
                } else if(category.contentResult === '여성/가족') {
                    return '게시글에 여성 혐오 표현이 포함되어 있습니다.'
                } else if (category.contentResult === '남성'){
                    return '게시글에 남성 혐오 표현이 포함되어 있습니다.'
                } else{
                    return `게시글에 혐오 표현이 포함되어 있습니다.`
                }
              }
          }

    }
    
   
    }



export const blockComment = (comment) => {
    const category = JSON.parse(comment.category)
    if (comment.reporter?.length > blockCnt){
        return '신고 누적된 댓글입니다.'
    } else{
        if (category.commentResult === 'clean'){
            return comment.content
        } else if (category.commentResult === '악플/욕설'){
            return '댓글에 욕설이 포함되어 있습니다.'
        } else if (category.commentResult === '성소수자' || category.commentResult === '종교' ){
            return `댓글에 ${category.commentResult} 비하 표현이 포함되어 있습니다.`
        } else if (category.commentResult === '여성/가족'){
            return '댓글에 여성 혐오 표현이 포함되어 있습니다.'
        } else if (category.commentResult === '남성'){
            return '댓글에 남성 혐오 표현이 포함되어 있습니다.'
        } else{
            return `댓글에 혐오 표현이 포함되어 있습니다.`
        }
    }

}
