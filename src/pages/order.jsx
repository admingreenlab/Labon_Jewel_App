import React, { useRef, useState,useEffect } from 'react';
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
// import Header from './head';
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
import { IMG_PATH } from "../config";
import jwtAuthAxios from "../service/jwtAuth";
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { chevronDownCircleOutline } from 'ionicons/icons';

function Orders() {
  
    const [counter, setCounter] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
     const history = useHistory();
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

    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);




        const fetchQuotations = async () => {
          try {
            setLoading(true);
            const response = await jwtAuthAxios.get(`/client/getorder`);
            // console.log(response)
            setOrder(response.data.orderData.map(orderData => ({
              id: orderData._id,
              date: new Date(orderData.date),
              status: orderData.status,
              naration: orderData.naration,
              itemData: orderData.itemData,
              paywithtax: orderData.paywithtax.toFixed(2),
              taxAmt: orderData.taxAmt.toFixed(2),
              quantity: orderData.sums.quantity,
              laborAmt: Number(orderData.sums.laborAmt).toFixed(2),
              metalrate: orderData.sums.metalrate.toFixed(2),
              gramwt: Number(orderData.sums.item.gramwt).toFixed(2),
              netwt: Number(orderData.sums.item.netwt).toFixed(2),
              date: new Date(orderData.date).toLocaleDateString()
            })));
            setLoading(false);
          } catch (error) {
            setLoading(false);
            console.error('Error details:', error);
            const errorMessage = error.response ? error.response.data.error : 'An unexpected error occurred';
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

      const handleViewQuotation = (order) => {
        history.push({
            pathname: `/ordershow/${order.id}`,
            state: { order }
        });
    };


      const sortedQuotations = [...order]?.sort((a, b) => new Date(b.date) - new Date(a.date));
    return (
<IonPage>
            <Header />
            <IonHeader>
<<<<<<< HEAD
                <h1 style={{color:'white'}}>home</h1>
            </IonHeader>
                <div style={{ margin: '30px', marginTop: '100px' }}></div>
            <IonContent color="primary" style={{ paddingBottom: '80x', marginBottom: '150px', marginTop: '10px' }}>
                        <IonRefresher slot="fixed" onIonRefresh={handleRefresh} style={{ marginTop: '20px'  }}>
=======
                {/* <h1 style={{color:'white'}}>home</h1> */}
            </IonHeader>
                <div style={{ margin: '30px', marginTop: '100px' }}></div>
            <IonContent color="primary" style={{ paddingBottom: '80x', marginBottom: '150px', marginTop: '10px' }}>
                        {/* <IonRefresher slot="fixed" onIonRefresh={handleRefresh} style={{ marginTop: '20px'  }}>
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
                <div style={{ marginTop: '20px' }}>
                    <h5 class="text-center mb-5 element"  style={{marginTop:'70px'}}>My Order</h5>
                </div>
                <div className='myquotations' style={{marginBottom:"50px"}}>
                    <IonGrid>
                        <IonRow>
                        <IonCol>
                                {sortedQuotations.map((order) => (
                                    <IonAccordionGroup className='main-qustion' key={order.id} value={order.id}>
                                        <IonAccordion value="first" eventKey="1" style={{ border:'2px solid #4c322659' }}>
                                            <IonItem slot="header" color="secondary">
                                                <p>{moment(order.date).format('DD/MM/YY')}</p>
                                                <ion-router-link onClick={() => handleViewQuotation(order)}>
                                                   <button style={{background:'#4c3226'}}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="bisque" class="bi bi-eye" viewBox="0 0 16 16">
                                                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                                        </svg>
                                                    </button>
                                                </ion-router-link>
                                            </IonItem>
                                            <div className="ion-padding" slot="content" >
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                            Date :
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                            {moment(order.date).format('DD/MM/YY')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                          Naration :
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                            {order.naration}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                          Total Quantity :
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                            {order.quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                          Metalrate :
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                            {order.metalrate}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                          Gramwt :
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                            {order.gramwt}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                          Netwt :
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                            {order.netwt}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                         LaborAmt :
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                            {order.laborAmt}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                          TaxAmt :
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                            {order.taxAmt}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                          Paywithtax :
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                            {order.paywithtax}
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
                                                            {order.status}
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
export default Orders; 