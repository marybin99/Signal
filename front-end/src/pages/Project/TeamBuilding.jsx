import React, { useState, useEffect } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import '../../assets/styles/teamBuilding.css'
import MemoModal from '../../components/Memo/MemoModal'
import { Experimental_CssVarsProvider as CssVarsProviderm, styled } from '@mui/material/styles'
import moment from 'moment'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Paging from 'components/common/Paging'
import { Button } from '@mui/material'
import SignalBtn from 'components/common/SignalBtn'
import { StateCode } from 'components/common/TeamSelectStateCode'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import ProjectInviteConfirm from 'components/Project/ProjectInviteConfirm'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import cancleButton from '../../assets/image/x.png'
import Swal from 'sweetalert2'
import api from 'api/Api.js'
import LaptopIcon from '@mui/icons-material/Laptop'
import AlertModal from 'components/common/AlertModal'

const ImageButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#574B9F',
  color: theme.vars.palette.common.white,
  height: 30,
  '&:hover': {
    backgroundColor: theme.vars.palette.common.white,
    color: '#574B9F',
  },
}))

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

const MeetingButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FF4242',
  color: theme.vars.palette.common.white,
  height: 30,
  '&:hover': {
    backgroundColor: theme.vars.palette.common.white,
    color: '#FF4242',
  },
}))

function TeamSelect() {
  const location = useLocation()
  const navigate = useNavigate()

  const postingSeq = location.state.postingSeq
  const [applyList, setApplyList] = useState([])

  // ????????? ?????? ????????? ????????? ????????? ?????? ?????? ?????? ???????????? ????????? ?????? ?????? ???????????? ???
  const [teamTotalCnt, setTeamTotalCnt] = useState(0)
  const [selectCnt, setSelectCnt] = useState(1)
  const [waitCnt, setWaitCnt] = useState(2)
  const [valid, setValid] = useState('true')

  // ?????????????????? ?????? ??????
  const [size] = useState(8)
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(0)

  const handlePageChange = (page) => {
    setPage(page)
  }

  // ???????????? alert open
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleConfirmOpen = () => {
    setConfirmOpen(true)
  }

  const handleConfirmClose = () => {
    setConfirmOpen(false)
  }

  // ???????????? alert open
  const [alertOpen, setAlertOpen] = useState(false)
  const [meetingApplySeq, setMeetingApplySeq] = useState('')

  const handleAlertOpen = (applySeq) => {
    setAlertOpen(true)
    setMeetingApplySeq(applySeq)
  }

  const rows = []
  Array.from(applyList).forEach((item) => {
    rows.push({
      applySeq: item.applySeq,
      nickname: item.nickname,
      meetingDt: item.meetingDt,
      positionCode: item.positionCode,
      userSeq: item.userSeq,
      applyCode: item.applyCode,
    })
  })
  const rowLen = rows.length
  if (rowLen !== size && rowLen !== 0) {
    for (let i = 0; i < size - rowLen; i++)
      rows.push({
        applySeq: '',
        nickname: '',
        meetingDt: '',
        positionCode: '',
        userSeq: '',
        applyCode: '',
      })
  }

  // ???????????? ??? alert close
  // ????????? ???????????? : nickname, ???????????? ?????????(owner[?????? true, ?????? false]), applySeq
  const handleToMeeting = (e) => {
    setAlertOpen(false)
    // ????????? ????????? ??????
    window.open(
      `/beforemeeting?nickname=${sessionStorage.getItem(
        'nickname'
      )}&owner=${true}&applySeq=${meetingApplySeq}&postingSeq=${postingSeq}`,
      '_blank'
    )
  }

  const applyListFetch = async (param) => {
    try {
      await api
        .get(process.env.REACT_APP_API_URL + '/apply/writer/' + postingSeq, {
          params: {
            page: param,
            size,
          },
        })
        .then((res) => {
          setApplyList(res.data.body.applyList)

          setSelectCnt(res.data.body.selectCnt)
          setWaitCnt(res.data.body.waitCnt)
        })

      await api.get(process.env.REACT_APP_API_URL + '/apply/writer/count/' + postingSeq).then((res) => {
        setCount(res.data.body.count)
      })

      await api.get(process.env.REACT_APP_API_URL + '/posting/' + postingSeq).then((res) => {
        setTeamTotalCnt(
          res.data.body.postingPositionList.reduce((sum, value) => {
            return sum + value.positionCnt
          }, 0)
        )
      })
      // ???????????? ?????? ???????????? ???????????? >> apply/writer?????? ????????? ????????????.
    } catch (error) {
      console.log(error)
    }
  }

  const checkButtonValid = () => {
    if (selectCnt + waitCnt === teamTotalCnt) setValid('false')
  }

  const projectPost = async () => {
    try {
      await api.post(process.env.REACT_APP_API_URL + '/project/' + postingSeq)
    } catch (error) {
      console.log(error)
    }
    handleConfirmClose()
    const timerInterval = () => setInterval(() => {}, 100)
    Swal.fire({
      title: '???????????? ?????? ??????!',
      html: '???????????? ????????? ?????? ???????????????! ?????? ??????????????? ??????????????????!',
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        timerInterval()
      },
      willClose: () => {
        clearInterval(timerInterval)
        navigate('/')
      },
    })
  }

  const stateCodeColor = (stateCode) => {}

  useEffect(() => {
    applyListFetch(page)
  }, [page])

  useEffect(() => {
    checkButtonValid()
  }, [selectCnt, waitCnt])

  useEffect(() => {}, [confirmOpen])

  return (
    <CssVarsProviderm>
      <div className="team-building-page-container">
        <div className="team-building-container">
          <div className="team-building-header">
            <div className="team-building-title">??? ??????</div>
          </div>
          <div className="team-selct-table">
            <TableContainer>
              <Table>
                <TableHead className="team-building-table-head">
                  <TableRow>
                    <TableCell align="center"> ????????? </TableCell>
                    <TableCell align="center"> ?????????????????? </TableCell>
                    <TableCell align="center"> ?????? ?????? ??????</TableCell>
                    <TableCell align="center"> ????????? </TableCell>
                    <TableCell align="center"> ?????? </TableCell>
                    <TableCell align="center"> ???????????? </TableCell>
                    <TableCell align="center"> ?????? </TableCell>
                    <TableCell align="center">
                      {selectCnt}/{teamTotalCnt}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow
                      key={index}
                      value={row.applySeq}
                      sx={[
                        {
                          '&:hover': { backgroundColor: 'rgba(221, 219, 236, 0.5)', transition: '0.3s' },
                        },
                      ]}
                    >
                      <TableCell align="center">{row.nickname}</TableCell>
                      <TableCell align="center">
                        {row.applyCode.name !== '?????????' ? (
                          ''
                        ) : (
                          <MeetingButton onClick={() => handleAlertOpen(row.applySeq)} startIcon={<LaptopIcon />}>
                            ????????????
                          </MeetingButton>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {row.applySeq === '' ? '' : moment(row.meetingDt).format('MM/DD HH:00')}
                      </TableCell>
                      <TableCell align="center">{row.applySeq === '' ? '' : row.positionCode.name}</TableCell>
                      <TableCell align="center">
                        {row.applySeq === '' ? '' : <MemoModal applySeq={row.applySeq} />}
                      </TableCell>
                      <TableCell align="center">
                        {row.applySeq === '' ? (
                          ''
                        ) : (
                          <Link to={'/applydetail'} state={{ applySeq: row.applySeq, userSeq: row.userSeq }}>
                            <ImageButton startIcon={<AccountBoxIcon />}>???????????????</ImageButton>
                          </Link>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {row.applySeq === '' ? (
                          ''
                        ) : (
                          <ProjectInviteConfirm
                            apply={row}
                            postingSeq={postingSeq}
                            valid={valid}
                          ></ProjectInviteConfirm>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {row.applySeq === '' ? (
                          ''
                        ) : (
                          <StateCode
                            color={() => stateCodeColor(row.applyCode)}
                            className="team-project-building-state-code"
                          >
                            {row.applyCode.name}
                          </StateCode>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  <AlertModal
                    msg="?????? ???????????????????"
                    open={alertOpen}
                    onClick={handleToMeeting}
                    onClose={() => setAlertOpen(false)}
                  ></AlertModal>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className="team-building-submit-button">
            <SignalBtn
              sigwidth="200px"
              sigheight="60px"
              sigfontsize="24px"
              sigborderradius={15}
              onClick={handleConfirmOpen}
            >
              ???????????? ??????
            </SignalBtn>
            <Dialog
              open={confirmOpen}
              onClose={handleConfirmClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              className="cancle-section"
            >
              <div>
                <DialogTitle id="alert-dialog-title" className="cancle-title">
                  ??????????????? ?????????????????????????
                </DialogTitle>
                <img src={cancleButton} alt="cancleButton" className="cancle-button" onClick={handleConfirmClose} />
                <DialogActions className="delete-button">
                  <ComfirmButton onClick={projectPost}>???</ComfirmButton>
                </DialogActions>
              </div>
            </Dialog>
          </div>

          <div>
            <Paging page={page} count={count} setPage={handlePageChange} size={size} />
          </div>
        </div>
      </div>
    </CssVarsProviderm>
  )
}

export default TeamSelect
