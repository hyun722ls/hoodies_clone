import { useEffect } from "react"
import { useState } from "react"
import Header from "../../../common/UI/header/header"
import { getInquiry } from "../authApi"
import BoardTable from "./boardTable"
import styled from "styled-components"

const Container = styled.div`
  margin: 24px;
`

const AdminPage =() => {
    const [inquiries, setInquiries] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // const response = 요청(게시글 20개가 한 페이지 = 제목, 닉네임, 시간, 조회수, 추천)
        // const response1 = 인기 게시글(제목, 날짜)
        // setArticles(response)
        // setPopularText(response1
        (async () => {
            const response = await getInquiry()
        setInquiries(response);
        setIsLoading(false);
        })()
      }, []);

    return !isLoading &&
    inquiries && (
      <div>
        <Header />
        <Container>
          <BoardTable articles={inquiries} />
        </Container>
      </div>
    )
}


export default AdminPage