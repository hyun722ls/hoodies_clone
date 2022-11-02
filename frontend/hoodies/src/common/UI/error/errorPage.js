import { useEffect } from "react"
import { useHistory } from "react-router-dom"

const ErrorPage = () => {
    const history = useHistory()
    useEffect(()=>{
        history.push('/404')
    }, [])
    return <div>에러 페이지</div>
}


export default ErrorPage