import React, { useRef, useState } from 'react'
import Section from 'components/Layout/Section'
import 'assets/font/font.css'
import 'pages/Main.css'
import logo from 'assets/image/Mainlogo.png'
// import logo from 'assets/image/Signal.gif'npm i react-lottie
import projectimg from 'assets/image/Projectpic.png'
import signalweek from 'assets/image/Signalweek.png'
import SignalBtn from 'components/common/SignalBtn'
import { FullPage, Slide } from 'react-full-page'
import Lottie from 'react-lottie'
import fanfare from 'assets/lottie/fanfare.json'

function MainPage() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: fanfare,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }
  const [show, setShow] = useState(false)
  const fullPageRef = useRef()
  const handleChange = ({ from, to }) => {
    if ((from === 0 && to === 1) || (from === 2 && to === 1)) {
      setShow(true)
      console.log(show)
    } else {
      setShow(false)
    }
  }

  return (
    <div className="MainPage">
      <FullPage ref={fullPageRef} afterChange={handleChange} controls controlsProps={{ className: 'slide-navigation' }}>
        <Slide>
          <Section isBg={true}>
            <div className="left">
              <div className="text-wrap">
                <div className="text-item">내가 찾던 팀원</div>
                <div className="text-item">시그널에서 만나세요</div>
                <div className="btn-item">
                  <SignalBtn sigwidth="322px" sigheight="121px" sigfontsize="44px" sigborderradius={25} href="/posting">
                    지원하러 가기
                  </SignalBtn>
                </div>
              </div>
            </div>
            <div className="right">
              <div className="img-wrap">
                <img style={{ width: '750px', height: '420px' }} src={logo} alt="logo" />
              </div>
            </div>
          </Section>
        </Slide>
        <Slide>
          <Section>
            <div className="left">
              <div className="img-wrap">
                <div className="img-item">
                  {show ? (
                    <div className="fanfare-img">
                      <Lottie options={defaultOptions} height={600} width={600} isClickToPauseDisabled={true} />
                    </div>
                  ) : (
                    <></>
                  )}
                  <img className="main-2-img" src={projectimg} alt="projectimg" />
                </div>
              </div>
            </div>
            <div className="right">
              <div className="text-wrap">
                <div className="text-item">프로젝트를</div>
                <div className="text-item">편하게 진행하세요</div>
                <div className="btn-item">
                  <SignalBtn sigwidth="322px" sigheight="121px" sigfontsize="44px" sigborderradius={25}>
                    마이프로젝트
                  </SignalBtn>
                </div>
              </div>
            </div>
          </Section>
        </Slide>
        <Slide>
          <Section isBg={true}>
            <div className="left">
              <div className="text-wrap">
                <div className="text-item">여러분의 프로젝트를</div>
                <div className="text-item">평가받아보세요</div>
                <div className="btn-item">
                  <SignalBtn sigwidth="322px" sigheight="121px" sigfontsize="44px" sigborderradius={25}>
                    명예의 전당
                  </SignalBtn>
                </div>
              </div>
            </div>
            <div className="right">
              <div className="img-wrap">
                <div className="img-item">
                  <img style={{ width: '881px', height: '283px' }} src={signalweek} alt="signalweek" />
                </div>
              </div>
            </div>
          </Section>
        </Slide>
      </FullPage>
    </div>
  )
}
export default MainPage
