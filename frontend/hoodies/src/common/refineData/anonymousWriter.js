export const annonymousWriter = (comments, writer) => {
    const commentsWriters = comments?.map((comment) => {
        return comment.writer
    })
    console.log(commentsWriters)

    const uniqueWriters = commentsWriters?.filter((element, index) => {
        return commentsWriters.indexOf(element) === index ;
    });
    
    
    const writerIndex = uniqueWriters?.indexOf(writer)
    console.log(writerIndex)
    if (writerIndex > -1){
        uniqueWriters?.splice(writerIndex, 1)
    }
 

    const commentsMap = {}
    
    uniqueWriters.forEach((element, index) => {
        commentsMap[element] = index;
    });
    
    console.log(commentsMap)

    return commentsMap

}

export const confirmWriter = (articleWriter, commentWriter, commentsMap) => {
    if (articleWriter === commentWriter){
        return '익명'
    } else {
        console.log(commentWriter, commentsMap)
        return `익명${commentsMap[commentWriter]+1}`
    }

}
