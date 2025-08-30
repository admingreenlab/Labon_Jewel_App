import React, { useContext, useEffect, useState, useMemo, useRef } from "react";
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
    IonSelect,
    IonSelectOption,
    IonPopover,
    IonAccordion,
    IonAccordionGroup,
    IonRadio,
    IonRadioGroup,
    IonTextarea,
    IonChip,
    IonicSlides,
    IonButtons,
    IonRefresher, IonRefresherContent,
} from '@ionic/react';
import { IonCol, IonGrid, IonRow, IonTabButton } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Header from './head';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '../pages/Tab1.css';
import Like from '../pages/like';
import '@ionic/react/css/ionic-swiper.css';
import 'swiper/css/autoplay';
import 'swiper/css/keyboard';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/zoom';
import { Autoplay, Keyboard, Pagination, Scrollbar, Zoom } from 'swiper/modules';
import { IMG_PATH } from "../config";
import jwtAuthAxios from "../service/jwtAuth";
import { DataContext } from "../context/DataProvider";
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { chevronDownCircleOutline } from 'ionicons/icons';

function Product() {
    const [counter, setCounter] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    let userId = JSON.parse(localStorage.getItem("user"))?._id;
    // Handle modal open and close
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const incrementCounter = () => setCounter(counter + 1);
    const decrementCounter = () => {
        if (counter > 0) {
            setCounter(counter - 1);
        }
    };
    const [openAccordion, setOpenAccordion] = useState('first');

    const toggleAccordion = (value) => {
        setOpenAccordion(openAccordion === value ? '' : value);
    };



    const fetchQuotations = async () => {
        try {
            setLoading(true);
            const response = await jwtAuthAxios.get(`/client/quote-request`);

            localStorage.setItem(
                "quotes",
                JSON.stringify(response?.data?.quoteRequests || [])
            );
            setQuotations(
                response.data.quoteRequests
                    ?.filter((qr) => qr?.user?._id == userId)
                    ?.map((qr) => ({
                        id: qr._id,
                        date: qr.createdAt,
                        fullName: qr.userData?.fullName || "",
                        email: qr.userData?.email || "",
                        referenceName: qr.userData?.referenceName,
                        mobileNumber: qr.userData?.mobileNumber || "",
                        quantity:
                            qr.items?.reduce(
                                (sum, item) => sum + (item.quantity || 0),
                                0
                            ) || 0,
                        status: qr.status || "",
                        companyName: qr.userData?.companyName || "",
                    }))
            );
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error details:", error);
            const errorMessage = error.response
                ? error.response.data.error
                : "An unexpected error occurred";
            setError(errorMessage);

        }
    };


    useEffect(() => {
        fetchQuotations();
    }, []);

    const handleRefresh = async (event) => {
        await fetchQuotations();
        setTimeout(() => {
            // Any calls to load data go here
            event.detail.complete();
        }, 1500); // Signal that the refresh is complete
    };

    // useEffect(() => {
    //     const fetchQuotations = async () => {
    //         try {
    //             setLoading(true);
    //             const response = await jwtAuthAxios.get('/client/clientquote');
    //                console.log('clientquote', response.data)
    //             setQuotations(response.data.quoteRequests.map(quoteRequests => ({
    //                 id: quoteRequests._id,
    //                 date: quoteRequests.createdAt,
    //                 fullName: quoteRequests.userData.fullName,
    //                 email: quoteRequests.userData.email,
    //                 referenceName: quoteRequests.userData.referenceName,
    //                 companyName: quoteRequests.userData.companyName,
    //                 mobileNumber: quoteRequests.userData.mobileNumber,
    //                 status: quoteRequests.status,
    //                 items: quoteRequests.items,
    //                 quantity:
    //                     quoteRequests.items?.reduce(
    //                         (sum, item) => sum + (item.quantity || 0),
    //                         0
    //                     ) || 0,
    //             })));
    //             setLoading(false);
    //         } catch (error) {
    //             setLoading(false);
    //             console.error('Error details:', error);
    //         }
    //     };

    //     fetchQuotations();
    // }, []);

    const handleViewQuotation = (quotation) => {
        history.push({
            pathname: `/myquotationsview/${quotation.id}`,
            state: { quotation }
        });
    };


    const sortedQuotations = [...quotations]?.sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
            <IonPage>
            <Header />
            <IonHeader>
                <h1 style={{color:"white"}}>home</h1>
            </IonHeader>
                <div style={{ margin: '30px', marginTop: '130px' }}></div>
                <IonContent color="primary" style={{  marginBottom: '70px' }}>
                    <IonRefresher slot="fixed" onIonRefresh={handleRefresh} style={{ marginTop: '20px' }}>
                        <IonRefresherContent
                            pullingIcon={chevronDownCircleOutline}
                            refreshingSpinner="circles"
                        ></IonRefresherContent>
                    </IonRefresher>
                    <div style={{ marginTop: '20px' }}>
                        <h5 class="text-center mb-5 element" >My quotations</h5>
                    </div>
                    <div className='myquotations' style={{ marginBottom: "50px" }}>
                        <IonGrid>
                            <IonRow>
                                <IonCol>
                                    {sortedQuotations.map((quotation) => (
                                        <IonAccordionGroup className='main-qustion' key={quotation.id} value={quotation.id}>
                                            <IonAccordion value="first" eventKey="1" style={{ marginBottom: '15px' }}>
                                                <IonItem slot="header" color="secondary">
                                                    <p>{moment(quotation.date).format('DD/MM/YY')}</p>
                                                    <ion-router-link onClick={() => handleViewQuotation(quotation)}>
                                                        <button style={{background:'#4c3226'}}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="bisque" class="bi bi-eye" viewBox="0 0 16 16">
                                                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                                            </svg>
                                                        </button>
                                                    </ion-router-link>
                                                </IonItem>
                                                <div className="ion-padding" slot="content" style={{ border: '2px solid #4c322659', padding: "7px" }}>
                                                    <div className='d-flex'>
                                                        <div className='left-hed'>
                                                            <h6>
                                                                Date :
                                                            </h6>
                                                        </div>
                                                        <div className='right-hed'>
                                                            <span>
                                                                {moment(quotation.date).format('DD/MM/YY')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='d-flex'>
                                                        <div className='left-hed'>
                                                            <h6>
                                                                Full Name :
                                                            </h6>
                                                        </div>
                                                        <div className='right-hed'>
                                                            <span>
                                                                {quotation.fullName}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='d-flex'>
                                                        <div className='left-hed'>
                                                            <h6>
                                                                Email :
                                                            </h6>
                                                        </div>
                                                        <div className='right-hed'>
                                                            <span>
                                                                {quotation.email}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='d-flex'>
                                                        <div className='left-hed'>
                                                            <h6>
                                                                Reference Name :
                                                            </h6>
                                                        </div>
                                                        <div className='right-hed'>
                                                            <span>
                                                                {quotation.referenceName}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='d-flex'>
                                                        <div className='left-hed'>
                                                            <h6>
                                                                Mobile Number :
                                                            </h6>
                                                        </div>
                                                        <div className='right-hed'>
                                                            <span>
                                                                {quotation.mobileNumber}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='d-flex'>
                                                        <div className='left-hed'>
                                                            <h6>
                                                                Quantity :
                                                            </h6>
                                                        </div>
                                                        <div className='right-hed'>
                                                            <span>
                                                                {quotation.quantity}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='d-flex'>
                                                        <div className='left-hed'>
                                                            <h6>
                                                                Company Name :
                                                            </h6>
                                                        </div>
                                                        <div className='right-hed'>
                                                            <span>
                                                                {quotation.companyName}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='d-flex'>
                                                        <div className='left-hed'>
                                                            <h6>
                                                                Status :
                                                            </h6>
                                                        </div>
                                                        <div className='right-hed'>
                                                            <span>
                                                                {quotation.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </IonAccordion>
                                        </IonAccordionGroup>
                                    ))}
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </div>

                </IonContent >
            </IonPage>
    );
}
export default Product;



