import { useEffect } from "react"
import { useState } from "react"
import Header from "../../../common/UI/header/header"

const AdminPage =() => {
    const [inquiries, setInquiries] = useState([])


    return (
    <div>
        <Header />
        <Container>
        <BoardTable articles={articles} />
        </Container>
    </div>
    )
}


export default AdminPage