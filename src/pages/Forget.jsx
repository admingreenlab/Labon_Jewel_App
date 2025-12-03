import React, { useEffect, useRef, useState } from 'react';
import {
    IonButton,
    IonModal,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonPage,
    IonList,
    IonItem,
    IonLabel,
    IonAvatar,
    IonImg,
    IonSearchbar,
    IonGrid,
    IonRow,
    IonCol,
    IonToast
} from '@ionic/react';
import { IonInput } from '@ionic/react';
import { IonInputPasswordToggle } from '@ionic/react';
import jwtAuthAxios, { setAuthToken } from "../service/jwtAuth";
import { useHistory } from "react-router-dom";


const Forget = () => {
    const history = useHistory();
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await jwtAuthAxios.post("client/forgot-password", {
                email: forgotPasswordEmail,
            });
            if (response.status === 200) {
                setForgotPasswordEmail("");
                setToastMessage(response?.data?.message);
                setShowToast(true);
                history.push("/login");
            }
        } catch (error) {
            console.error(error?.response?.data || "This User email is not register");
            setToastMessage(error?.response?.data);
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <IonPage>
                <div className='main-bg' style={{ width: '100%', height: '100%' }}>
                    <img
                        className='freem253'
                        src="/img/logoa12.png"
                    ></img>
<<<<<<< HEAD
                    <div style={{ width: '100%', height: '30px', background: '#4c3226', position: 'absolute', left: ' 0', top: '0' }}></div>
=======
                    <div style={{ width: '100%', height: '45px', background: '#4c3226', position: 'absolute', left: ' 0', top: '0' }}></div>
>>>>>>> d0b8ea1 (Merge remote ios with local ios)
                    <img
                        className='freemlogin1'
                        src="/img/freemlogin.svg"
                    ></img>
                    <div className='user-img'>
                        <IonImg
                            className='freemlogin2'
                            src="/img/userlogo.svg"
                        ></IonImg>
                        <div class="cell smaldesignleft">
                            <div class="circle fade-in-left">
                                <img
                                    src="/img/leftdesign.svg"
                                ></img>
                            </div>
                        </div>
                        <div class="cell smaldesignright">
                            <div class="circle fade-in-left">
                                <img
                                    src="/img/rightdesign.svg"
                                ></img>
                            </div>
                        </div>

                    </div>
                    <IonGrid>
                        <IonRow className='loginrow'>
                            <IonCol size-md='6' size-sm='8' size='12'>
                                <form onSubmit={handleForgotPassword}>
                                    <div style={{ display: 'flex', borderBottom:'1px solid #4c3226', alignItems:'center',gap:'10px', paddingBottom:'10px' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16" >
                                            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                                        </svg>
                                        <input
                                            name="email"
                                            type="email"
                                            placeholder="Enter Email"   
                                            style={{ background: '#ffdeb300', color: '#000' ,border:'0', width:'85%', padding:'6px' }}                    
                                            value={forgotPasswordEmail}
                                            onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                            required
                                           
                                        />

                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '30px' }}>
                                        <button
                                            color='secondary'
                                            type='submit'
                                            expand="full"
                                            style={{ width: '100%', textTransform: 'uppercase', fontSize: '13px', color: 'white', padding: '10px 10px', background: '#4c3226' }}
                                            // disabled={loading}
                                        >
                                            {loading ? "Sending Link..." : "Forgot Password"}
                                        </button>
                                        <button
                                            onClick={() => history.push('/login')}
                                            color='secondary'
                                            type='submit'
                                            expand="full"
                                            style={{ width: '100%', textTransform: 'uppercase', color: 'white', padding: '10px 10px', background: '#4c3226' }}

                                        >
                                            Back
                                        </button>
                                    </div>
                                </form>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
            </IonPage>
            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={2000}
            />
        </>
    );
}

export default Forget;