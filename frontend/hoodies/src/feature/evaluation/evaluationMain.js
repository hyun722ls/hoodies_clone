import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import {
  CATEGORY_LIST,
  MAPPING_FLAG,
  previewPros,
} from "../../common/data/dummyData";
import Header from "../../common/UI/header/header";
import {getStaff, getStaffList, getStaffListByType} from './evaluationAPI'
import classes from "./evaluation.module.css";
import { Box } from "@mui/material";

const EvaluationMain = () => {
  const [selectedData, setSelectedData] = useState([]);
  const [data, setData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const history = useHistory();

  useEffect(() => {
    (async() =>{
      const fullList = await getStaffList()
      setData(fullList.content)
      setSelectedData(fullList.content)
      console.log(fullList.content)
    })()
  }, []);

  const handleDropProduct = async (event, newValue) => {
    event.preventDefault();
    console.log('newvalue: ', newValue)
    const flag = newValue;
    setSelectedTab(newValue)
    console.log('selectedTab:',selectedTab)
    console.log('flag:',flag);
    if (flag === 0) {
      setSelectedData(data);
    } else {
      const selectedList = await getStaffListByType(flag)
      console.log(selectedList)
      setSelectedData(selectedList.content)
    }
    // setSelectedDropValue(data.filter((data) => data.flag === value)[0].id);
  };

  const detailPageHandler = (staff) => {
    history.push({ pathname: "/pro/detail", state: staff });
  };

  return (
    <div>
      <Header />
      <Box sx={{width:'100%', borderBottom: 1, borderColor:'gray'}}>
        <Tabs value={selectedTab} onChange={handleDropProduct}>
          {CATEGORY_LIST.map((option) => (
            <Tab sx={{fontFamily:'IBM Plex Sans KR', justifyContent:'center'}} key={option.value} label={option.label} value={option.id}></Tab>
          ))}
        </Tabs>
      </Box>
      <h4 style={{display:'flex', justifyContent:'center'}}>PRO 페이지</h4>
      <div style={{display:'flex', flexWrap:'wrap'}}>
        {selectedData.map((staff) => {
          return (
            <div
              className={classes.card}
              key={staff._id}
              style={{margin:'auto', marginBottom:'3rem'}}
              onClick={() => {
                detailPageHandler(staff);
              }}
            >
              <h3>{staff.writer}</h3>
              <p>{staff.email}</p>
              <p>{staff.etc}</p>
              <p>{staff.scores}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EvaluationMain;
