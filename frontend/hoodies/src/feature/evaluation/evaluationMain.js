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
import classes from "./evaluation.module.css";
import { Box } from "@mui/material";

const EvaluationMain = () => {
  const [selectedData, setSelectedData] = useState([]);
  const [data, setData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(1);
  const history = useHistory();

  useEffect(() => {
    setData(previewPros);
    setSelectedData(previewPros);
  }, []);

  const detailPageHandler = (staff) => {
    history.push({ pathname: "/pro/detail", state: staff });
  };

  const handleDropProduct = (event, newValue) => {
    event.preventDefault();
    const { value } = newValue;
    console.log('newvalue: ', newValue)
    const flag = newValue;
    setSelectedTab(newValue)
    console.log('selectedTab:',selectedTab)
    console.log('flag:',flag);
    if (flag === 0) {
      setSelectedData(data);
    } else {
      const tmpData = data.filter((el) => el.flag === flag);
      setSelectedData(tmpData);
    }
    // setSelectedDropValue(data.filter((data) => data.flag === value)[0].id);
  };

  return (
    <div>
      <Header />
      <Box sx={{borderBottom: 1, borderColor:'gray'}}>
        <Tabs sx={{fontFamily:'IBM Sans Plex KR', color:'red'}} value={selectedTab} onChange={handleDropProduct}>
          {CATEGORY_LIST.map((option) => (
            <Tab key={option.value} label={option.value} value={option.id}></Tab>
          ))}
        </Tabs>
      </Box>
      <h4>컨설턴트, 프로 평가 메인페이지</h4>
      <select onChange={handleDropProduct}>
        {CATEGORY_LIST.map((option) => (
          <option
            key={option.id}
            value={option.value}
            defaultValue="분류를 선택하세요"
          >
            {option.value}
          </option>
        ))}
      </select>
      <div>
        {selectedData.map((staff) => {
          return (
            <div
              className={classes.card}
              key={staff.id}
              onClick={() => {
                detailPageHandler(staff);
              }}
            >
              <h3>{staff.name}</h3>
              <p>{staff.email}</p>
              <p>{staff.description}</p>
            </div>
            // <tr key={article.id}>
            //   <td>{article.title}</td>
            //   <td>{article.writer}</td>
            //   <td>{article.createdAt}</td>
            //   <td>{article.viewCnt}</td>
            // </tr>
          );
        })}
      </div>
    </div>
  );
};

export default EvaluationMain;
