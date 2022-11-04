import { TextField } from '@mui/material';
import Rating from '@mui/material/Rating';
import { Fragment, useState } from 'react';
import { postEvaluation, getStaff } from './evaluationAPI';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';

const Rate = styled.div`
 display: flex;
 flex-direction: column;
`

const RateItem = styled.div`
    display: inline-flex;
`

const CreateEvaluation = (props) => {

    const history = useHistory();
    const [id, setId] = useState(props.id);
    const [personality, setPersonality] = useState(1);
    const [atmosphere, setAtmosphere] = useState(2);
    const [project, setProject] = useState(3);
    const [lecture, setLecture] = useState(4);
    const [consultation, setConsultation] = useState(5);
    const [studentComment, setStudentComment] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        const score = [personality, atmosphere, project, lecture, consultation]
        const response = await postEvaluation(id, score, studentComment)
        const newComments = await getStaff(id)
        console.log(newComments)
        props.setComments(newComments.evaluations)
        if (response) {
            alert('게시!')
            history.push({pathname: '/pro/detail', state:props.staff})
        }
        else {
            console.log('이런!')
            history.push({pathname: '/pro/detail', state:props.staff})
        }

    }

    return (
        <div>
            <Rate>
                <RateItem>
                    <p style={{margin:0}}>인품</p>
                    <Rating value={personality} onChange={(event, newValue) => {setPersonality(newValue)}} icon={<StarRateRoundedIcon/>} emptyIcon={<StarOutlineRoundedIcon/>}></Rating>
                </RateItem>
                <RateItem>
                    <p style={{margin:0}}>반 분위기</p>
                    <Rating value={atmosphere} onChange={(event, newValue) => {setAtmosphere(newValue)}} icon={<StarRateRoundedIcon/>} emptyIcon={<StarOutlineRoundedIcon/>}></Rating>
                </RateItem>
                <RateItem>
                    <p style={{margin:0}}>프로젝트 지도력</p>
                    <Rating value={project} onChange={(event, newValue) => {setProject(newValue)}} icon={<StarRateRoundedIcon/>} emptyIcon={<StarOutlineRoundedIcon/>}></Rating>
                </RateItem>
                <RateItem>
                    <p style={{margin:0}}>강의 전달력</p>
                    <Rating value={lecture} onChange={(event, newValue) => {setLecture(newValue)}} icon={<StarRateRoundedIcon/>} emptyIcon={<StarOutlineRoundedIcon/>}></Rating>
                </RateItem>
                <RateItem>
                    <p style={{margin:0}}>상담</p>
                    <Rating value={consultation} onChange={(event, newValue) => {setConsultation(newValue)}} icon={<StarRateRoundedIcon/>} emptyIcon={<StarOutlineRoundedIcon/>}></Rating>
                </RateItem>
            </Rate>
            <div>
                <TextField value={studentComment||''} onChange={(event) => {setStudentComment(event.target.value)}} label='한줄평을 입력해주세요.' variant='outlined'></TextField>
                <button onClick={handleSubmit}>등록</button>
            </div>
        </div>
    )
}

export default CreateEvaluation
