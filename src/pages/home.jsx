import React, { useEffect, useState } from 'react';
import { IonContent, IonImg, IonTitle, IonToolbar, IonCol, IonGrid, IonRow, IonTabButton, IonRefresher, IonRefresherContent, } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '../pages/Tab1.css';
import '../main';
import Header from './head';
import { IonButtons, IonButton, IonModal, IonHeader, IonPage } from '@ionic/react';
import { IMG_PATH } from "../config";
import jwtAuthAxios from "../service/jwtAuth";
import Head from './head';
import { chevronDownCircleOutline } from 'ionicons/icons';


const HomePage = () => {
  const [homeDetails, setHomeDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const response = await jwtAuthAxios.get(`client/dashboard`);
      setHomeDetails(response?.data.data.sec[0].data);
 
      // console.log('Fetched data:', response?.data?.data.sec[0].data);
    } catch (error) {

      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);


  // const handleRefresh = async (event) => {
  //   await fetchHomeData();
  //   setTimeout(() => {
  //     // Any calls to load data go here
  //     event.detail.complete();
  //   }, 1500); // Signal that the refresh is complete
  // };

  return (
      <IonPage>
<<<<<<< HEAD
        <IonHeader collapse="condense">
=======
        <IonHeader collapse="condense" style={{ marginBottom: "70px" }}>
>>>>>>> d0b8ea1 (Merge remote ios with local ios)
    {/* This is a dummy header to help Ionic recognize layout */}
  </IonHeader>
      <Head />
      
<<<<<<< HEAD
      <IonContent color="primary" style={{ marginTop: '100px' }}>
=======
      <IonContent color="primary">
>>>>>>> d0b8ea1 (Merge remote ios with local ios)
      
        <IonGrid >
          <IonRow>
            <IonCol>
<<<<<<< HEAD
              <Swiper className='videobnnnner' style={{ marginBottom: '20px', marginTop: '160px' }}
                spaceBetween={50}
                slidesPerView={1}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
                autoplay={true}
              >  
                <SwiperSlide>
                  <IonImg
                    src="/img/slider-banner-2.jpg"
=======
              <Swiper className='videobnnnner' style={{ marginBottom: '20px', marginTop: '100px' }}
                spaceBetween={50}
                slidesPerView={1}
                autoplay={true}
                onSwiper={(swiper) => {
                  setTimeout(() => {
                    swiper.update(); // Fix layout issue
                  }, 500); // Delay helps to ensure images are loaded
                }}
                
              >  
                 <SwiperSlide>
                  <IonImg
                    src="/img/slider-banner-4.jpg"
>>>>>>> d0b8ea1 (Merge remote ios with local ios)
                    style={{ width: '100%', height: '200px', margin: '0', objectFit: 'cover', borderRadius: '9px', borderRadius: '9px', overflow: 'hidden' }}
                  ></IonImg>
                </SwiperSlide>
                <SwiperSlide>
                  <IonImg
                    src="/img/slider-banner-3.jpg"
                    style={{ width: '100%', height: '200px', margin: '0', objectFit: 'cover', borderRadius: '9px', borderRadius: '9px', overflow: 'hidden' }}
                  ></IonImg>
                </SwiperSlide>
                <SwiperSlide>
                  <IonImg
<<<<<<< HEAD
                    src="/img/slider-banner-4.jpg"
=======
                    src="/img/slider-banner-2.jpg"
>>>>>>> d0b8ea1 (Merge remote ios with local ios)
                    style={{ width: '100%', height: '200px', margin: '0', objectFit: 'cover', borderRadius: '9px', borderRadius: '9px', overflow: 'hidden' }}
                  ></IonImg>
                </SwiperSlide>
              </Swiper>
            </IonCol>
          </IonRow>
        </IonGrid>
        <div>
          <h6 class="text-center mb-5 element">Categories at a Glance</h6>
          <IonGrid style={{ marginBottom: '100px', marginTop: '30px' }}>
            <IonRow>
              {homeDetails.map((item) => (
                <IonCol size-lg="3" size-md="4" size-sm="4" size="4" key={item._id}>
                  <ion-router-link href={`/category/${item._id}`} style={{ textDecoration: 'none' }}>
                    <div className='main-categoryimg'>
                      <IonImg className='categoryimg' src={IMG_PATH + item?.filepath} />
                      <IonImg
                        className='categoryimg1'
                        src="/img/catagory-bg.png"
                      ></IonImg>
                    </div>
<<<<<<< HEAD
                    <IonTitle>{item.name}</IonTitle>
=======
                    {/* <IonTitle>{item.name}</IonTitle> */}
                    <div style={{color:'#4c3226',textAlign:'center', fontSize:'15px', marginBottom:'20px' }}>{item.name}</div>
>>>>>>> d0b8ea1 (Merge remote ios with local ios)
                  </ion-router-link>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        </div>
      </IonContent >
      </IonPage>

  )
};

export default HomePage;