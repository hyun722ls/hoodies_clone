export const blockArticle = (article, tmpCategory) => {
    const category = JSON.parse(tmpCategory)
    console.log(category['titleResuit'])
    if (category.titleResuit === 'clean' && category.contentResult === 'clean'){
      return article.title
    } else if(category.titleResuit !== 'clean' && category.contentResult === 'clean'){
        if (category.titleResuit === '악플/욕설'){
            return `게시글의 제목에서 욕설이 감지되었습니다.`
        } else {
            if (category.titleResuit === '성소수자' || category.titleResuit === '종교' || category.titleResuit === '기타혐오') {
                return `게시글의 제목에서 ${category.titleResuit}와 관련된 욕설이 감지되었습니다.`
            } else {
            return `게시글의 제목에서 ${category.titleResuit}과 관련된 욕설이 감지되었습니다.`
            }
        }
    } else if(category.titleResuit === 'clean' && category.contentResult !== 'clean'){
      if (category.contentResult === '악플/욕설'){
        return `게시글의 내용에서 욕설이 감지되었습니다.`
      } else {
          if (category.contentResult === '성소수자' || category.contentResult === '종교' || category.contentResult === '기타혐오') {
              return `게시글의 내용에서 ${category.contentResult}와 관련된 욕설이 감지되었습니다.`
          } else {
        return `게시글의 내용에서 ${category.contentResult}과 관련된 욕설이 감지되었습니다.`
      }
      }
    } else {
        if (category.titleResuit === '악플/욕설' || category.contentResult === '악플/욕설') {
            return `게시글의 제목과 내용에서 욕설이 감지되었습니다.`
        } else {
            if (category.contentResult === '성소수자' || category.contentResult === '종교' || category.contentResult === '기타혐오') {
                if (category.titleResuit === category.contentResult) {
                    return `게시글의 제목과 내용에서 ${category.titleResuit}과 관련된 욕설이 감지되었습니다.`
                } else {
                    return `게시글의 제목과 내용에서 ${category.titleResuit}, ${category.contentResult}와 관련된 욕설이 감지되었습니다.`
                }
            } else {
                if (category.titleResuit === category.contentResult) {
                    return `게시글의 제목과 내용에서 ${category.titleResuit}과 관련된 욕설이 감지되었습니다.`
                } else {
                    return `게시글의 제목과 내용에서 ${category.titleResuit}, ${category.contentResult}과 관련된 욕설이 감지되었습니다.`
                }
              }
          }
      }
    }