import React, { useContext, useEffect, useState, useMemo, useRef } from "react";
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/react';
// import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
  IonThumbnail,
  IonSearchbar,
  IonRow,
  IonCol,
  IonPage,
  IonButton
} from '@ionic/react';
import { useHistory } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import Header from './head';
import jwtAuthAxios from "../service/jwtAuth";

const LibraryPage = () => {
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [searchName, setSearchName] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  // const navigate = useNavigate();
  const history = useHistory();

    const handleSearch = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset any previous errors

    if (!searchName?.trim()) {
      setErrorMessage("Please enter a search term.");
      return;
    }

    try {
      const response = await jwtAuthAxios.get(`master/items?name=${searchName}`);
      const item = response?.data?.[0];

      if (item?._id) {
        history.push(`/product/${item._id}`);
        setSearchName("");
      } else {
        setErrorMessage("Invalid SKU.");
      }
    } catch (error) {
      console.error(error?.response?.data?.error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };  



  return (
    <>
      <IonHeader style={{ marginBottom: "50px" }}>
        {/* <h1 style={{color:'white'}}>home</h1> */}
      </IonHeader>
      <Header />
      <IonPage>
        <div style={{ margin: '30px', marginTop: '130px' }}></div>
        <IonContent>
          <IonRow>
            <IonCol>
              <div>
                <div style={{ marginTop: '20px' }}>
                  <h4 class="text-center mb-3 element">Search</h4>
                </div>
                    <form onSubmit={handleSearch} >
                      <div className="search" style={{ position: 'relative' }}>
                        <input
                          style={{ border: '0', width: '100%',backgroundColor:'transparent' }}
                          type="text"
                          placeholder="Type Your Search SKU..."
                          value={searchName}
                          onChange={(e) => setSearchName(e?.target?.value?.toUpperCase())}
                        />
                        <span
                          onClick={() => setSearchName("")}
                          style={{
                            position: 'absolute',
                            top: '15px',
                            right: '15px',
                            fontSize: '18px',
                            cursor: 'pointer'
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                          </svg>
                        </span>
                      </div>
                    </form>
                    {errorMessage && (
                      <div style={{ color: 'red', marginTop: '10px', padding: '0 20px' }}>
                        {errorMessage}
                      </div>
                  )}
              </div>
            </IonCol>
          </IonRow>

        </IonContent>
      </IonPage>
    </>
  );
};

export default LibraryPage;
