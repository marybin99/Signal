import React, { useState, useEffect } from 'react'
import noProfile from 'assets/image/noProfileImg.png'
import SignalBtn from 'components/common/SignalBtn'
import { Experimental_CssVarsProvider as CssVarsProvider, styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import cancleButton from '../../assets/image/x.png'
import Swal from 'sweetalert2'
import { Button } from '@mui/material'

const ComfirmButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.vars.palette.common.white,
  color: '#574B9F',
  borderColor: '#574B9F',
  border: '1px solid',
  height: 30,
  '&:hover': {
    backgroundColor: '#574B9F',
    color: theme.vars.palette.common.white,
    borderColor: theme.vars.palette.common.white,
  },
}))

function ProjectProfile({ Data }) {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleProjectCreate = () => {
    handleClose()

    Swal.fire({
      icon: 'warning',
      title: '퇴출 완료',
      text: '팀원이 퇴출되었습니다',
    })
  }

  const position = Data.position.name
  const warningCnt = Data.warningCnt
  const nickname = Data.nickname
  // const imageUrl = Data.profileImageUrl

  const [imageUrl, setimageUrl] = useState(Data.profileImageUrl)
  const [kickAble, setkickAble] = useState(false)

  const checkUser = () => {
    if (warningCnt >= 3) {
      setkickAble(true)
    }
    if (imageUrl === '/noImage.png') {
      setimageUrl(noProfile)
    }
  }

  useEffect(() => {
    checkUser()
  }, [kickAble])

  return (
    <div className="project-maintain-profile">
      <div className="project-maintain-profile-section">
        <div className="project-maintain-profile-image">
          <img src={noProfile} alt="" />
        </div>
        <div className="project-maintain-profile-text">
          <div className="project-maintain-profile-nickname">{nickname}</div>
          <div className="project-maintain-profile-position"> {position}</div>
        </div>
      </div>
      <div className="project-maintain-warning-section">
        <div className="project-maintain-warning">경고 {warningCnt}회</div>
        <div>
          {kickAble === true && (
            <>
              <SignalBtn
                className="project-maintain-ban"
                sigborderradius="50px"
                sigmargin="auto"
                sigfontsize="20px"
                sigwidth="80px"
                sigheight="40px"
                onClick={handleOpen}
              >
                퇴출
              </SignalBtn>
              <CssVarsProvider>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                  className="cancle-section"
                >
                  <div>
                    <DialogTitle id="alert-dialog-title" className="cancle-title">
                      선택 하시겠습니까?
                    </DialogTitle>
                    <img src={cancleButton} alt="cancleButton" className="cancle-button" onClick={handleClose} />
                    <DialogActions className="delete-button">
                      <ComfirmButton onClick={handleProjectCreate}>예</ComfirmButton>
                    </DialogActions>
                  </div>
                </Dialog>
              </CssVarsProvider>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectProfile
