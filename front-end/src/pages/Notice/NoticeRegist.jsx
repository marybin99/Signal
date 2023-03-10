import React, { useState } from 'react'
import { TextField } from '@mui/material'
import SignalBtn from 'components/common/SignalBtn'
import { useNavigate } from 'react-router-dom'
import AlertModal from 'components/common/AlertModal'
import 'assets/styles/notice.css'
import api from 'api/Api'

const inputStyle = {
  backgroundColor: '#DDDBEC',
  width: '1000px',
  marginBottom: '28px',
  '& label.Mui-focused': {
    color: '#574b9f',
  },
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#574b9f',
    },
  },
}

function NoticeRegist() {
  const [inputs, setInputs] = useState({
    content: '',
    title: '',
    userSeq: sessionStorage.getItem('userSeq'),
  })
  const [alertOpen, setAlertOpen] = useState(false)
  const handleInput = (e) => {
    const { name, value } = e.target
    const nextInputs = { ...inputs, [name]: value }
    setInputs(nextInputs)
  }
  const handleNoticeRegist = () => {
    api.post(process.env.REACT_APP_API_URL + '/admin/notice', JSON.stringify(inputs)).then((res) => setAlertOpen(true))
  }
  const navigate = useNavigate()
  const handleAlert = (e) => {
    setAlertOpen(false)
    navigate(`/notice`)
  }
  return (
    <div className="notice-page-container">
      <div className="notice-regist-container">
        <div className="notice-regist-header">공지사항 작성</div>
        <div className="notice-regist-main">
          <div className="notice-regist-title">
            <label>제목</label>
            <TextField id="filled-multiline-flexible" name="title" multiline sx={inputStyle} onChange={handleInput} />
          </div>
          <div className="notice-regist-content">
            <label>내용</label>
            <TextField
              id="filled-multiline-flexible"
              rows={10}
              multiline
              sx={inputStyle}
              name="content"
              onChange={handleInput}
            />
          </div>
          <div>
            <SignalBtn
              sigwidth="84px"
              sigheight="45px"
              sigfontsize="24px"
              sigborderradius={14}
              sigmargin="12.5px auto"
              variant="contained"
              onClick={handleNoticeRegist}
            >
              완료
            </SignalBtn>
            <AlertModal open={alertOpen} onClick={handleAlert} msg="등록되었습니다."></AlertModal>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoticeRegist
