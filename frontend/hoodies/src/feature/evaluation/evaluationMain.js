import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  CATEGORY_LIST,
  MAPPING_FLAG,
  previewPros,
} from "../../common/data/dummyData";
import Header from "../../common/UI/header/header";
import { getStaff, getStaffList, getStaffListByType } from "./evaluationAPI";
import classes from "./evaluation.module.css";
import { Box } from "@mui/material";
import styled from "styled-components";
import { coachMentor, consultantMentor, proMentor, totalMentor } from "../../common/data/styleData";

const EllipsisP = styled.p`
-webkit-box-orient: vertical;
text-overflow: ellipsis;
overflow: hidden;
-webkit-line-clamp: 1;
display: -webkit-box;
word-break: break-word;
`

const EvaluationMain = () => {
  const [selectedData, setSelectedData] = useState([]);
  const [data, setData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      // 배포용
      const fullList = await getStaffList();
      setData(fullList);
      setSelectedData(fullList);
      // setData(totalMentor);
      // setSelectedData(totalMentor);
    })();
  }, []);

  const handleDropProduct = async (event, newValue) => {
    event.preventDefault();
    const flag = newValue;
    setSelectedTab(newValue);
    // 배포용
    if (flag === 0) {
      setSelectedData(data);
    } else {
      const selectedList = await getStaffListByType(flag);
      setSelectedData(selectedList);
    }

    // if (flag === 0){
    //   setSelectedData(totalMentor)
    // } else if (flag === 1){
    //   setSelectedData(consultantMentor)
    // } else if (flag === 2){
    //   setSelectedData(proMentor)
    // } else{
    //   setSelectedData(coachMentor)
    // }
  
  };

  // 배포용
  const detailPageHandler = (staff) => {
    history.push({ pathname: "/pro/detail", state: staff._id });
  };

  // const detailPageHandler = (staff) => {
  //   history.push({ pathname: "/pro/detail", state: staff });
  // };

  return (
    <div>
      <Header />
      <Box sx={{ width: "100%", borderBottom: 1, borderColor: "gray" }}>
        <Tabs
          value={selectedTab}
          onChange={handleDropProduct}
          centered
          sx={{
            "& .Mui-selected": { color: "#1D3979" },
            "& .MuiTabs-indicator": { backgroundColor: "#1D3979" },
          }}
        >
          {CATEGORY_LIST.map((option) => (
            <Tab
              sx={{ fontFamily: "IBM Plex Sans KR", justifyContent: "center" }}
              key={option.value}
              label={option.label}
              value={option.id}
            ></Tab>
          ))}
        </Tabs>
      </Box>
 
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {selectedData.map((staff) => {
          return (
            <div
              className={classes.card}
              key={staff._id}
              style={{ margin: "auto", marginBottom: "3rem" }}
              onClick={() => {
                detailPageHandler(staff);
              }}
            >
              <h3>{staff.writer}</h3>
              {staff.email ? <p>{staff.email}</p> : <p>등록된 이메일이 없습니다.</p>}
              {staff.etc? <EllipsisP>{staff.etc}</EllipsisP> : <p>등록된 설명이 없습니다.</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EvaluationMain;
