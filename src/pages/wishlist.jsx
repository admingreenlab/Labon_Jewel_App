import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonItem,
  IonList,
  IonThumbnail,
  IonButton,
  IonCardTitle,
  IonToast
} from '@ionic/react';
import '../pages/Tab1.css';
import '../main';
import { IonCol, IonGrid, IonRow, IonTabButton } from '@ionic/react';
import Header from './head';
import { IonTextarea } from '@ionic/react'; import { useParams } from "react-router-dom";
import { IMG_PATH } from "../config";
import jwtAuthAxios from "../service/jwtAuth";
import { DataContext } from "../context/DataProvider";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
<<<<<<< HEAD
=======
import { useHistory } from 'react-router-dom';
>>>>>>> d0b8ea1 (Merge remote ios with local ios)

const WishlistPage = () => {
  const [counter, setCounter] = useState(0);
  const { wishData, setWishData } = useContext(DataContext);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
<<<<<<< HEAD
=======
  const history = useHistory();
>>>>>>> d0b8ea1 (Merge remote ios with local ios)

  const incrementCounter = () => setCounter(counter + 1);
  const decrementCounter = () => {
    if (counter > 0) {
      setCounter(counter - 1);
    }
  };

  const handleRemove = (id) => {
    try {
      const item = wishData?.filter((item) => item._id !== id);
      setWishData(item);
      setToastMessage('Item Remove');
      setShowToast(true);
    }
    catch (error) {
      toast.error(error?.response?.data?.error);
    }
  };


  const handleView = (data) => {
<<<<<<< HEAD
    window.open(`/product/${data?._id}`);
=======
    history.push(`/product/${data?._id}`);
>>>>>>> d0b8ea1 (Merge remote ios with local ios)
  };


  return (
    <>


      <IonPage style={{ marginTop: '160px' }}>
        <Header />
        <IonContent color="primary" style={{ paddingBottom: '80x', marginBottom: '100px' }}>
          <h4 className="text-center mb-5 element" style={{ marginTop: '20px' }}>Your Wishlist</h4>
          <div style={{ paddingBottom: '80x', marginBottom: '100px', position: 'relative' }}>

            {wishData?.length > 0 ? (
              wishData.map((item, i) => {
                return (
                  <div style={{ padding: ' 0', border: '1px solid rgb(0 0 0 / 19%)', margin: '10px', borderRadius: '9px', background: '#fff' }}>
                    <IonGrid>
                      <IonRow>
                        <IonCol size='12' key={i}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'space-between' }}>
                            <IonThumbnail slot="start">
                              <img alt="Silhouette of mountains" src={IMG_PATH + item?.thumbnailImage} />
                            </IonThumbnail>
                            <IonCardTitle style={{ color: 'black', justifyContent: 'center', display: 'flex', fontSize: '12px', marginRight: 'auto' }}>
                              {item?.name}
                            </IonCardTitle>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <button shape='round' style={{ padding: '10px', borderRadius: '30px' }} onClick={() => {
                                handleView(item);
                              }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" class="bi bi-eye" viewBox="0 0 16 16">
                                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                </svg>
                              </button>
                              <button shape='round' onClick={() => handleRemove(item?._id)} style={{ padding: '10px', borderRadius: '30px', margin: '0px 0px 0px 10px' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-trash3" viewBox="0 0 16 16">
                                  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                <h3>No items in your wishlist</h3>

              </div>
            )}
          </div >
          <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message={toastMessage}
            duration={2000}
          />
        </IonContent >
      </IonPage>
    </>
  );
};

export default WishlistPage;
