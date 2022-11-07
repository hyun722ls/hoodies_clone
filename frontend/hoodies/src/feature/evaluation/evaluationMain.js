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
      const fullList = await getStaffList();
      setData(fullList);
      setSelectedData(fullList);
      console.log(fullList);
    })();
  }, []);

  const handleDropProduct = async (event, newValue) => {
    event.preventDefault();
    console.log("newvalue: ", newValue);
    const flag = newValue;
    setSelectedTab(newValue);
    console.log("selectedTab:", selectedTab);
    console.log("flag:", flag);
    if (flag === 0) {
      setSelectedData(data);
    } else {
      const selectedList = await getStaffListByType(flag);
      console.log(selectedList);
      setSelectedData(selectedList);
    }
    // setSelectedDropValue(data.filter((data) => data.flag === value)[0].id);
  };

  const detailPageHandler = (staff) => {
    history.push({ pathname: "/pro/detail", state: staff._id });
  };

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
      <h4 style={{ display: "flex", justifyContent: "center" }}>PRO 페이지</h4>
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
              {staff.email ? <p>{staff.email}</p> : <p>E-mail N/A</p>}
              <EllipsisP>{staff.etc}</EllipsisP>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EvaluationMain;
