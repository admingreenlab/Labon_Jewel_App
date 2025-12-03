import React, { useRef, useEffect, useState, useContext } from 'react';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonItem,
  IonList,
  IonThumbnail,
  IonButton,
  IonButtons,
  IonCardTitle,
  IonRadio,
  IonRadioGroup,
  IonImg,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonInput,
  IonToast,
  IonRefresher, IonRefresherContent,
  IonPage

} from '@ionic/react';
import '../pages/Tab1.css';
import '../main';
import { IonCol, IonGrid, IonRow, IonTabButton } from '@ionic/react';
import Header from './head';
import { IonTextarea } from '@ionic/react';
import { IonModal } from '@ionic/react';
import { addToCart, clearCart, updateToCart } from "../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { IMG_PATH } from "../config";
import jwtAuthAxios from "../service/jwtAuth";
import { DataContext } from "../context/DataProvider";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { chevronDownCircleOutline } from 'ionicons/icons'
import { Button } from 'bootstrap';


const RadioPage = () => {
  const { id } = useParams();
  const [counter, setCounter] = useState(0);
  const items = useSelector((state) => state.items.cart);
  const dispatch = useDispatch();
  const [productDetails, setProductDetails] = useState([]);
  const [selectedType, setSelectedType] = useState("14K");
  const [sizeDetails, setSizeDetails] = useState([]);
  const [selectSize, setSelectSize] = useState(null);
  const [findings, setFindings] = useState([]);
  const [selectedFindings, setSelectedFindings] = useState('');
  const [diamondGroup, setDiamondGroup] = useState([]);
  const [openModalId, setOpenModalId] = useState(null);
  const [cartDetails, setCartDetails] = useState([]);
  const isFetching = useRef(false)
  const {
    wgt14k,
    wgt18k,
    metalcolor,
  } = productDetails;
  const [selectedMetal, setSelectedMetal] = useState(metalcolor);
  const [selectedQuality, setSelectedQuality] = useState('');
  const [editId, setEditId] = useState(null);
  const [editItemId, setEditItemId] = useState(null);
  const [editItemDetails, setEditItemDetails] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userDetail, setUserDetail] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [form, setForm] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    companyName: "",
    referenceName: "",
  });
  const history = useHistory();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');



  const fetchDataForItem = async (item) => {
    if (isFetching.current) return;
    isFetching.current = true;
    try {
      const response = await jwtAuthAxios.get(
        `master/alldetails?id=${item?.item?.itemtype}`
      );
      setProductDetails(response?.data);
      setSizeDetails(response?.data?.categorySizes);
      setDiamondGroup(response?.data?.diamondParams);
      setFindings(response?.data?.categorySizes[0]?.findings);

      // Set the state variables here
      const metalParts = item.metal.split("-");
      const metalType = metalParts[0];
      const metalcolor = metalParts[1];

      setSelectedType(metalType);
      setSelectedMetal(metalcolor?.toUpperCase());
      setSelectedFindings(item?.finding);
      setSelectedQuality(item?.diamondQuality);
      setSelectSize(item?.size);
      setEditId(item?._id);
      setEditItemId(item?.item?._id);
      setEditItemDetails(item);

    } catch (error) {
      console.error(error?.response?.data?.error);
    }
    finally {
      isFetching.current = false;
    }
  };


  const handleRefresh = async (event) => {
    await fetchCartData();
    setTimeout(() => {
      // Any calls to load data go here
      event.detail.complete();
    }, 1500); // Signal that the refresh is complete
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };



  const handleRemoveItem = async (id) => {
    try {
      let payload = {
        itemId: id,
      };
      const response = await jwtAuthAxios.post("client/cart/remove", payload);
      dispatch(addToCart());
      fetchCartData();
      setToastMessage('Item removed successfully');
      setShowToast(true);
    } catch (error) {
      console.error(error?.response?.data?.error);
    }
  };


  const handleSaveChanges = (e, index) => {
    const updatedItem = {
      ...editItemDetails,
      metal: `${selectedType}-${selectedMetal}-GOLD`,
      diamondQuality: selectedQuality,
      size: selectSize,
      finding: selectedFindings,
    };

    setCartDetails((prevCart) => ({
      ...prevCart,
      items: prevCart.items.map((item, ind) =>
        item.item._id === editItemId && ind === index ? updatedItem : item
      ),
    }));

    dispatch(
      updateToCart({
        itemId: editId,
        quantity: editItemDetails?.quantity,
        metal: `${selectedType}-${selectedMetal}-GOLD`,
        diamondQuality: selectedQuality,
        size: selectSize,
        finding: selectedFindings,
      })
    );
    setToastMessage('Update successfully');
    setShowToast(true);
    setOpenModalId(false);
  };

  const handleSizeChange = (e) => {
    setSelectSize(e.target.value);
  };

  const handleFindingsChange = (e) => {
    setSelectedFindings(e.target.value);
  };


  const openModal = (itemId) => {
    setOpenModalId(itemId);
  };

  const closeModal = () => {
    setOpenModalId(null);
  };


  const handleEditClick = (item) => {
    fetchDataForItem(item);
    openModal(item?._id);
  };


  const handleQuantityChange = (itemId, ind, delta, quantity, id) => {
    setCartDetails((prevCart) => ({
      ...prevCart,
      items: prevCart.items.map((item, index) =>
        item.item._id === itemId && index === ind
          ? { ...item, quantity: item.quantity + delta }
          : item
      ),
    }));
    dispatch(updateToCart({ itemId: id, quantity: quantity + delta }));
  };


  const parseSize = (size) => {
    const match = size?.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const sortedSizes = sizeDetails?.sort(
    (a, b) => parseSize(a?.size) - parseSize(b?.size)
  );

  useEffect(() => {
    if (findings?.length > 0) {
      setSelectedFindings(findings[0].finding);
    }
  }, [findings]);



  const fetchCartData = async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    try {
      const response = await jwtAuthAxios.get("client/cart");
      setCartDetails(response?.data);
    } catch (error) {
      console.error(error?.response?.data?.error);
    }
    finally {
      isFetching.current = false;
    }
  };


  useEffect(() => {
    fetchCartData();
  }, []);


  useEffect(() => {
    if (metalcolor) {
      setSelectedMetal(metalcolor?.toUpperCase());
    }
  }, [metalcolor]);

  const handleTypeMessage = (id, e, index) => {
    setCartDetails((prevCart) => {
      return {
        ...prevCart,
        items: prevCart.items?.map((item, ind) =>
          item?.item._id === id && ind === index
            ? {
              ...item,
              message: e.target.value,
            }
            : item
        ),
      };
    });
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let err = [];

    if (err?.length > 0) {
      alert("Please address the following issues: \n" + err.join("\n"));
      return err;
    } else {
    }

    if (
      !form.fullName ||
      !form.mobileNumber ||
      !form.email ||
      !form?.companyName
    ) {
      alert("Please fill in all User required fields.");
      return;
    }
    try {
      let payload = {
        user: form,
        items: cartDetails,
      };
      const response = await jwtAuthAxios.post("client/quote-request", payload);
      setToastMessage('Quote Request submitted successfully');
      setShowToast(true);
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...userDetail,
          username: form?.fullName,
          email: form?.email,
          phone: form?.mobileNumber,
          companyName: form?.companyName,
          referenceName: form?.referenceName,
        })
      );
      dispatch(clearCart());
      history.push("/thanks")
      window.location.href = '/thanks';

    } catch (error) {
      console.error(error?.response?.data?.error);
    }
  };

  useEffect(() => {
    setForm({
      fullName: userDetail?.username,
      mobileNumber: "",
      email: '',
      companyName: '',
      referenceName: userDetail?.referenceName,
    });
  }, [userDetail]);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      if (updatedUser) {
        setUserDetail(JSON.parse(updatedUser));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);


  return (
 <IonPage>
      <Header />
      <IonHeader>
            {/* <h1>Home</h1> */}
      </IonHeader>
                <div style={{ margin: '30px', marginTop: '130px' }}></div>
      <IonContent color="primary" style={{ paddingBottom: '80x', marginBottom: '100px' }}>
        <h4 className="text-center mb-5 element" style={{ marginTop: '20px' }}>add to Card</h4>

        {cartDetails?.items?.length === 0 || cartDetails?.message ? (
          <div
            style={{
              background: "#fff6ec",
              display: "flex",
              alignItems: "center",
              justifyContent: 'center'
            }}
          >
            <div>
              <IonImg
                src='/img/datanotfound.png'
                style={{ maxWidth: "360px", width: "100%" }}
              />
              <h3 style={{ textAlign: 'center' }}>Your cart is empty</h3>
            </div>
          </div>
        ) : (
          <div style={{ paddingBottom: '80x', marginBottom: '115px', position: 'relative' }}>
            {cartDetails?.items?.map((item, index) => (
              <div style={{ padding: ' 0', border: '1px solid rgb(0 0 0 / 19%)', margin: '10px', borderRadius: '9px', background: '#fff' }}>
                <IonGrid>
                  <IonRow key={`${item.item?._id}-${index}`} >
                    <IonCol size='12'>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'space-between' }}>
                        <IonCardTitle style={{ color: '#4c3226', justifyContent: 'center', display: 'flex', fontSize: '16px' }}>
                          {item?.item?.name}
                        </IonCardTitle>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div>
                            <button onClick={() => handleEditClick(item)} style={{ padding: '10px', borderRadius: '30px' }}>
                              <div key={`${item.item?._id}-${index}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="green" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                </svg>
                              </div>
                            </button>
                          </div>
                          <button shape='round' onClick={() => handleRemoveItem(item?.item?._id)} style={{ padding: '10px', borderRadius: '30px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="red" class="bi bi-trash3" viewBox="0 0 16 16">
                              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </IonCol>
                    <IonCol size="4">
                      <IonCardHeader style={{ padding: '0px', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                        <img src={IMG_PATH + item?.item?.thumbnailImage}
                          alt={item?.sku} style={{ maxWidth: "160px", width: '100%', height: '125px', objectFit: 'contain' }} />
                      </IonCardHeader>
                    </IonCol>
                    <IonCol size="8">
                      <IonCardContent style={{ padding: '0', border: '0' }} border="0">
                        <IonList style={{ border: '0' }}>
                          <div style={{ border: '0' }}>
                            <div className='d-block' style={{ paddingBottom: '10px' }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '5px' }}>
                                <h5 className="badge me-2" >{item?.metal}</h5>
                                <h5 className="badge me-2" >{item?.size}</h5>
                                <h5 className="badge me-2" >{item?.finding}</h5>
                                <h5 className="badge me-2" >{item?.diamondQuality}</h5>
                                <h5 className="badge me-2" >{item?.item?.colorstone}</h5>
                                {item?.item?.sidectwt > 0 && (
                                  <h5 className="badge me-2" >
                                    Side Cts : {(item?.item?.sidectwt).toFixed(2)}
                                  </h5>
                                )}
                                {item?.item?.centerctwt > 0 && (
                                  <h5 className="badge me-2" >
                                    Center Cts :{" "}
                                    {(item?.item?.centerctwt).toFixed(2)}
                                  </h5>
                                )}
                                {/* <h5 className="badge me-2" >Total Diamonds :{item?.item?.diaqty}</h5> */}
                                <h5 className="badge me-2" >
                                  {selectedType === "14K" && `14k weight : ${item?.item?.wgt14k?.toFixed(2)}`}
                                </h5>
                                <h5 className="badge me-2" >
                                  {selectedType === "18K" && `18k weight : ${item?.item?.wgt18k?.toFixed(2)}`}
                                </h5>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'Poppins', marginTop: '20px' }}>
                                <button onClick={() =>
                                  handleQuantityChange(
                                    item?.item?._id,
                                    index,
                                    -1,
                                    item?.quantity,
                                    item?._id
                                  )
                                }
                                  disabled={item?.quantity === 1}
                                >
                                  <div style={{ border: '1px solid #000000b8', padding: '6px 12px', borderRadius: ' 10px 0px 0px 10px' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="grey" class="bi bi-dash-circle" viewBox="0 0 16 16">
                                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                      <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                                    </svg>
                                  </div>
                                </button>
                                <span style={{
                                  margin: '0px 2px', width: '16px', textAlign: 'center', color: 'black'
                                }}>{item?.quantity}</span>
                                < button fill="clear" size='large' onClick={() =>
                                  handleQuantityChange(
                                    item?.item?._id,
                                    index,
                                    1,
                                    item?.quantity,
                                    item?._id
                                  )
                                }
                                >
                                  <div style={{ border: '1px solid #000000b8', padding: '6px 12px', borderRadius: ' 0px 10px 10px 0px' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="grey" class="bi bi-plus-circle" viewBox="0 0 16 16">
                                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                    </svg>
                                  </div>
                                </button>
                              </div>
                              <IonTextarea

                                fill="outline"
                                placeholder="Type Message"
                                style={{ color: 'black', marginTop: '15px',border:"1px solid gray", borderRadius:"5px", padding:"5px" }}
                                value={item?.message || ''}
                                onIonChange={(e) => handleTypeMessage(item?.item?._id, e, index)}
                              ></IonTextarea>
                            </div>
                          </div>
                        </IonList>
                      </IonCardContent>
                    </IonCol>
                    <div>
                      {openModalId === item?._id && (
                        <div className="popup-1" >
                          <div className="popup popup235">

                            <div>
                              <h6>Metal</h6>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  margin: '0',
                                }}
                              >
                                <div
                                  className={`btn btn-default ${selectedType === '14K' ? 'selected' : ''}`}
                                  onClick={() => setSelectedType('14K')}
                                  style={{
                                    color: 'black',
                                    marginRight: '0',
                                    width: '100%',
                                    maxWidth: '100%',
                                    border: selectedType === '14K' ? '2px solid #c39862' : '2px solid #ccc',
                                    background: selectedType === '14K' ? '#ffe6ca' : '#fff',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <div style={{ width: '100%' }}>
                                    <span className="option-label">14K Gold</span>
                                    <div
                                      className="px-product"
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        flexFlow: 'wrap',
                                      }}
                                    >
                                      {item?.item.wgt14k?.toFixed(2)} Grams
                                      <sub
                                        style={{
                                          color: 'rgb(76 50 38)',
                                          display: 'block',
                                        }}
                                      >
                                        * Approx. Weight
                                      </sub>
                                    </div>
                                  </div>
                                </div>

                                <div
                                  className={`btn btn-default ${selectedType === '18K' ? 'selected' : ''}`}
                                  onClick={() => setSelectedType('18K')}
                                  style={{
                                    color: 'black',
                                    marginRight: '0',
                                    width: '100%',
                                    maxWidth: '100%',
                                    border: selectedType === '18K' ? '2px solid #c39862' : '2px solid #ccc',
                                    background: selectedType === '18K' ? ' #ffe6ca' : '#fff',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <div style={{ width: '100%' }}>
                                    <span className="option-label">18K Gold</span>
                                    <div
                                      className="px-product"
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        flexFlow: 'wrap',
                                      }}
                                    >
                                      {item?.item.wgt18k?.toFixed(2)} Grams
                                      <sub
                                        style={{
                                          color: 'rgb(76 50 38)',
                                          display: 'block',
                                        }}
                                      >
                                        * Approx. Weight
                                      </sub>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='main-color'>
                              <h6>Metal Color</h6>
                              <IonRadioGroup value={selectedMetal} onIonChange={e => setSelectedMetal(e.detail.value)} expand="block" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0', justifyContent: 'space-between' }}>
                                {["ROSE", "WHITE", "YELLOW"].map((metal) => (
                                  <IonRadio
                                    key={metal}
                                    className="btn btn-default"
                                    value={metal}
                                    color='secondary'
                                    labelPlacement="fixed"
                                    alignment="center"
                                    style={{ color: 'black', marginRight: '0', maxWidth: '80px' }}
                                  >
                                    <div style={{ width: '60%' }}>
                                      <span className="option-label">
                                        <IonImg className='slider-img '
                                          src={`/img/color-${metal.toLowerCase()}.svg`}
                                          style={{ width: '26px', height: '26px', objectFit: 'cover', borderRadius: '9px' }}
                                        />
                                      </span>
                                      <div className="px-product">
                                        {metal}
                                      </div>
                                    </div>
                                  </IonRadio>
                                ))}
                              </IonRadioGroup>
                            </div>
                            <div className="diamondcolmin">
                              <h6>Diamond Quality</h6>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  margin: '0',
                                  flexWrap: 'wrap',
                                }}
                              >
                                {diamondGroup && diamondGroup.length > 0 ? (
                                  diamondGroup.map((item, i) =>
                                    item.data.map((ele, j) => (
                                      <div
                                        key={`${i}-${j}`}
                                        className="diamondcol"
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '10px',
                                          margin: '0',
                                        }}
                                      >
                                        <label
                                          style={{
                                            color: '#4c3226',
                                            padding: '5px 6px',
                                            backgroundColor:
                                              selectedQuality === ele ? 'rgb(255 230 202)' : 'rgb(255 255 255)',
                                            cursor: 'pointer',
                                            borderRadius: '24px',
                                            border: '1px solid #a7a7a7',
                                            transition: 'background-color 0.3s ease',
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                          }}
                                        >
                                          <input
                                            type="radio"
                                            name="diamondQuality"
                                            value={ele}
                                            checked={selectedQuality === ele}
                                            onChange={() => setSelectedQuality(ele)}
                                            style={{ margin:"auto",marginRight: '5px',color:'pink' }}
                                          />

                                          <span>{ele}</span>
                                        </label>
                                      </div>
                                    ))
                                  )
                                ) : (
                                  <p>No diamond group data available</p>
                                )}
                              </div>
                            </div>
                            <div>
                              <IonCol>
                                {sortedSizes?.length > 0 &&
                                  sortedSizes[0]?.sizes &&
                                  sortedSizes[0]?.sizes?.length > 0 && (
                                    <select

                                      value={selectSize}
                                      placeholder="Select Size"
                                      onChange={(e) => handleSizeChange(e)}


                                      style={{
                                        borderRadius: '10px',
                                        // margin: '0px 0px 0px 10px',
                                        fontSize: '17px',
                                        border: '1px solid #7f7d7d',
                                        backgroundColor: '#fff6ec',
                                        color: 'rgb(76 50 38)',
                                        padding: '12px 12px',
                                        margin: '10px -5px'

                                      }}
                                      size="small"
                                    >
                                      {sortedSizes[0].sizes.map(
                                        (size, i) => (
                                          <option
                                            key={size?._id}
                                            value={size?.size}
                                          >
                                            {size?.size}
                                          </option>
                                        )
                                      )}

                                    </select>
                                  )}
                                {findings?.length > 0 && (
                                  <IonSelect
                                    label-placement="stacked"
                                    value={selectedFindings || ""}
                                    placeholder="Select Size"
                                    onIonChange={(e) => handleFindingsChange(e)}
                                    interface="popover"
                                    style={{
                                      borderRadius: '10px',

                                      fontSize: '16px',
                                      border: '1px solid #7f7d7d',
                                      backgroundColor: '#fff6ec',
                                      color: 'rgb(76 50 38)',
                                      padding: '0px 10px'
                                    }}
                                    size="small"
                                  >
                                    {findings.map((finding, i) => (
                                      <IonSelectOption
                                        key={finding?._id}
                                        value={finding?.finding}
                                      >
                                        {finding?.finding}
                                      </IonSelectOption>
                                    ))}

                                  </IonSelect>
                                )}
                              </IonCol>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <button onClick={(e) => handleSaveChanges(e, index)} style={{ width: '100%', margin: '15px 0', background: '#f3a41c', padding: '10px',color:'white', fontSize:'14px' }} expand="full">Save</button>
                              <button onClick={() => setOpenModalId(null)} style={{ width: '100%', margin: '15px 0', background: '#f3a41c', padding: '10px',color:'white', fontSize:'14px' }} expand="full">Close</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                  </IonRow>
                </IonGrid>

              </div>
            ))}
            <IonToast
              isOpen={showToast}
              onDidDismiss={() => setShowToast(false)}
              message={toastMessage}
              duration={2000}
            />
            <div>
              <div style={{ display: 'flex', justifyContent: 'center', }}>
                <button color='secondary' style={{ padding: '10px', background: '#4c3226', fontSize: '15px', color: 'white', textTransform: 'uppercase' }} onClick={toggleDropdown}>
                  Quotation Details
                </button>
              </div>
            </div>
          </div>
        )}


        {showDropdown && (
          <div className='profileque'>
            <div className='profileque-1'>
              <div onClick={closeDropdown} style={{ fontSize: '24px', justifyContent: 'end', padding: '0', display: 'flex', marginBottom: '-14px', marginRight: '10px', marginTop: '10px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                </svg>
              </div>
              <div className="profile" style={{ marginTop: '10px' }}>
                <IonCardHeader>
                  <IonCardTitle style={{ color: 'rgb(76 50 38)', fontSize: '20px', letterSpacing: '1.1px' }}>Quotation Details</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <form onSubmit={handleSubmit}>
                    <IonLabel position="stacked" style={{ display: 'flex' }}>
                      Name:<span className="text-danger" style={{ color: 'red' }}>*</span>
                    </IonLabel>
                    <IonInput
                      style={{ textAlign: 'start' }}
                      value={form?.fullName}
                      onIonChange={handleInputChange}
                      type="text"
                      name="fullName"
                      required
                      disabled
                    />
                    <IonLabel position="stacked" style={{ display: 'flex' }}>
                      Customer Mobile No:<span className="text-danger" style={{ color: 'red' }}>*</span>
                    </IonLabel>
                    <IonInput
                      style={{ textAlign: 'start' }}
                      value={form?.mobileNumber}
                      type="tel"
                      name="mobileNumber"
                      onIonChange={handleInputChange}
                      required
                      fill="clear"
                      color="secondary"
                    />
                    <IonLabel position="stacked" style={{ display: 'flex' }}>
                      Customer Email:<span className="text-danger" style={{ color: 'red' }}>*</span>
                    </IonLabel>
                    <IonInput
                      style={{ textAlign: 'start' }}
                      value={form?.email}
                      type="email"
                      name="email"
                      onIonChange={handleInputChange}
                      color="secondary"
                      required
                    />
                    <IonLabel position="stacked" style={{ display: 'flex' }}>
                      Company Name:<span className="text-danger" style={{ color: 'red' }}>*</span>
                    </IonLabel>
                    <IonInput
                      style={{ textAlign: 'start' }}
                      value={form?.companyName}
                      type="text"
                      name="companyName"
                      color="secondary"
                      onIonChange={handleInputChange}
                      required
                    />
                    <IonLabel position="stacked" style={{ display: 'flex' }}>
                      Reference Name:<span className="text-danger" style={{ color: 'red' }}>*</span>
                    </IonLabel>
                    <IonInput
                      style={{ textAlign: 'start' }}
                      value={form?.referenceName}
                      onIonChange={handleInputChange}
                      type="text"
                      color="secondary"
                      name="referenceName"
                      required
                    />
                  </form>
                  <form onSubmit={handleSubmit}>
                    <button expand="full" type="submit" style={{ background: '#feddb2', padding: '8px', letterSpacing: '0.1px', marginTop: '10px', color: '#4c3226', display: 'block', fontSize: '15px', width: '100%', textTransform: 'uppercase', }} >
                      Confirm Order
                      <span style={{ fontSize: '12px', marginTop: '5px', textTransform: 'capitalize' }}>(Ask for Quotation)</span>
                    </button>
                  </form>
                </IonCardContent>
              </div>
            </div>
          </div>
        )}
      </IonContent >
</IonPage>
  );
};

export default RadioPage;