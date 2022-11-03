export const annonymousWriter = (comments, writer) => {
    const commentsWriters = comments?.map((comment) => {
        return comment.writer
    })
    console.log(commentsWriters)

    const uniqueWriters = commentsWriters?.filter((element, index) => {
        return comments.indexOf(element) === index ;
    });
    
    console.log(uniqueWriters)
    const writerIndex = uniqueWriters?.indexOf(writer)
    if (writerIndex > -1){
        uniqueWriters?.splice(writerIndex, 1)
    }

    console.log(uniqueWriters)
    const commentsMap = uniqueWriters?.map((element, index) => {
        return {element:index}
    })

    console.log(commentsMap)

    return commentsMap

}

export const confirmWriter = (writer, commentsMap) => {
    const my = localStorage.getItem('hashNickname')
    if (writer === my){
        return '익명'
    } else {
        return `익명${commentsMap[writer]}`
    }

}