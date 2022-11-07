import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Header from "../../common/UI/header/header";
import { updatePassword } from "../user/userApi"
import Swal from "sweetalert2";

const StyledCard = styled.div`
  margin: 8px auto 0 auto;
  max-width: 480px;
  padding: 12px 0;
  box-sizing: border-box;
  border: 1px solid #EDEDED;
  border-radius: 12px;
  &:first-of-type {
    margin-top: 24px;
  }
`
const StyledProfile = styled.div`
  margin: 12px 24px;
`

const StyledP = styled.p`
  padding: 6px 24px;
  margin: 6px 0px;
  &:hover {
    cursor: pointer;
  }
`

const StyledH4 = styled.h4`
  padding: 0;
  margin: 0;
`
const StyledH5 = styled.h5`
  padding: 0;
  margin: 0;
`
const UserMain = () => {
    const [nickname, setNickname] = useState('')
    const [email, setEmail] = useState('')
    const history = useHistory();

    useEffect(()=>{
        setNickname(localStorage.getItem('nickname'))
        setEmail(localStorage.getItem('email'))
    }, [nickname])

    const toUserBoard = (event) => {
        event.preventDefault();
        history.push('/user/board')
    }

    const openWithdrawalModal = (event) => {
        event.preventDefault()
        Swal.fire({
            title: 'Mattermost로 문의해 주세요',
            icon: 'info',
        })
    } 

    const openPasswordModal = (event) => {
        event.preventDefault()
        Swal.fire({
            title: '비밀번호 변경',
            html: '<form><input id="password" type="password" class="swal2-input" placeholder="비밀번호"></input><input id="password2" type="password" class="swal2-input" placeholder="비밀번호 확인"></input></form>',
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소',
            reverseButtons: true,
            preConfirm: async () => {
                const password = document.getElementById('password').value
                const password2 = document.getElementById('password2').value
                if (password && password2) {
                    if (password.length < 8) {
                        Swal.showValidationMessage('8자 이상 입력해주세요.')
                    } else {
                        if (password === password2) {
                            const response = await updatePassword({ password })
                            if (response.statusCode !== '200') {
                                Swal.showValidationMessage('비밀번호 변경에 실패했습니다.')
                            }
                        } else {
                            Swal.showValidationMessage('비밀번호가 일치하지 않습니다.')
                        }
                    }
                } else {
                    Swal.showValidationMessage('비밀번호를 입력해주세요.')
                }
            },
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: '비밀번호 변경에 성공했습니다.',
                    icon: 'success',
                    timer: 2000,
                })
            }
        })
    }

    return (
        <div>
            <Header />
            <StyledCard>
                <StyledProfile>
                    <StyledH4>{nickname}</StyledH4>
                    <StyledH5>{email}</StyledH5>
                </StyledProfile>
            </StyledCard>
            <StyledCard>
                {/* <StyledP onClick={openNicknameModal}>닉네임 변경</StyledP> */}
                <StyledP onClick={openPasswordModal}>비밀번호 변경</StyledP>
                <StyledP onClick={toUserBoard}>내가 쓴 글</StyledP>
                <StyledP onClick={openWithdrawalModal}>회원탈퇴</StyledP>
            </StyledCard>
        </div>
    );
};

export default UserMain;
