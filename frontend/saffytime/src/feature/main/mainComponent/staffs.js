import { useHistory } from "react-router-dom";
import classes from "./card.module.css";
import PageviewIcon from "@mui/icons-material/Pageview";

const Staffs = (props) => {
  const history = useHistory();
  const evaluationPageHandler = () => {
    history.push("/pro");
  };

  const detailPageHandler = (staff) => {
    history.push({ pathname: "/consultant/detail", state: staff });
  };

  return props.staffs.length ? (
    <div>
      <div>
        <span className={classes.title}>프로님들</span>
        <PageviewIcon onClick={evaluationPageHandler} />
      </div>
      <div>
        {props.staffs.map((staff) => {
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
  ) : (
    <p>작성된 글이 없습니다.</p>
  );
};

export default Staffs;
