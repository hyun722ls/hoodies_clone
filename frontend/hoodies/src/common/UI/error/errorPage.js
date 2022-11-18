import { Fragment, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import Header from '../header/header'
import styled from "styled-components";
import nootnoot from './meme6.gif'
import nootnootAfter from './after.gif'
import { useMediaQuery } from "react-responsive";

const ErrorPage = () => {

    const [imageDisplayed, setImageDisplayed] = useState(nootnoot);

    const isPc = useMediaQuery({
        query : "(min-width:1024px)"
      });
      const isMobile = useMediaQuery({
        query: "(max-width:1023px)"
      });

    const Pingu = styled.div`
    background-image: url(${nootnoot});
    background-repeat: no-repeat;
    height: 85.9vh;
    width: 100%;
    background-size: cover;
    background-position: 30vw;
    background-color: #FCFCFF;
    `

    const ErrorText = styled.div`
        position: absolute;
        font-family: 'Milky Honey';
        font-weight: 600;
        font-size: 20rem;
        top: 35%;
        left: 10%;
    `
    const history = useHistory()

    function handleImageDisplayed () {
        setImageDisplayed(nootnootAfter)
    }

    useEffect(()=>{
        history.push('/404')
        setTimeout(handleImageDisplayed, 4000)
    }, [])
    return (
        <div style={{position:'relative', height:'100%'}}>
            {isPc && 
            <Fragment>
                <Header></Header>
                <Pingu></Pingu>
                <ErrorText>404</ErrorText>
                <ErrorText style={{fontSize:'2rem', top:'80%', left:'15%'}}>
                    <a style={{textDecoration:'none', color:'black'}} href="/index">Take Me Home, Country Road</a>
                </ErrorText>
                {/* <div style={{display:'relative'}}>
                    <img src={nootnoot} style={{display:'absolute', height:'300%', width:'81%'}} alt='nootnoot'></img>
                </div> */}
            </Fragment>
            }
            {isMobile &&
            <div>
                <Header></Header>
                <div style={{backgroundColor:'#FCFCFC', marginTop:'35%', display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <div style={{fontFamily:'Milky Honey', fontWeight:600, fontSize:'7rem'}}>404</div>
                    <div style={{marginTop:'10%', fontFamily:'Milky Honey', fontWeight:600, fontSize:'2rem'}}><a style={{zIndex:50, textDecoration:'none', cursor:'pointer', color:'black'}} href='/index'>Take Me Home</a></div>
                </div>
                <div style={{position:'fixed', bottom:0}}><img src={nootnoot} alt='nootnoot'></img></div>
            </div>
            }
        </div>
    )
}


export default ErrorPage