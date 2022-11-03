export const annonymousWriter = (comments, writer) => {
    const commentsWriters = comments?.map((comment) => {
        return comment.writer
    })
    console.log(commentsWriters)

    const uniqueWriters = commentsWriters?.filter((element, index) => {
        return commentsWriters.indexOf(element) === index ;
    });
    
    console.log(uniqueWriters)
    const writerIndex = uniqueWriters?.indexOf(writer)
    if (writerIndex > -1){
        uniqueWriters?.splice(writerIndex, 1)
    }
 
    console.log(uniqueWriters)

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
        return `익명${commentsMap[commentWriter]}`
    }

}