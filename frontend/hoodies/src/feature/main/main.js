import { useEffect, useState } from "react";
import { freePreview, previewPros } from "../../common/data/dummyData";
import Header from "../../common/UI/header/header";
import Articles from "./mainComponent/articles";
import PopularText from "./mainComponent/popularText";
import Staffs from "./mainComponent/staffs";

const Main = () => {
  const [articles, setArticles] = useState([]);
  const [popularText, setPopularText] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // const response = 자유게시글 최근 5개 요청
    // const response1 = 추천 많은 글 5개 요청
    // const response2 = 많은 평가 받은 컨설턴트, 프로 정보(향후는 최근)
    // setArticles(response)
    // setPopularText(response1)
    // setStaffs(response2)
    setArticles(freePreview);
    setPopularText(freePreview);
    setStaffs(previewPros);
    setIsLoading(false);
  }, []);
  return (
    !isLoading &&
    articles &&
    popularText &&
    staffs && (
      <div>
        <Header />
        <Articles articles={articles} />
        <PopularText popularText={popularText} />
        <Staffs staffs={staffs} />
      </div>
    )
  );
};

export default Main;
