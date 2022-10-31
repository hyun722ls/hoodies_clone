import classes from "./articles.module.css";

const JobInfo = (props) => {
    return props.jobInfo.length ? (
        <div>
            {/*<div>*/}
            {/*    <span className={classes.title}>최신글</span>*/}
            {/*    <ReadMoreIcon*/}
            {/*        fontSize="large"*/}
            {/*        onClick={() => {*/}
            {/*            freeBoardHandler();*/}
            {/*        }}*/}
            {/*    />*/}
            {/*</div>*/}
            <table className={classes.table}>
                <thead>
                <tr>
                    <th>회사명</th>
                    <th>모집 분야</th>
                    <th>모집 기간</th>
                    <th>지원 방식</th>
                    <th>우대사항</th>
                </tr>
                </thead>
                <tbody>
                {props.jobInfo.map((Info) => {
                    return (
                        <tr
                            // onClick={() => {
                            //     detailPageHandler(Info);
                            // }}
                            key={Info.id}
                        >
                            <td>{Info.name}</td>
                            <td>{Info.job}</td>
                            <td>{Info.period}</td>
                            <td>{Info.method}</td>
                            <td>{Info.favor}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    ) : (
        <p>새로운 취업 정보가 없습니다.</p>
    );
};

export default JobInfo;