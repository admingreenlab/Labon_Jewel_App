import React, { useEffect, useState } from 'react';
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
import { useParams, Link, useLocation } from "react-router-dom";
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
import Header from './head';
import 'swiper/css/zoom';
import { Autoplay, Keyboard, Pagination, Scrollbar, Zoom } from 'swiper/modules';
import { chevronDownCircleOutline } from 'ionicons/icons';

function Ordershow() {

    const [counter, setCounter] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const rowData = location.state.order;
    console.log('Row Data:', rowData);

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
<<<<<<< HEAD
                <h1 style={{color:'white'}}>home</h1>
            </IonHeader>
                <div style={{ margin: '30px', marginTop: '100px' }}></div>
            <IonContent color="primary" style={{ paddingBottom: '80x', marginBottom: '100px', marginBottom: '10px' }}>
                        <IonRefresher slot="fixed" onIonRefresh={handleRefresh} style={{ marginBottom: '20px'  }}>
=======
                {/* <h1 style={{color:'white'}}>home</h1> */}
            </IonHeader>
                <div style={{ margin: '30px', marginTop: '100px' }}></div>
            <IonContent color="primary" style={{ paddingBottom: '80x', marginBottom: '100px', marginBottom: '10px' }}>
                        {/* <IonRefresher slot="fixed" onIonRefresh={handleRefresh} style={{ marginBottom: '20px'  }}>
>>>>>>> d0b8ea1 (Merge remote ios with local ios)
                          <IonRefresherContent
                            pullingIcon={chevronDownCircleOutline}
                            refreshingSpinner="circles"
                          ></IonRefresherContent>
<<<<<<< HEAD
                        </IonRefresher>
=======
                        </IonRefresher> */}
>>>>>>> d0b8ea1 (Merge remote ios with local ios)
                <div style={{ marginTop: '55px', marginBottom: '10px' }}>
                    <h5 class="text-center mb-5 element">My Order View</h5>
                </div>
                <div className='myquotations'>
                    <IonGrid>
                        <IonRow>
                            <IonCol size='12' style={{marginBottom:"50px"}}>
                                <IonAccordionGroup className='main-qustion main-qustion1'>
                                {rowData.itemData.map((item, index) => (
                                        <IonAccordion key={index} style={{marginBottom:'10px'}}>
                                            <IonItem slot="header" color="secondary">
                                                <p>SKU : {item.sku} </p>
                                            </IonItem>
                                            <div className="ion-padding" slot="content" style={{height:'400px',border:'2px solid #4c322659'}}>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                            SKU
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                        {item.sku}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                            SKU Name
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                        {item.name}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                            KT
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
                                                            Quantity
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
                                                            Gram wt
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                        {Number(item?.gramwt || 0).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                            Net wt
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                        {Number(item?.netwt || 0).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                            Metal Rate
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                        {Number(item?.metalrate || 0).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                            Labor Amt
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                        {Number(item?.laborAmt || 0).toFixed(2)}
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
export default Ordershow; 