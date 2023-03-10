import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import Paging from 'components/common/Paging'
import api from 'api/Api'
import SignalBtn from 'components/common/SignalBtn'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { useNavigate } from 'react-router-dom'
import 'assets/styles/table.css'
import Swal from 'sweetalert2'
import moment from 'moment'

function PostingApply() {
  const navigate = useNavigate()
  const userSeq = sessionStorage.getItem('userSeq')

  const [size] = useState(6)
  const [applyPage, setApplyPage] = useState(1)
  const [postingPage, setPostingPage] = useState(1)
  const [applyCount, setApplyCount] = useState(0)
  const [postingCount, setPostingCount] = useState(0)

  const [rowsApplyForm, setRowsApplyForm] = useState([])
  const [rowsPostingForm, setRowsPostingForm] = useState([])

  const [change, setChange] = useState(false)

  const applyListFetch = async () => {
    try {
      await api.get(process.env.REACT_APP_API_URL + '/apply/applyer/count/' + userSeq).then((res) => {
        setApplyCount(res.data.body.count)
      })
      await api
        .get(process.env.REACT_APP_API_URL + '/apply/applyer/' + userSeq + '?page=' + applyPage + '&size=' + size)
        .then((res) => {
          setRowsApplyForm(res.data.body)
        })
    } catch (error) {
      console.log(error)
    }
  }

  const postingListFetch = async () => {
    try {
      await api.get(process.env.REACT_APP_API_URL + '/posting/post/count/' + userSeq).then((res) => {
        setPostingCount(res.data.body.count)
      })
      await api
        .get(process.env.REACT_APP_API_URL + '/posting/post/' + userSeq + '?page=' + postingPage + '&size=' + size)
        .then((res) => {
          setRowsPostingForm(res.data.body.postingList)
        })
    } catch (error) {
      console.log(error)
    }
  }

  const handleApplyPageChange = (page) => {
    setApplyPage(page)
  }
  const handlePostingPageChange = (page) => {
    setPostingPage(page)
  }

  const applyRows = []
  Array.from(rowsApplyForm).forEach((item) => {
    applyRows.push({
      userSeq: item.userSeq,
      applySeq: item.applySeq,
      state: item.stateCode.name,
      subject: item.subject,
      meetingDt: moment(item.meetingDt).format('YYYY-MM-DD HH:mm'),
    })
  })
  const applyRowLen = applyRows.length

  if (applyRowLen !== size && applyRowLen !== 0) {
    for (let i = 0; i < size - applyRowLen; i++)
      applyRows.push({
        applySeq: '',
        state: ' ',
        subject: ' ',
        meetingDt: ' ',
      })
  }

  const postingRows = []
  Array.from(rowsPostingForm).forEach((item) => {
    postingRows.push({
      postingSeq: item.postingSeq,
      state: item.postingCode.name,
      subject: item.subject,
    })
  })
  const postingRowLen = postingRows.length
  if (postingRowLen !== size && postingRowLen !== 0) {
    for (let i = 0; i < size - postingRowLen; i++)
      postingRows.push({
        postingSeq: '',
        state: ' ',
        subject: ' ',
      })
  }

  const handleProjectAccept = async (applySeq) => {
    try {
      await api.put(process.env.REACT_APP_API_URL + '/posting/member/confirm', {
        applySeq,
        select: true,
      })
      setChange(!change)
      location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  const handleProjectRefuse = async (applySeq) => {
    try {
      await api.put(process.env.REACT_APP_API_URL + '/posting/member/confirm', {
        applySeq,
        select: false,
      })
      setChange(!change)
      location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  const handlePostingDelete = async (postingSeq) => {
    try {
      await api.delete(process.env.REACT_APP_API_URL + '/posting/' + postingSeq)
    } catch (error) {
      console.log(error)
    }
  }

  const [tab, setTab] = useState(0)

  useEffect(() => {
    applyListFetch()
  }, [applyPage, tab])

  useEffect(() => {
    postingListFetch()
  }, [postingPage, tab])

  return (
    <div className="my-posting-apply">
      <div className="my-profile-tab-list">
        <div
          className={`my-profile-tab ${tab === 0 ? 'active' : ''}`}
          onClick={() => {
            setTab(0)
          }}
        >
          ????????? ??????
        </div>
        <div
          className={`my-profile-tab ${tab === 1 ? 'active' : ''}`}
          onClick={() => {
            setTab(1)
          }}
        >
          ????????? ??????
        </div>
      </div>
      <div className="my-profile-table">
        {tab === 0 ? (
          applyRowLen === 0 ? (
            <div className="my-profile-no-table-container">
              <div className="my-profile-no-table">????????? ????????? ????????????.</div>
            </div>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead className="my-profile-table-head">
                    <TableRow>
                      <TableCell align="center">??????</TableCell>
                      <TableCell align="center">????????? ??????</TableCell>
                      <TableCell align="center">??????????????????</TableCell>
                      <TableCell align="center">??????????????????</TableCell>
                      <TableCell align="center">??????</TableCell>
                      <TableCell align="center">?????????</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applyRows.map((row, index) => (
                      <TableRow key={index} className="my-profile-table">
                        <TableCell align="center">{row.state}</TableCell>
                        <TableCell align="left">{row.subject}</TableCell>
                        <TableCell align="center">
                          {row.state === '?????????' ? (
                            // ????????? ???????????? : nickname, ???????????? ?????????(owner[?????? true, ?????? false]), applySeq
                            // ??????????????? ????????? ?????????
                            <SignalBtn
                              onClick={() =>
                                window.open(
                                  `/beforemeeting?nickname=${sessionStorage.getItem(
                                    'nickname'
                                  )}&owner=${false}&applySeq=${row.applySeq}`,
                                  '_blank'
                                )
                              }
                            >
                              ??????
                            </SignalBtn>
                          ) : (
                            ' '
                          )}
                        </TableCell>
                        <TableCell align="center">{row.meetingDt}</TableCell>
                        <TableCell align="center">
                          {row.state === '??????' ? (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-evenly',
                              }}
                            >
                              <SignalBtn
                                startIcon={<TaskAltIcon />}
                                onClick={() => {
                                  handleProjectAccept(row.applySeq)
                                }}
                              >
                                ??????
                              </SignalBtn>
                              <SignalBtn
                                startIcon={<HighlightOffIcon />}
                                onClick={() => {
                                  handleProjectRefuse(row.applySeq)
                                }}
                              >
                                ??????
                              </SignalBtn>
                            </div>
                          ) : (
                            ' '
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {row.subject !== ' ' ? (
                            <SignalBtn
                              onClick={() => {
                                navigate('/applydetail', { state: { applySeq: row.applySeq, stateCode: row.state } })
                              }}
                            >
                              ??????
                            </SignalBtn>
                          ) : (
                            ' '
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Paging page={applyPage} count={applyCount} setPage={handleApplyPageChange} size={size} />
            </>
          )
        ) : postingRowLen === 0 ? (
          <div className="my-profile-no-table-container">
            <div className="my-profile-no-table">????????? ????????? ????????????.</div>
          </div>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead className="my-profile-table-head">
                  <TableRow>
                    <TableCell align="center">??????</TableCell>
                    <TableCell align="center">????????? ??????</TableCell>
                    <TableCell align="center">??? ??????</TableCell>
                    <TableCell align="center">??????</TableCell>
                    <TableCell align="center">??????</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {postingRows.map((row, index) => (
                    <TableRow key={index} className="my-profile-table">
                      <TableCell align="center">{row.state}</TableCell>
                      <TableCell align="left">{row.subject}</TableCell>
                      <TableCell align="center">
                        {row.state === '?????? ???' ? (
                          <SignalBtn
                            onClick={() => {
                              navigate('/teambuilding', { state: { postingSeq: row.postingSeq } })
                            }}
                          >
                            ????????????
                          </SignalBtn>
                        ) : (
                          ' '
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {row.state === '?????? ???' ? (
                          <SignalBtn
                            onClick={() => {
                              navigate('/postingModify', { state: { postingSeq: row.postingSeq } })
                            }}
                          >
                            ??????
                          </SignalBtn>
                        ) : (
                          ' '
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {row.subject === ' ' || row.state === '?????? ??????' || row.state === '?????? ??????' ? (
                          ''
                        ) : (
                          <SignalBtn
                            onClick={() => {
                              const swalWithBootstrapButtons = Swal.mixin({
                                customClass: {
                                  cancelButton: 'btn btn-danger',
                                  confirmButton: 'btn btn-success',
                                },
                                buttonsStyling: true,
                              })

                              swalWithBootstrapButtons
                                .fire({
                                  title: '????????? ?????????????????????????',
                                  text: '????????? ????????? ?????? ????????? ??? ????????????',
                                  icon: 'warning',
                                  showCancelButton: true,
                                  confirmButtonText: '???',
                                  cancelButtonText: '?????????',
                                })
                                .then((result) => {
                                  if (result.isConfirmed) {
                                    swalWithBootstrapButtons.fire('??????', '????????? ?????????????????????', 'success')
                                    handlePostingDelete(row.postingSeq)
                                  }
                                })
                            }}
                          >
                            ??????
                          </SignalBtn>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Paging page={postingPage} count={postingCount} setPage={handlePostingPageChange} size={size} />
          </>
        )}
      </div>
    </div>
  )
}

export default PostingApply
