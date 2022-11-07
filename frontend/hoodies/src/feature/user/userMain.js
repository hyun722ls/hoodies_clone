import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Header from "../../common/UI/header/header";
import CustomModal from "../../common/UI/modal/customModal";
import { checkNickname, updateNickname, updatePassword } from "../user/userApi"
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
const StyledSmall = styled.div`
  text-align: left;
  font-size: smaller;
`
const StyledInput = styled.input`
  margin: 0;
`

const UserMain = () => {
    const [nickname, setNickname] = useState('')
    const [email, setEmail] = useState('')
    const [nicknameModalOpen, setNicknameModalOpen] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [originalPassword, setOriginalPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isNewNicknameDuplicated, setIsNewNicknameDuplicated] = useState(false)
    const [newNickname, setNewNickname] = useState('')
    const [isPasswordDuplicated, setIsPasswordDuplicated] = useState(false)
    const history = useHistory();

    useEffect(()=>{
        setNickname(localStorage.getItem('nickname'))
        setEmail(localStorage.getItem('email'))
    }, [nickname])

    useEffect(()=>{
        if (newPassword.trim() === confirmPassword.trim() | !confirmPassword){
            setIsPasswordDuplicated(false)
        } else {
            setIsPasswordDuplicated(true)
        }
    }, [newPassword, confirmPassword])

    const closePasswordModal = () => {
        setConfirmPassword('')
        setOriginalPassword('')
        setNewPassword('')
        setIsPasswordDuplicated(false)
        setPasswordModalOpen(false)
    }

    const newNicknameChangeHandler = (event) => {
        event.preventDefault()
        setIsNewNicknameDuplicated(false)
        setNewNickname(event.target.value)
    }

    const newNicknameDuplicatedHandler = async (event) => {
        event.preventDefault();
        if (newNickname.trim()) {
            const response = await checkNickname(newNickname.trim())
            if (response.cnt === 0) {
                setIsNewNicknameDuplicated(true)
                setNewNickname(newNickname.trim())
                alert("닉네임 사용가능")
            } else {
                alert("중복된 닉네임입니다")
                setNewNickname("")
            }
        }
    };

    const toUserBoard = (event) => {
        event.preventDefault();
        history.push('/user/board')
    }

    // const nicknameModifyHandler = async (event) => {
    //     event.preventDefault()
    //     if (isNewNicknameDuplicated === true) {
    //         const response = await updateNickname(newNickname.trim())
    //         if (response.statusCode === '200') {
    //             localStorage.setItem('nickname', newNickname.trim())
    //             localStorage.setItem('hashNickname', response.hashNickname)
    //             setNickname(localStorage.getItem('nickname'))
    //             setNewNickname('')
    //             setNicknameModalOpen(false)
    //             setIsNewNicknameDuplicated(false)
    //             alert('변경성공')
    //         } else {
    //             alert('변경실패')
    //         }
    //     } else {
    //         alert('중복검사를 먼저 해주세요')
    //     }
    // }
    const openWithdrawalModal = (event) => {
        event.preventDefault()
        Swal.fire({
            title: 'Mattermost로 문의해 주세요',
            icon: 'info',
        })
    } 


    const originiPasswordChangeHandler = (event) => {
      event.preventDefault()
      setOriginalPassword(event.target.value)
    }

    const newPasswordChangeHandler = (event) => {
        event.preventDefault()
        const tmpPassword = event.target.value
        setNewPassword(tmpPassword)
    }

    const confirmPasswordChangeHandler = (event) => {
        event.preventDefault()
        const tmpPassword1 = event.target.value
        setConfirmPassword(tmpPassword1)

    }


    const passwordModifyHandler = async (event) => {
        event.preventDefault()
        if (newPassword === confirmPassword) {
            const response = await updatePassword({
                originalPassword,
                password: newPassword,
            })
            if (response.statusCode === '200') {
                setConfirmPassword('')
                setNewPassword('')
                setOriginalPassword('')
                alert('변경성공')
            } else {
                alert('변경실패')
            }
        } else {
            alert('비밀번호가 일치하지 않습니다')
        }
    }

    // const openNicknameModal = async (event) => {
    //     event.preventDefault()
    //     const steps = ['1', '2']
    //     const nicknameModal = Swal.mixin({
    //         title: '변경할 닉네임을 입력하세요!',
    //         input: 'text',
    //         showCancelButton: true,
    //         showDenyButton: true,
    //         showConfirmButton: isNewNicknameDuplicated,
    //         denyButtonText: isNewNicknameDuplicated ? '사용 가능' : '중복 검사',
    //         denyButtonColor: 'blue',
    //         reverseButtons: true,
    //         returnInputValueOnDeny: true,
    //         preConfirm: async () => {
    //         },
    //         preDeny: async (value) => {
    //             if(value) {
    //                 const response = await checkNickname(value)
    //                 if (response.cnt === 0) {
    //                     setIsNewNicknameDuplicated(true)
    //                 } else {
    //                     setIsNewNicknameDuplicated(false)
    //                     Swal.showValidationMessage('중복된 닉네임입니다.')
    //                 }
    //             }
    //         },
    //     })
    //     const values = []
    //     let currentStep

    //     for (currentStep = 0; currentStep < steps.length;) {
    //         const result = await nicknameModal.fire({
    //             inputValue: values[currentStep],
    //         })
    //     }
    // }

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
                    if (password === password2) {
                        const response = await updatePassword({ password })
                        if (response.statusCode !== '200') {
                            Swal.showValidationMessage('비밀번호 변경에 실패했습니다.')
                        }
                    } else {
                        Swal.showValidationMessage('비밀번호가 일치하지 않습니다.')
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

    let modalPasswordForm = (
        <form onSubmit={passwordModifyHandler}>
            <span>기존 패스워드</span>
            <div>
                <input
                type="password"
                value={originalPassword}
                onChange={originiPasswordChangeHandler}
                />
            </div>
            <span>변경 패스워드</span>
            <div>
                <input
                    type="password"
                    value={newPassword}
                    onChange={newPasswordChangeHandler}
                />
            </div>
            <span>변경 패스워드 확인</span>
            <div>
                <StyledInput
                    type="password"
                    value={confirmPassword}
                    onChange={confirmPasswordChangeHandler}
                />
                {isPasswordDuplicated && <StyledSmall>암호가 일치하지 않습니다</StyledSmall>}
            </div>
            <div>
                <button type="submit">전송</button>
            </div>
        </form>
    );

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
            <CustomModal open={passwordModalOpen} close={closePasswordModal} header="">
                {modalPasswordForm}
            </CustomModal>
        </div>
    );
};

export default UserMain;
