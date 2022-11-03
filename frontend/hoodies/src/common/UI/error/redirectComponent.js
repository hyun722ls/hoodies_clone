import { useEffect } from "react"
import { useHistory } from "react-router-dom"

const RedirectComponent = () => {
    const history = useHistory()
    useEffect(()=> {
        history.push('/index')
    }, [])
    return <div></div>
}

export default RedirectComponent