import React, { useState, useEffect, useRef } from 'react';
import {
  IonApp,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonMenu,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonImg,
  IonMenuButton,
  IonBackButton,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonInput
} from '@ionic/react';
// import { useLocation } from "react-router-dom";
import { IonMenuToggle } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router';
import HomePage from './pages/home';
import AddtocardPage from './pages/addtocard';
import Login from './pages/login';
import Productpage from './pages/product';
import Registerhere from './pages/registerhere';
import Category from './pages/category';
import PrivacyPolicy from './pages/privacypolicy';
import WishlistPage from './pages/wishlist';
import SearchPage from './pages/searchbar';
import Thanks from './pages/thanks';
import Myquotations from './pages/myquotations';
import Myquotationsview from './pages/myquotationsview';
import Orders from './pages/order';
import Ordershow from './pages/ordershow';
// import Videojewal from './pages/videojewal';
// import Videoshow from './pages/videoshow';
import Ccategorypage from './pages/c-category';
import Head from './pages/head';
import './pages/Tab1.css';
import { IMG_PATH } from "./config";
import jwtAuthAxios from "./service/jwtAuth";
import DataProvider from "./context/DataProvider"
import MarginProvider  from "./context/Margincontext"
import { addToCart } from "./store/actions";
import { useDispatch } from "react-redux";
import useAuthInterceptor from "./service/useAuthInterceptor";
import samplePDF1 from "../public/footer/size.pdf";
import samplePDF2 from "../public/footer/finding.pdf";
import { filter } from 'ionicons/icons';
import Forget from './pages/Forget';
import Resetpassord from './pages/Resetpassword';
import Notfound from './pages/Notfound';
import Dimoandhome from './pages/Dimoandhome';
import Basket from './pages/Basket';
import { App as CapacitorApp } from '@capacitor/app';


function App() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [homeDetails, setHomeDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    username: "",
    mobileNumber: "",
    email: "",
    refrence: "",
    company: ""
  });
  const [mobileNo, setMobileNo] = useState();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [refrence, setRefrence] = useState();
  const [company, setCompany] = useState();
  let user = JSON.parse(localStorage.getItem("user"));
  let userId = JSON.parse(localStorage.getItem("user"))?._id;
  const [validated, setValidated] = useState(false);
  const [categories, setCategories] = useState([])
  const [categoryCollection, setCategoryCollection] = useState([])
  const isFetching = useRef(false)

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity()) {
      try {
        const response = await jwtAuthAxios.patch(`master/user/${userId}`, {
          username,
          mobileNo,
          email,
          refrence,
          company
        });
        console.log('cccc', response)
        localStorage.setItem("user", JSON.stringify(response?.data));
        window.dispatchEvent(new Event("storage"));
        setShowModal(false);
      } catch (error) {
        console.error(error?.response?.data?.error);
      }
    }

    setValidated(true);
  };

  useEffect(() => {
    setForm({
      mobileNo: user?.mobileNo,
      company: user?.company,
      refrence: user?.refrence,
      email: user?.email,
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-menu')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);


  const handleChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleChangePhone = (event) => {
    setMobileNo(event.target.value);
  };

  const handleChangeemail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangrefrence = (event) => {
    setRefrence(event.target.value);
  };

  const handleChangcompany = (event) => {
    setCompany(event.target.value);
  };

  const openModal = () => {
    setShowDropdown(false);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);


  const fetchuser = async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    const user = localStorage.getItem("user");
    try {
      const res = await jwtAuthAxios.get(`client/getuser/${JSON.parse(user)?._id}`);
      // console.log(res.data);
      if (res.data) {
        if (res.data.is_active === "N") {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          localStorage.removeItem('user')
          localStorage.removeItem('rememberedUsername');
          localStorage.removeItem('rememberedPassword');
          localStorage.removeItem('rememberMeChecked');
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
    finally {

      isFetching.current = false;
    }
  }

  useEffect(() => {
    fetchuser()
  }, [user]);


  const isAuthenticatedR = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    return !!token;
  };

  const [isAuthenticated, setIsAuthenticated] = useState(isAuthenticatedR());


  const LogOutHandler = () => {
    const rememberMeChecked = localStorage.getItem('rememberMeChecked') === 'true';
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("marginValue");
    localStorage.removeItem("selectedMargin");

    if (rememberMeChecked) {

    } else {
      localStorage.removeItem('rememberedUsername');
      localStorage.removeItem('rememberedPassword');
      localStorage.removeItem('rememberMeChecked');
      localStorage.removeItem('user')
    }

    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  // useAuthInterceptor();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(addToCart());
    }
  }, [dispatch, isAuthenticated]);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const response = await jwtAuthAxios.get(`/client/dynamicmenu`);
      setCategories(response?.data?.categories);
      setCategoryCollection(response?.data?.categoryCollections);
    } catch (error) {
      console.error("Error fetching home data:", error); // Debugging line
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (e) => {
    e?.stopPropagation();
    setUsername(user?.username);
    setMobileNo(user?.mobileNo);
    setEmail(user?.email);
    setRefrence(user?.refrence);
    setCompany(user?.company);
    setShowDropdown(!showDropdown);
  };
  // const toggleDropdown = () => {
  //   setShowDropdown(!showDropdown);
  // };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  useEffect(() => {
    setIsAuthenticated(isAuthenticatedR());
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const [isMenuOpen, setMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null); // Track which item is open

  const handleToggle = (index) => {
    // Toggle between open and closed state for each accordion item
    setActiveIndex(activeIndex === index ? null : index);
  };

  const userRole = user?.role;
  const hasAccess = userRole?.roleName === "Salesman";

   const lastBackPress = useRef(0);

  useEffect(() => {
    let backListener;

    const setupBackButtonListener = async () => {
      backListener = await CapacitorApp.addListener('backButton', () => {
        const now = Date.now();
        if (now - lastBackPress.current < 2000) {
          CapacitorApp.exitApp();
        } else {
          lastBackPress.current = now;
          console.log('Press back again to exit');
        }
      });
    };

    setupBackButtonListener();

    return () => {
      if (backListener && typeof backListener.remove === 'function') {
        backListener.remove(); // ✅ safely remove
      }
    };
  }, []);
  

  const hideTabBarRoutes = ['/login', '/registerhere', '/forget', '/resetpassword', '/dimhome'];
  return (  
 <IonApp>
      <IonReactRouter>
        <DataProvider>
        <MarginProvider>
          <IonTabs id="main-content">
            <IonRouterOutlet>
            <Route path="/" render={() => (
              <HomePage />
            )} exact={true} />
                        

              <Route
                path="/login"
                render={() => (isAuthenticated ? <Redirect to="/home" /> : <Login setIsAuthenticated={setIsAuthenticated} />)}
                exact={true}
              />
                            
              <Route path="/home" render={() => (
                <HomePage />
              )} exact={true} />

              <Route path="/forget" component={Forget} exact={true} />
              <Route path="/privacypolicy" component={PrivacyPolicy} exact={true} />

              {isAuthenticated ? (
                <>
                  <Route path="/home" component={HomePage} exact={true} />
                  <Route path="/c-category/:id" component={Ccategorypage} exact={true} />
                  <Route path="/category/:id" component={Category} exact={true} />
                  <Route path="/addtocard" component={AddtocardPage} exact={true} />
                  <Route path="/wishlist" component={WishlistPage} exact={true} />
                  <Route path="/registerhere" component={Registerhere} exact={true} />
                  <Route path="/myquotations" component={Myquotations} exact={true} />
                  <Route path="/myquotationsview/:id" component={Myquotationsview} exact={true} />
                  {/* <Route path="/privacypolicy" component={PrivacyPolicy} exact={true} /> */}
                  <Route path="/search" component={SearchPage} exact={true} />
                  <Route path="/product/:id" component={Productpage} exact={true} />
                  <Route path="/head" component={Head} exact={true} />
                  <Route path="/thanks" component={Thanks} exact={true} />
                  <Route path="/order" component={Orders} exact={true} />
                  <Route path="/ordershow/:id" component={Ordershow} exact={true} />
                  <Route path="/resetsionic" component={Resetpassord} exact={true} />
                  <Route path="/dimhome" component={Dimoandhome} exact={true} />
                  <Route path="/basket" component={Basket} exact={true} />

                </>
              ) : (
                <Redirect to="/login" />
              )}

              {/* <Route render={() => <Notfound />} /> */}
            </IonRouterOutlet>
          </IonTabs>
          </MarginProvider>
        </DataProvider>
      {!hideTabBarRoutes.includes(window.location.pathname) && (
        <IonHeader style={{ 
          top: 'calc(var(--ion-safe-area-top, 0px) + 10px)', 
          left: 0, 
          right: 0, 
          zIndex: 99,
          position: 'fixed',
          width: '100%'
        }}>
          <ion-router-link href={`/home`}>
            <div className='toplogo'>
              <IonImg
                slot="start"
                src="/img/logo-1.svg"
                style={{ height: '25px', margin: '0', marginLeft: '0px' }}
              ></IonImg>
            </div>
          </ion-router-link>
        <IonToolbar style={{
    padding: '0px 0 0px 0',
  }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',}}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* <IonButtons slot="start">
                  <IonMenuButton fill='clear' >
                    <Ion-Icon slot="start" src="/img/align-left.svg" style={{ height: '100%', marginLeft: '10px', marginRight: '10px' }}></Ion-Icon>
                  </IonMenuButton>
                </IonButtons> */}
                <div >
                  <button onClick={() => setMenuOpen(true)} style={{ background: 'transparent', margin: '0 10px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="bisque" class="bi bi-text-indent-left" viewBox="0 0 16 16">
                      <path d="M2 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m.646 2.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L4.293 8 2.646 6.354a.5.5 0 0 1 0-.708M7 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m0 3a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m-5 3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
                    </svg>
                  </button>
                </div>
                <IonImg
                  slot="start"
                  src="/img/logo.svg"
                  style={{ height: '30px', margin: '0', marginLeft: '0px' }}
                ></IonImg>
              </div>
              <div style={{ position: 'relative' }}>
                <button onClick={toggleDropdown} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" fill="bisque" class="bi bi-person" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                  </svg>
                </button>
              </div>
            </div>
          </IonToolbar>
        </IonHeader >
      )
      }
      {
        !hideTabBarRoutes.includes(window.location.pathname) && (
          <>
            {showDropdown && (
              <div className='dropdown-menu' style={{ position: 'absolute', right: '9px', top: '140px', border: '1px solid #ccc', zIndex: 1000 }}>
                {/* <div style={{ fontSize: '24px', justifyContent: 'end', padding: '0', display: 'flex', marginBottom: '-14px' }}>
                <ion-icon name="close-outline" onClick={closeDropdown}></ion-icon>
              </div> */}
                <div className="profile">
                  <h6 className="text-center mt-2">{username}</h6>
                  <span className="email">{mobileNo}</span>
                </div>

                <a style={{ cursor: 'pointer' }} onClick={openModal}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"></path></svg>
                  My Profile</a>
                <ion-router-link href="/myquotations">
                  <a style={{ cursor: 'pointer' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-blockquote-right" viewBox="0 0 16 16"><path d="M2.5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1zm10.113-5.373a7 7 0 0 0-.445-.275l.21-.352q.183.111.452.287.27.176.51.428.234.246.398.562.164.31.164.692 0 .54-.216.873-.217.328-.721.328-.322 0-.504-.211a.7.7 0 0 1-.188-.463q0-.345.211-.521.205-.182.569-.182h.281a1.7 1.7 0 0 0-.123-.498 1.4 1.4 0 0 0-.252-.37 2 2 0 0 0-.346-.298m-2.168 0A7 7 0 0 0 10 6.352L10.21 6q.183.111.452.287.27.176.51.428.234.246.398.562.164.31.164.692 0 .54-.216.873-.217.328-.721.328-.322 0-.504-.211a.7.7 0 0 1-.188-.463q0-.345.211-.521.206-.182.569-.182h.281a1.8 1.8 0 0 0-.117-.492 1.4 1.4 0 0 0-.258-.375 2 2 0 0 0-.346-.3z"></path></svg>
                    My Quotation</a>
                </ion-router-link>
                {/* <ion-router-link href="/video">
                  <a style={{ cursor: 'pointer' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-camera-reels" viewBox="0 0 16 16">
                      <path d="M6 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0M1 3a2 2 0 1 0 4 0 2 2 0 0 0-4 0" />
                      <path d="M9 6h.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 7.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 16H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm6 8.73V7.27l-3.5 1.555v4.35zM1 8v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1" />
                      <path d="M9 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6M7 3a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
                    </svg>
                    Exclusive Jewellery</a>
                </ion-router-link> */}
                <ion-router-link href='/order'>
                  <a style={{ cursor: 'pointer' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-boxes" viewBox="0 0 16 16">
                      <path d="M7.752.066a.5.5 0 0 1 .496 0l3.75 2.143a.5.5 0 0 1 .252.434v3.995l3.498 2A.5.5 0 0 1 16 9.07v4.286a.5.5 0 0 1-.252.434l-3.75 2.143a.5.5 0 0 1-.496 0l-3.502-2-3.502 2.001a.5.5 0 0 1-.496 0l-3.75-2.143A.5.5 0 0 1 0 13.357V9.071a.5.5 0 0 1 .252-.434L3.75 6.638V2.643a.5.5 0 0 1 .252-.434zM4.25 7.504 1.508 9.071l2.742 1.567 2.742-1.567zM7.5 9.933l-2.75 1.571v3.134l2.75-1.571zm1 3.134 2.75 1.571v-3.134L8.5 9.933zm.508-3.996 2.742 1.567 2.742-1.567-2.742-1.567zm2.242-2.433V3.504L8.5 5.076V8.21zM7.5 8.21V5.076L4.75 3.504v3.134zM5.258 2.643 8 4.21l2.742-1.567L8 1.076zM15 9.933l-2.75 1.571v3.134L15 13.067zM3.75 14.638v-3.134L1 9.933v3.134z" />
                    </svg>
                    My Orders</a>
                </ion-router-link>
                {/* <a style={{ cursor: 'pointer' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-camera-reels" viewBox="0 0 16 16"><path d="M6 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0M1 3a2 2 0 1 0 4 0 2 2 0 0 0-4 0"></path><path d="M9 6h.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 7.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 16H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm6 8.73V7.27l-3.5 1.555v4.35zM1 8v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1"></path><path d="M9 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6M7 3a2 2 0 1 1 4 0 2 2 0 0 1-4 0"></path></svg>
                Exclusive Jewellery</a> */}
                <a style={{ cursor: 'pointer' }} onClick={LogOutHandler}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-in-left" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0z"></path><path fill-rule="evenodd" d="M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708z"></path></svg>
                  Logout</a>
              </div>
            )}


            <div className={`saidmenumain sidebar ${isMenuOpen ? 'open' : ''}`}style={{marginTop: '5px'}}>
              <IonHeader >
                <IonToolbar color="secondary" style={{padding: '10px 0 7px 0', }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background:'#4c3226' }}>
                    <div>
                      <IonImg
                        slot="start"
                        src="/img/logo.svg"
                        style={{ height: '35px', margin: '0', marginLeft: '10px' }}
                      ></IonImg>
                    </div>
                    <div>
                      <button onClick={() => setMenuOpen(false)} style={{ background: 'transparent', margin: '0 10px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="bisque" class="bi bi-x-lg" viewBox="0 0 16 16">
                          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </IonToolbar>
              </IonHeader>
              <IonContent class='main-saidebar'>
                <IonGrid style={{ marginTop: '6px' }} >
                  <IonRow>
                    <IonCol>
                      <div className='bottom-footer-menu' style={{ marginBottom: '10px', fontSize: '18px' }}>
                        <span style={{ fontSize: '16px', fontWeight: '600' }}>- Categories</span>
                      </div>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    {/* {loading ? (
                      <IonCol><p>Loading...</p></IonCol>
                    ) : (
                      homeDetails.length > 0 ? (
                        homeDetails.map((item) => (
                          <IonCol size="4" key={item._id}>
                            <ion-router-link href={`/category/${item._id}`} style={{ textDecoration: 'none' }}>
                              <div className='main-categoryimg'>
                                <IonImg className='categoryimg' src={IMG_PATH + item?.filepath} />
                                <IonImg className='categoryimg1' src="/img/catagory-bg.png" />
                              </div>
                              <IonTitle>{item.name}</IonTitle>
                            </ion-router-link>
                          </IonCol>
                        ))
                      ) : (
                        <IonCol><p>No categories available.</p></IonCol>
                      )
                    )} */}
                    <IonCol size='12'>
                      <div className="accordion">
                        <div className="accordion-item" >
                          <h2 className="accordion-header">
                            <button
                              className={`accordion-button ${activeIndex === 0 ? '' : 'collapsed'}`}
                              type="button"
                              onClick={() => handleToggle(0)}
                              aria-expanded={activeIndex === 0 ? 'true' : 'false'}
                            >
                              <ion-router-link href={`/category/${categories[0]?._id}`} style={{ color: '#ffe4c4' }}>
                                {
                                  categories[0]?.name
                                }
                              </ion-router-link>
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" class="bi bi-arrow-down-circle" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z" />
                              </svg>
                            </button>
                          </h2>
                          <div className={`accordion-collapse ${activeIndex === 0 ? 'show' : ''}`} >
                            <div className="accordion-body">
                              <IonRow>
                                {
                                  categoryCollection[0]?.populateCollections.length > 0 &&
                                  <IonCol size-md="4" size="6">
                                    <h6>SHOP BY STYLE</h6>
                                    <ul className="footer-links">

                                      {
                                        categoryCollection[0]?.populateCollections?.map((val) => {
                                          return <li>
                                            <ion-router-link
                                              href={`/category/${categories[0]?._id}?collection=${val?.populateCollection?._id}`}

                                            >
                                              <span className="title" style={{ fontSize: '13px', textTransform: 'uppercase' }}>{val.populateCollection?.name}</span>
                                            </ion-router-link >
                                          </li>
                                        })
                                      }
                                    </ul>
                                  </IonCol>
                                }
                                <IonCol size-md="4" size="6">
                                  <h6 style={{ marginTop: '20px' }}>SHOP FOR</h6>
                                  <ul class="footer-links">
                                    <li>
                                      <ion-router-link
                                        href={`/category/${categories[0]?._id}`}
                                      >
                                        <span className="title">All</span>
                                      </ion-router-link>
                                    </li>
                                  </ul>
                                  <h6 style={{ marginTop: '20px' }}>ALL SHAPE IN</h6>
                                  <div class="shapimggrp">
                                    <ion-router-link href={`/category/${categories[0]?._id}?shap=asscher`} >
                                      <img src="/img/icone-shap/asscher.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[0]?._id}?shap=cushion`}>
                                      <img src="/img/icone-shap/cushion.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[0]?._id}?shap=emerald`}>
                                      <img src="/img/icone-shap/emerald.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[0]?._id}?shap=heart`}>
                                      <img src="/img/icone-shap/heart.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[0]?._id}?shap=marquise`}>
                                      <img src="/img/icone-shap/marquise.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[0]?._id}?shap=oval`}>
                                      <img src="/img/icone-shap/oval.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[0]?._id}?shap=pear`}>
                                      <img src="/img/icone-shap/pear.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[0]?._id}?shap=princess`}>
                                      <img src="/img/icone-shap/princess.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[0]?._id}?shap=radiant`}>
                                      <img src="/img/icone-shap/radiant.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[0]?._id}?shap=round`}>
                                      <img src="/img/icone-shap/round.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                  </div>
                                </IonCol>
                                <IonCol size-md="4" size="12">
                                  <img src="/img/menu5.png" width="100%" alt="img" />
                                </IonCol>
                              </IonRow>
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item" >
                          <h2 className="accordion-header">
                            <button
                              className={`accordion-button ${activeIndex === 1 ? '' : 'collapsed'}`}
                              type="button"
                              onClick={() => handleToggle(1)}
                              aria-expanded={activeIndex === 1 ? 'true' : 'false'}
                            >
                              <ion-router-link href={`/category/${categories[1]?._id}`} style={{ color: '#ffe4c4' }}>
                                {
                                  categories[1]?.name
                                }
                              </ion-router-link>
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" class="bi bi-arrow-down-circle" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z" />
                              </svg>
                            </button>
                          </h2>
                          <div className={`accordion-collapse ${activeIndex === 1 ? 'show' : ''}`} >
                            <div className="accordion-body">
                              <IonRow>
                                {
                                  categoryCollection[1]?.populateCollections.length > 0 &&
                                  <IonCol size-md="4" size="6">
                                    <h6>SHOP BY STYLE</h6>
                                    <ul className="footer-links">

                                      {
                                        categoryCollection[1]?.populateCollections?.map((val) => {
                                          return <li>
                                            <ion-router-link
                                              href={`/category/${categories[1]?._id}?collection=${val?.populateCollection?._id}`}

                                            >
                                              <span className="title" style={{ fontSize: '13px', textTransform: 'uppercase' }}>{val.populateCollection?.name}</span>
                                            </ion-router-link >
                                          </li>
                                        })
                                      }
                                    </ul>
                                  </IonCol>
                                }
                                <IonCol size-md="4" size="6">
                                  <h6 style={{ marginTop: '20px' }}>SHOP FOR</h6>
                                  <ul class="footer-links">
                                    <li>
                                      <ion-router-link
                                        href={`/category/${categories[1]?._id}`}
                                      >
                                        <span className="title">All</span>
                                      </ion-router-link>
                                    </li>
                                  </ul>
                                  <h6 style={{ marginTop: '20px' }}>ALL SHAPE IN</h6>
                                  <div class="shapimggrp">
                                    <ion-router-link href={`/category/${categories[1]?._id}?shap=asscher`} >
                                      <img src="/img/icone-shap/asscher.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[1]?._id}?shap=cushion`}>
                                      <img src="/img/icone-shap/cushion.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[1]?._id}?shap=emerald`}>
                                      <img src="/img/icone-shap/emerald.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[1]?._id}?shap=heart`}>
                                      <img src="/img/icone-shap/heart.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[1]?._id}?shap=marquise`}>
                                      <img src="/img/icone-shap/marquise.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[1]?._id}?shap=oval`}>
                                      <img src="/img/icone-shap/oval.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[1]?._id}?shap=pear`}>
                                      <img src="/img/icone-shap/pear.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[1]?._id}?shap=princess`}>
                                      <img src="/img/icone-shap/princess.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[1]?._id}?shap=radiant`}>
                                      <img src="/img/icone-shap/radiant.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[1]?._id}?shap=round`}>
                                      <img src="/img/icone-shap/round.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                  </div>
                                </IonCol>
                                <IonCol size-md="4" size="12">
                                  <img src="/img/menu2.png" width="100%" alt="img" />
                                </IonCol>
                              </IonRow>
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item" >
                          <h2 className="accordion-header">
                            <button
                              className={`accordion-button ${activeIndex === 3 ? '' : 'collapsed'}`}
                              type="button"
                              onClick={() => handleToggle(3)}
                              aria-expanded={activeIndex === 3 ? 'true' : 'false'}
                            >
                              <ion-router-link href={`/category/${categories[3]?._id}`} style={{ color: '#ffe4c4' }}>
                                {
                                  categories[3]?.name
                                }
                              </ion-router-link>
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" class="bi bi-arrow-down-circle" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z" />
                              </svg>
                            </button>
                          </h2>
                          <div className={`accordion-collapse ${activeIndex === 3 ? 'show' : ''}`} >
                            <div className="accordion-body">
                              <IonRow>
                                {
                                  categoryCollection[3]?.populateCollections.length > 0 &&
                                  <IonCol size-md="4" size="6">
                                    <h6>SHOP BY STYLE</h6>
                                    <ul className="footer-links">

                                      {
                                        categoryCollection[3]?.populateCollections?.map((val) => {
                                          return <li>
                                            <ion-router-link
                                              href={`/category/${categories[3]?._id}?collection=${val?.populateCollection?._id}`}

                                            >
                                              <span className="title" style={{ fontSize: '13px', textTransform: 'uppercase' }}>{val.populateCollection?.name}</span>
                                            </ion-router-link >
                                          </li>
                                        })
                                      }
                                    </ul>
                                  </IonCol>
                                }
                                <IonCol size-md="4" size="6">
                                  <h6 style={{ marginTop: '20px' }}>SHOP FOR</h6>
                                  <ul class="footer-links">
                                    <li>
                                      <ion-router-link
                                        href={`/category/${categories[3]?._id}`}
                                      >
                                        <span className="title">All</span>
                                      </ion-router-link>
                                    </li>
                                  </ul>
                                  <h6 style={{ marginTop: '20px' }}>ALL SHAPE IN</h6>
                                  <div class="shapimggrp">
                                    <ion-router-link href={`/category/${categories[3]?._id}?shap=asscher`} >
                                      <img src="/img/icone-shap/asscher.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[3]?._id}?shap=cushion`}>
                                      <img src="/img/icone-shap/cushion.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[3]?._id}?shap=emerald`}>
                                      <img src="/img/icone-shap/emerald.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[3]?._id}?shap=heart`}>
                                      <img src="/img/icone-shap/heart.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[3]?._id}?shap=marquise`}>
                                      <img src="/img/icone-shap/marquise.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[3]?._id}?shap=oval`}>
                                      <img src="/img/icone-shap/oval.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[3]?._id}?shap=pear`}>
                                      <img src="/img/icone-shap/pear.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[3]?._id}?shap=princess`}>
                                      <img src="/img/icone-shap/princess.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[3]?._id}?shap=radiant`}>
                                      <img src="/img/icone-shap/radiant.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[3]?._id}?shap=round`}>
                                      <img src="/img/icone-shap/round.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                  </div>
                                </IonCol>
                                <IonCol size-md="4" size="12">
                                  <img src="/img/menu3.png" width="100%" alt="img" />
                                </IonCol>
                              </IonRow>
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item" >
                          <h2 className="accordion-header">
                            <button
                              className={`accordion-button ${activeIndex === 4 ? '' : 'collapsed'}`}
                              type="button"
                              onClick={() => handleToggle(4)}
                              aria-expanded={activeIndex === 4 ? 'true' : 'false'}
                            >
                              <ion-router-link href={`/category/${categories[4]?._id}`} style={{ color: '#ffe4c4' }}>
                                {
                                  categories[4]?.name
                                }
                              </ion-router-link>
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" class="bi bi-arrow-down-circle" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z" />
                              </svg>
                            </button>
                          </h2>
                          <div className={`accordion-collapse ${activeIndex === 4 ? 'show' : ''}`} >
                            <div className="accordion-body">
                              <IonRow>
                                {
                                  categoryCollection[4]?.populateCollections.length > 0 &&
                                  <IonCol size-md="4" size="6">
                                    <h6>SHOP BY STYLE</h6>
                                    <ul className="footer-links">

                                      {
                                        categoryCollection[4]?.populateCollections?.map((val) => {
                                          return <li>
                                            <ion-router-link
                                              href={`/category/${categories[4]?._id}?collection=${val?.populateCollection?._id}`}

                                            >
                                              <span className="title" style={{ fontSize: '13px', textTransform: 'uppercase' }}>{val.populateCollection?.name}</span>
                                            </ion-router-link >
                                          </li>
                                        })
                                      }
                                    </ul>
                                  </IonCol>
                                }
                                <IonCol size-md="4" size="6">
                                  <h6 style={{ marginTop: '20px' }}>SHOP FOR</h6>
                                  <ul class="footer-links">
                                    <li>
                                      <ion-router-link
                                        href={`/category/${categories[4]?._id}`}
                                      >
                                        <span className="title">All</span>
                                      </ion-router-link>
                                    </li>
                                  </ul>
                                  <h6 style={{ marginTop: '20px' }}>ALL SHAPE IN</h6>
                                  <div class="shapimggrp">
                                    <ion-router-link href={`/category/${categories[4]?._id}?shap=asscher`} >
                                      <img src="/img/icone-shap/asscher.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[4]?._id}?shap=cushion`}>
                                      <img src="/img/icone-shap/cushion.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[4]?._id}?shap=emerald`}>
                                      <img src="/img/icone-shap/emerald.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[4]?._id}?shap=heart`}>
                                      <img src="/img/icone-shap/heart.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[4]?._id}?shap=marquise`}>
                                      <img src="/img/icone-shap/marquise.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[4]?._id}?shap=oval`}>
                                      <img src="/img/icone-shap/oval.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[4]?._id}?shap=pear`}>
                                      <img src="/img/icone-shap/pear.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[4]?._id}?shap=princess`}>
                                      <img src="/img/icone-shap/princess.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[4]?._id}?shap=radiant`}>
                                      <img src="/img/icone-shap/radiant.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[4]?._id}?shap=round`}>
                                      <img src="/img/icone-shap/round.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                  </div>
                                </IonCol>
                                <IonCol size-md="4" size="12">
                                  <img src="/img/menu4.png" width="100%" alt="img" />
                                </IonCol>
                              </IonRow>
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item" >
                          <h2 className="accordion-header">
                            <button
                              className={`accordion-button ${activeIndex === 5 ? '' : 'collapsed'}`}
                              type="button"
                              onClick={() => handleToggle(5)}
                              aria-expanded={activeIndex === 5 ? 'true' : 'false'}
                            >
                              <ion-router-link href={`/category/${categories[5]?._id}`} style={{ color: '#ffe4c4' }}>
                                {
                                  categories[5]?.name
                                }
                              </ion-router-link>
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" class="bi bi-arrow-down-circle" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z" />
                              </svg>
                            </button>
                          </h2>
                          <div className={`accordion-collapse ${activeIndex === 5 ? 'show' : ''}`} >
                            <div className="accordion-body">
                              <IonRow>
                                {
                                  categoryCollection[5]?.populateCollections.length > 0 &&
                                  <IonCol size-md="4" size="6">
                                    <h6>SHOP BY STYLE</h6>
                                    <ul className="footer-links">

                                      {
                                        categoryCollection[5]?.populateCollections?.map((val) => {
                                          return <li>
                                            <ion-router-link
                                              href={`/category/${categories[5]?._id}?collection=${val?.populateCollection?._id}`}

                                            >
                                              <span className="title" style={{ fontSize: '13px', textTransform: 'uppercase' }}>{val.populateCollection?.name}</span>
                                            </ion-router-link >
                                          </li>
                                        })
                                      }
                                    </ul>
                                  </IonCol>
                                }
                                <IonCol size-md="4" size="6">
                                  <h6 style={{ marginTop: '20px' }}>SHOP FOR</h6>
                                  <ul class="footer-links">
                                    <li>
                                      <ion-router-link
                                        href={`/category/${categories[5]?._id}`}
                                      >
                                        <span className="title">All</span>
                                      </ion-router-link>
                                    </li>
                                  </ul>
                                  <h6 style={{ marginTop: '20px' }}>ALL SHAPE IN</h6>
                                  <div class="shapimggrp">
                                    <ion-router-link href={`/category/${categories[5]?._id}?shap=asscher`} >
                                      <img src="/img/icone-shap/asscher.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[5]?._id}?shap=cushion`}>
                                      <img src="/img/icone-shap/cushion.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[5]?._id}?shap=emerald`}>
                                      <img src="/img/icone-shap/emerald.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[5]?._id}?shap=heart`}>
                                      <img src="/img/icone-shap/heart.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[5]?._id}?shap=marquise`}>
                                      <img src="/img/icone-shap/marquise.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[5]?._id}?shap=oval`}>
                                      <img src="/img/icone-shap/oval.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[5]?._id}?shap=pear`}>
                                      <img src="/img/icone-shap/pear.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[5]?._id}?shap=princess`}>
                                      <img src="/img/icone-shap/princess.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[5]?._id}?shap=radiant`}>
                                      <img src="/img/icone-shap/radiant.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[5]?._id}?shap=round`}>
                                      <img src="/img/icone-shap/round.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                  </div>
                                </IonCol>
                                <IonCol size-md="4" size="12">
                                  <img src="/img/menu9.png" width="100%" alt="img" />
                                </IonCol>
                              </IonRow>
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item" >
                          <h2 className="accordion-header">
                            <button
                              className={`accordion-button ${activeIndex === 2 ? '' : 'collapsed'}`}
                              type="button"
                              onClick={() => handleToggle(2)}
                              aria-expanded={activeIndex === 2 ? 'true' : 'false'}
                            >
                              <ion-router-link href={`/category/${categories[2]?._id}`} style={{ color: '#ffe4c4' }}>
                                {
                                  categories[2]?.name
                                }
                              </ion-router-link>
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" class="bi bi-arrow-down-circle" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z" />
                              </svg>
                            </button>
                          </h2>
                          <div className={`accordion-collapse ${activeIndex === 2 ? 'show' : ''}`} >
                            <div className="accordion-body">
                              <IonRow>
                                {
                                  categoryCollection[2]?.populateCollections.length > 0 &&
                                  <IonCol size-md="4" size="6">
                                    <h6>SHOP BY STYLE</h6>
                                    <ul className="footer-links">

                                      {
                                        categoryCollection[2]?.populateCollections?.map((val) => {
                                          return <li>
                                            <ion-router-link
                                              href={`/category/${categories[2]?._id}?collection=${val?.populateCollection?._id}`}

                                            >
                                              <span className="title" style={{ fontSize: '13px', textTransform: 'uppercase' }}>{val.populateCollection?.name}</span>
                                            </ion-router-link >
                                          </li>
                                        })
                                      }
                                    </ul>
                                  </IonCol>
                                }
                                <IonCol size-md="4" size="6">
                                  <h6 style={{ marginTop: '20px' }}>SHOP FOR</h6>
                                  <ul class="footer-links">
                                    <li>
                                      <ion-router-link
                                        href={`/category/${categories[2]?._id}`}
                                      >
                                        <span className="title">All</span>
                                      </ion-router-link>
                                    </li>
                                  </ul>
                                  <h6 style={{ marginTop: '20px' }}>ALL SHAPE IN</h6>
                                  <div class="shapimggrp">
                                    <ion-router-link href={`/category/${categories[2]?._id}?shap=asscher`} >
                                      <img src="/img/icone-shap/asscher.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[2]?._id}?shap=cushion`}>
                                      <img src="/img/icone-shap/cushion.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[2]?._id}?shap=emerald`}>
                                      <img src="/img/icone-shap/emerald.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[2]?._id}?shap=heart`}>
                                      <img src="/img/icone-shap/heart.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[2]?._id}?shap=marquise`}>
                                      <img src="/img/icone-shap/marquise.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[2]?._id}?shap=oval`}>
                                      <img src="/img/icone-shap/oval.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[2]?._id}?shap=pear`}>
                                      <img src="/img/icone-shap/pear.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[2]?._id}?shap=princess`}>
                                      <img src="/img/icone-shap/princess.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[2]?._id}?shap=radiant`}>
                                      <img src="/img/icone-shap/radiant.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                    <ion-router-link href={`/category/${categories[2]?._id}?shap=round`}>
                                      <img src="/img/icone-shap/round.svg" width="100%" alt="img" class="shap-img" />
                                    </ion-router-link>
                                  </div>
                                </IonCol>
                                <IonCol size-md="4" size="12">
                                  <img src="/img/menu6.png" width="100%" alt="img" />
                                </IonCol>
                              </IonRow>
                            </div>
                          </div>
                        </div>
                      </div>
                    </IonCol>


                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <div style={{ marginBottom: '10px', marginTop: '7px' }} className='bottom-footer-menu '>
                        <div style={{ marginBottom: '10px', fontSize: '18px' }}>
                          <span style={{ fontSize: '16px', fontWeight: '600' }}>- About</span>
                        </div>
                        <ion-router-link href="/privacypolicy">
                          <div className='d-flex' style={{ gap: '10px', marginBottom: '7px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#4c3226" class="bi bi-shield-lock" viewBox="0 0 16 16">
                              <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56" />
                              <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415" />
                            </svg>
                            <span>Privacy Policy</span>
                          </div>
                        </ion-router-link>

                        {/* <ion-router-link href={samplePDF1} target="_blank">
                          <div className='d-flex' style={{ gap: '10px', marginBottom: '7px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#4c3226" class="bi bi-aspect-ratio" viewBox="0 0 16 16">
                              <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5zM1.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z" />
                              <path d="M2 4.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H3v2.5a.5.5 0 0 1-1 0zm12 7a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H13V8.5a.5.5 0 0 1 1 0z" />
                            </svg>
                            <span style={{ color: "#f3a41c" }}>Size</span>
                          </div>
                        </ion-router-link>
                        <ion-router-link href={samplePDF2} target="_blank">
                          <div className='d-flex' style={{ gap: '10px', marginBottom: '7px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#4c3226" class="bi bi-infinity" viewBox="0 0 16 16">
                              <path d="M5.68 5.792 7.345 7.75 5.681 9.708a2.75 2.75 0 1 1 0-3.916ZM8 6.978 6.416 5.113l-.014-.015a3.75 3.75 0 1 0 0 5.304l.014-.015L8 8.522l1.584 1.865.014.015a3.75 3.75 0 1 0 0-5.304l-.014.015zm.656.772 1.663-1.958a2.75 2.75 0 1 1 0 3.916z" />
                            </svg>
                            <span style={{ color: "#f3a41c" }}>Finding</span>
                          </div>
                        </ion-router-link> */}
                      </div>
                      <div style={{ marginBottom: '10px', }} className='bottom-footer-menu '>
                        <div style={{ marginBottom: '10px', fontSize: '18px' }}>
                          <span style={{ fontSize: '16px', fontWeight: '600' }}>- Address</span>
                        </div>
                        <div className='d-flex' style={{ gap: '10px', marginBottom: '10px' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#4c3226" class="bi bi-geo-alt" viewBox="0 0 16 16">
                            <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                            <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                          </svg>
                          <span>550 S. Hill St. Suite #1123,Los Angeles, CA 90013, USA
                            <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone" viewBox="0 0 16 16">
                                <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                              </svg>
                              (213) 688-8704</span>
                          </span>

                        </div>
                        <div className='d-flex' style={{ gap: '10px', marginBottom: '10px' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#4c3226" class="bi bi-geo-alt" viewBox="0 0 16 16">
                            <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                            <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                          </svg>
                          <span>22 West 48th St. Suite #1101, New York, NY 10036, USA
                            <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone" viewBox="0 0 16 16">
                                <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                              </svg>
                              (213) 688-8704</span>
                          </span>
                        </div>
                        <a href='mailto:sales@labondiamonds.com' className='d-flex' style={{ gap: '10px', marginBottom: '70px' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#4c3226" class="bi bi-envelope" viewBox="0 0 16 16">
                            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                          </svg>
                          <span>sales@labondiamonds.com</span>
                        </a>

                      </div >

                    </IonCol >
                  </IonRow>
                </IonGrid>
              </IonContent >
            </div>

            {/* <IonMenu contentId="main-content">

            </IonMenu> */}
          </>
        )
      }
        {showModal && (
          <div className="modal1">
            <div className="modal2">
              <form onSubmit={handleSubmit}>
                <div className='user-img'>
                  <IonImg
                    className='freemlogin2'
                    src="/img/userlogo.svg"
                  ></IonImg>
                  {/* <div class="cell smaldesignleft">
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
                  </div> */}

                </div>
                <IonItem>
                  <IonInput type='text' label="Username : " placeholder=" Enter text " fill="clear"
                    color="secondary" value={username}
                    onBlur={handleChangeUsername}>
                  </IonInput>
                </IonItem>
                <IonItem>
                  <IonInput type='tel' label="Mobile No : " placeholder=" Enter number " fill="clear"
                    color="secondary" value={mobileNo}
                    onBlur={handleChangePhone}>
                  </IonInput>
                </IonItem>
                <IonItem>
                  <IonInput type='text' label="Email : " placeholder=" Enter Email " fill="clear"
                    color="secondary" value={email}
                    onBlur={handleChangeemail}>
                  </IonInput>
                </IonItem>
                <IonItem>
                  <IonInput type='text' label="Refrence Name : " placeholder="Enter Refrence " fill="clear"
                    color="secondary" value={refrence}
                    onBlur={handleChangrefrence}>
                  </IonInput>
                </IonItem>
                <IonItem>
                  <IonInput type='text' label="Company Name : " placeholder="Enter Company " fill="clear"
                    color="secondary" value={company}
                    onBlur={handleChangcompany}>
                  </IonInput>
                </IonItem>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button type='submit' style={{ width: '100%', margin: '15px 0 0 0', background: '#f3a41c', color: 'white', padding: '10px 10px', }} expand="full">Save</button>
                  <button onClick={closeModal} style={{ width: '100%', margin: '15px 0 0 0', background: '#f3a41c', color: 'white', padding: '10px 10px', }} expand="full">Close</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </IonReactRouter>

      </IonApp>
  );
}

export default App; 