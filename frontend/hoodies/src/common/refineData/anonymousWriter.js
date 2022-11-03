export const annonymousWriter = (comments) => {
    const my = localStorage.getItem('hashNickname')
    const commentsWriters = comments?.map((comment) => {
        return comment.writer
    })

    const uniqueWriters = commentsWriters?.filter((element, index) => {
        return comments.indexOf(element) === index ;
    });
    const writerIndex = uniqueWriters?.indexOf(my)
    if (writerIndex > -1){
        uniqueWriters?.splice(writerIndex, 1)
    }
    const commentsMap = uniqueWriters?.map((element, index) => {
        return {element:index}
    })

    commentsMap.my = uniqueWriters?.length

    return commentsMap

}

export const confirmWriter = (writer, value) => {
    const my = localStorage.getItem('hashNickname')
    if (writer === my){
        return '익명'
    } else {
        return `익명${value}`
    }

}