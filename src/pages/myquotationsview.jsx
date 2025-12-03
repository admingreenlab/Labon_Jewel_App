import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
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
import { chevronDownCircleOutline } from 'ionicons/icons';

function Product() {
    const [counter, setCounter] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { id } = useParams();
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

    const [error, setError] = useState(null);
    const [quotation, setQuotation] = useState(null);

    useEffect(() => {
        const fetchQuotation = async () => {
          try {
            const response = await jwtAuthAxios.get(`/client/quote-request/${id}`);
            if (response.data.status === "success") {
              setQuotation(response?.data?.quoteRequests);
              
            } else {
              setError(response.data.message);
            }
          } catch (err) {
            setError(err.message);
          } finally {
    
          }
        };
    
        fetchQuotation();
      }, [id]);

      const handleRefresh = async (event) => {
    
        setTimeout(() => {
          // Any calls to load data go here
          event.detail.complete();
        }, 1500); // Signal that the refresh is complete
      };
    

    return (
            <IonPage>
            <Header />
            <IonHeader>
            {/* <h1 style={{color:"white"}}>home</h1> */}
            </IonHeader>
                <div style={{ margin: '30px', marginTop: '130px' }}></div>
                <IonContent color="primary" style={{ marginBottom: '100px' }}>
                            {/* <IonRefresher slot="fixed" onIonRefresh={handleRefresh} style={{ marginTop: '20px'  }}>
                            <IonRefresherContent
                                pullingIcon={chevronDownCircleOutline}
                                refreshingSpinner="circles"
                            ></IonRefresherContent>
                            </IonRefresher> */}
                            <div style={{ marginTop: '20px' }}>
                        <h5 class="text-center mb-5 element" >My quotations View</h5>
                    </div>
                    <div className='myquotations'>
                        <IonGrid>
                            <IonRow>
                                <IonCol size='12' style={{ marginBottom: '50px'}}>
                                    <IonAccordionGroup className='main-qustion main-qustion1'>
                                        {quotation?.items?.map((item, index) => (
                                            <IonAccordion key={item._id} value={`item-${index}`} eventKey={index + 1} style={{marginTop:'10px'}}>
                                                <IonItem slot="header" color="secondary">
                                                    <p>SKU : {item.item.sku}</p>
                                                </IonItem>
                                                <div className="ion-padding" slot="content" style={{ border:'2px solid #4c322659'}}>
                                                <div className='d-flex'>
                                                        <div className='left-hed'>
                                                            <h6>
                                                                Thumbnail: 
                                                            </h6>
                                                        </div>
                                                        <div className='right-hed'>
                                                            <span>
                                                                <IonImg
                                                                    className='thummail'
                                                                    style={{ width: '120px', height: '120px', borderRadius: '10' }}
                                                                    src={IMG_PATH + item?.item?.thumbnailImage}
                                                                ></IonImg>
                                                            </span>
                                                        </div>
                                                    </div>
                                                
                                                <div className='d-flex'>
                                                        <div className='left-hed'>
                                                            <h6>
                                                                SKU:
                                                            </h6>
                                                        </div>
                                                        <div className='right-hed'>
                                                            <span>
                                                                {item.item.sku}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='d-flex'>
                                                        <div className='left-hed'>
                                                            <h6>
                                                                Description:
                                                            </h6>
                                                        </div>
                                                        <div className='right-hed'>
                                                            <span>
                                                            {item.item.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='d-flex'>
                                                        <div className='left-hed'>
                                                            <h6>
                                                                KT:
                                                            </h6>
                                                        </div>
                                                        <div className='right-hed'>
                                                            <span>
                                                            {item.KT}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='d-flex'>
                                                        <div className='left-hed'>
                                                            <h6>
                                                            Metal:
                                                            </h6>
                                                        </div>
                                                        <div className='right-hed'>
                                                            <span>
                                                            {item.item.metal}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {/* <div className='d-flex'>
                                                        <div className='left-hed'>
                                                            <h6>
                                                                Diamond Color/Clarity
                                                            </h6>
                                                        </div>
                                                        <div className='right-hed'>
                                                            <span>
                                                                {item.item.diacolororclarity}
                                                            </span>
                                                        </div>
                                                    </div> */}
                                                    <div className='d-flex'>
                                                        <div className='left-hed'>
                                                            <h6>
                                                                Size:
                                                            </h6>
                                                        </div>
                                                        <div className='right-hed'>
                                                            <span>
                                                                {item.size}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='d-flex'>
                                                        <div className='left-hed'>
                                                            <h6>
                                                                Finding:
                                                            </h6>
                                                        </div>
                                                        <div className='right-hed'>
                                                            <span>
                                                                {item.finding}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='d-flex'>
                                                        <div className='left-hed'>
                                                            <h6>
                                                                Item Quantity:
                                                            </h6>
                                                        </div>
                                                        <div className='right-hed'>
                                                            <span>
                                                                {item.quantity}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='d-flex'>
                                                        <div className='left-hed'>
                                                            <h6>
                                                            Diamond Quantity:
                                                            </h6>
                                                        </div>

                                                        <div className='right-hed'>
                                                            <span>
                                                                {item.item.totalDiamondPcs}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='d-flex'>
                                                        <div className='left-hed'>
                                                            <h6>
                                                            Netwt:
                                                            </h6>
                                                        </div>
                                                        <div className='right-hed'>
                                                            <span>
                                                            {Number(item.item.netwt).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='d-flex'>
                                                        <div className='left-hed'>
                                                            <h6>
                                                            Labor Amt:
                                                            </h6>
                                                        </div>
                                                        <div className='right-hed'>
                                                            <span>
                                                            {Number(item.laborAmt).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='d-flex'>
                                                        <div className='left-hed'>
                                                            <h6>
                                                                Message:
                                                            </h6>
                                                        </div>
                                                        <div className='right-hed'>
                                                            <span>
                                                                {item.message}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </IonAccordion>
                                        ))}
                                    </IonAccordionGroup>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </div>

                </IonContent >
            </IonPage>
    );
}
export default Product; 