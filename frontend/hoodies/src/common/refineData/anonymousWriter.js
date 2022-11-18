export const anonymousWriter = (comments, writer) => {
    const commentsWriters = comments?.map((comment) => {
        return comment.writer
    })
    // console.log(commentsWriters)

    const uniqueWriters = commentsWriters?.filter((element, index) => {
        return commentsWriters.indexOf(element) === index ;
    });
    
    
    const writerIndex = uniqueWriters?.indexOf(writer)
    // console.log(writerIndex)
    if (writerIndex > -1){
        uniqueWriters?.splice(writerIndex, 1)
    }
 

    const commentsMap = {}
    
    uniqueWriters.forEach((element, index) => {
        commentsMap[element] = index;
    });
    
    // console.log(commentsMap)

    return commentsMap

}

export const confirmWriter = (articleWriter, commentWriter, commentsMap) => {
    if (articleWriter === commentWriter){
        return '익명'
    } else {
        // console.log(commentWriter, commentsMap)
        return `익명${commentsMap[commentWriter]+1}`
    }

}


export const changeAnonymous = (article) => {
    if(article.type === 2){
        return '익명'
    } else{
        return article.writer
    }
}


export const checkBoardType = (article) => {
    if(article.type === 2){
        return '익명게시판'
    } else if(article.type === 1){
        return '자유게시판'
    } else{
        return '코딩게시판'
    }
}
