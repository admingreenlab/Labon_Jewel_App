import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
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
    IonInput,
    IonCheckbox,
    IonRange,
    IonRefresher, IonRefresherContent,

} from '@ionic/react';
import { useParams, useLocation } from "react-router-dom";
import { IonCol, IonGrid, IonRow, IonTabButton } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Header from './head';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '../pages/Tab1.css';
import { IMG_PATH } from "../config";
import jwtAuthAxios from "../service/jwtAuth";
import { Navigation, Autoplay } from 'swiper/modules';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../store/actions';
import { chevronDownCircleOutline } from 'ionicons/icons';
import {useMargin}  from "../context/Margincontext"

function Category() {
    const { id } = useParams();
    const location = useLocation();
    const [categoryDetails, setCategoryDetails] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    const [selectedSku, setSelectedSku] = useState('');
    const [selectedDescription, setSelectedDescription] = useState('');
    const [hoveredItemId, setHoveredItemId] = useState(null);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(1);
    const [hoveredImage, setHoveredImage] = useState('');
    const [pageSize, setPageSize] = useState(100);
    const [CategoryFilter, setCategoryFilter] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    //const [selectedCollection, setSelectedCollection] = useState([])
    const [subcollection, setSubcollection] = useState([])
    const [itemname, setItemname] = useState('')
    const isFetching = useRef(false)
    const dispatch = useDispatch();
    const { filters } = useSelector((state) => state.filter);
    const [pendingFetch, setPendingFetch] = useState(false);
    const [attr, setAttr] = useState([]);
    const [filterDetails, setFilterDetails] = useState(filters?.filter || {
        minctswts: 0, maxctswts: null, minGramWt: 0, maxGramWt: null, minpointer: 0,
        maxpointer: 0,
        attr: [],
        shape: new URLSearchParams(location.search).get("shap") ? [new URLSearchParams(location.search).get("shap")] : [],
    });

    const [maxattr, setMaxttr] = useState({});
    const [totalitem, setTotalitem] = useState([]);
    const [maxctswts, setMaxctswts] = useState(null);
    const [maxGramWt, setMaxGramWt] = useState(null);

    const [selectedCollection, setSelectedCollection] = useState(
        new URLSearchParams(location.search).get("collection") ? [new URLSearchParams(location.search).get("collection")] : []
    );
      const [Shapedetails, setShapedetails] = useState([]);
        const isInitialMount = useRef(true);
        const { marginValue } = useMargin(); 
    // const fetchCategoryData = async (filterflag) => {
    //     if (isFetching.current) return;
    //     isFetching.current = true;
    //     setLoading(true);



    //     try {
    //         const response = await jwtAuthAxios.post(`client/category?id=${id}&page=${page}&limit=${pageSize}`, {
    //             CategoryFilter,
    //             CollectionFilter: selectedCollection,
    //             filter: filterDetails,

    //         });
    //         // console.log("Fetching with filters:", selectedCategories);
    //         setMaxttr(response?.data?.maxAttr);
    //         if (filterDetails.attr.length <= 0) {
    //             setAttr(response?.data.attribute[0].attr);
    //         }
    //         if (filterflag) {
    //             setFilterDetails({
    //                 minctwts: 0,
    //                 maxctwts: 0,
    //                 minGramWt: 0,
    //                 maxGramWt: 0,
    //                 minpointer: 0,
    //                 maxpointer: 0,
    //                 attr: [],
    //             });
    //         } else {
    //             setFilterDetails(response?.data?.filter);
    //         }
    //         setCategoryDetails(response?.data?.data);
    //         // setSubcategories(response?.data.CategoryFilter);
    //         setSubcollection(response.data.CollectionFilter)
    //         setTotalCount(response?.data?.pagination?.totalCount);
    //         setItemname(response.data.data[0].itemtype.name)
    //         setError(null);

    //     } catch (error) {
    //         console.error(error?.response?.data?.error)
    //     } finally {
    //         setLoading(false);
    //         isFetching.current = false;
    //     }
    // };

    const fetchCategoryData = async (filterflag) => {
        if (isFetching.current) return;
        isFetching.current = true;
        setLoading(true);

        try {
            const response = await jwtAuthAxios.post(`client/category?id=${id}&page=${page}&limit=${pageSize}`, {
                CategoryFilter,
                CollectionFilter: selectedCollection,
                filter: filterDetails,
                marginselect: marginValue,
            });
            // console.log("Filter sent to backend:", filterDetails);
            setMaxttr(response?.data?.maxAttr);
            if (filterflag) {
                setFilterDetails({
                    minctswts: 0,
                    maxctswts: null,
                    minGramWt: 0,
                    maxGramWt: null,
                    minpointer: 0,
                    maxpointer: 0,
                    attr: [],
                    shape: [],
                });
            } else {
                setFilterDetails(response?.data?.filter);
                if (maxctswts === null && response?.data?.maxctswts !== undefined) {
                    console.log("Max CTWTS from API:", response.data.maxctswts);
                    setMaxctswts(response.data.maxctswts); // Update maxctwts state
                    setFilterDetails(prev => ({
                        ...prev,
                        maxctswts: response.data.maxctswts // Update filter details as well
                    }));

                }

                if (maxGramWt === null && response?.data?.maxGramWt !== undefined) {
                    setMaxGramWt(response.data.maxGramWt); // Update to dynamic value
                    setFilterDetails(prev => ({
                        ...prev,
                        maxGramWt: response.data.maxGramWt // Also update filter details if needed
                    }));
                }
            }
            // Update state with fetched data
            setShapedetails(response?.data?.shapeData);
            setCategoryDetails(response?.data?.data);
            setTotalCount(response?.data?.pagination?.totalCount);
            setSubcollection(response.data.CollectionFilter)
            setItemname(response.data.data[0].itemtype.name)
            setTotalitem(response.data.pagination.totalCount)
            setError(null);
        } catch (error) {
            console.error(error?.response?.data?.error);
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    };


    const demosub = async () => {
        const response = await jwtAuthAxios.post(`client/category?id=${id}&page=${page}&limit=${pageSize}`, {
            CategoryFilter,
            CollectionFilter: selectedCollection,
            filter: filterDetails,

        });
        setSubcategories(response?.data.CategoryFilter);
    }

    useEffect(() => {
        demosub()
    }, [])

    const handleCategoryChange = (categoryId) => {
        // Toggle the selected category
        const updatedCategories = CategoryFilter.includes(categoryId)
            ? CategoryFilter.filter(id => id !== categoryId)
            : [...CategoryFilter, categoryId];

        setCategoryFilter(updatedCategories);
        dispatch(setFilter(updatedCategories));
    };

    const handleCollectionChange = (collectionId) => {
        const updatedCollection = selectedCollection.includes(collectionId)
            ? selectedCollection.filter(id => id !== collectionId)
            : [...selectedCollection, collectionId];

        setSelectedCollection(updatedCollection);
        dispatch(setFilter(updatedCollection));
    };



    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        const numericValue = value === '' ? '' : parseFloat(value);

        if (value !== '' && isNaN(numericValue)) {
            console.error(`Invalid input for ${name}: ${value}`);
            return;
        }

        setFilterDetails((prevDetails) => ({
            ...prevDetails,
            [name]: numericValue,
        }));

        setPendingFetch(true);
    };

    const handleShapeCheckboxChange = (event, item) => {

        const { checked } = event.target;

        setFilterDetails((prev) => ({
            ...prev,
            shape: Array.isArray(prev.shape)
                ? checked
                    ? [...prev.shape, item]
                    : prev.shape.filter((shapeName) => shapeName !== item)
                : [item]
        }));

        setPendingFetch(true);
    };


    //   const handleShapeCheckboxChange = (event, item) => {
    //     const { checked } = event.target;

    //     // Update filter details based on checkbox state
    //     setFilterDetails((prev) => ({
    //         ...prev,
    //         shape: checked 
    //             ? [...prev.shape, item] // Add item if checked
    //             : prev.shape.filter((shapeName) => shapeName !== item) // Remove item if unchecked
    //     }));

    //     setPendingFetch(true); // Indicate that a fetch is needed
    // };

    useEffect(() => {
        console.log("useEffect triggered with location.search:", location.search);

        const queryParameters = new URLSearchParams(location.search);
        const shapeFromQuery = queryParameters.get("shap");

        if (shapeFromQuery) {
            const shapeArray = shapeFromQuery.split(",");
            console.log("Shape from URL:", shapeArray);

            setFilterDetails((prev) => ({
                ...prev,
                shape: shapeArray,
            }));
        } else {
            console.log("No shape found in URL");
        }
    }, [location.search]);


    const handleFilterAttrChange = (attr, attributeName, newValue) => {
        if (newValue === "") {
            console.log('" " value found');
            setAttr([]);
            setFilterDetails((prevDetails) => ({
                ...prevDetails,
                attr: [],
            }));
            setPendingFetch(true);
            return;
        }

        const updatedAttr = attr.map((attribute) => {
            if (attribute.name === attributeName) {
                return { ...attribute, value: newValue };
            }
            return attribute;
        });

        setAttr(updatedAttr);
        setFilterDetails((prevDetails) => ({ ...prevDetails, attr: updatedAttr }));
        setPendingFetch(true);
    };

    useEffect(() => {
        if (id) {
            fetchCategoryData();

        }
    }, [id, page, CategoryFilter, selectedCollection, pageSize, marginValue]);


    const handleRefresh = async (event) => {
        await fetchCategoryData();
        setTimeout(() => {
            // Any calls to load data go here
            event.detail.complete();
        }, 1500); // Signal that the refresh is complete
    };



    useEffect(() => {
        if (pendingFetch) {
            fetchCategoryData();
            setPendingFetch(false);

        }
    }, [filterDetails.shape, pendingFetch]);

    // useEffect(() => {
    //     if (pendingFetch) {
    //         fetchCategoryData(false); // Call with appropriate flag
    //         setPendingFetch(false); // Reset pending fetch after calling
    //     }
    // }, [filterDetails.shape]);

    useEffect(() => {
        const queryParameters = new URLSearchParams(location.search);
        const collectionFromQuery = queryParameters.get("collection");
        const categoryFromQuery = queryParameters.get("category");

        if (collectionFromQuery) {
            setSelectedCollection([collectionFromQuery]);
        }
        if (categoryFromQuery) {
            setCategoryFilter([categoryFromQuery]);
        }
        fetchCategoryData();
    }, [location.search]);



    const handleMouseEnter = (sku, description, image, itemId) => {
        setHoveredItemId(itemId);
        setSelectedSku(sku);
        setSelectedDescription(description);
        setHoveredImage(image);
    };

    const handleMouseLeave = () => {
        setHoveredItemId(null);
        setHoveredImage('');
    };

    const handleNextPage = () => {
        if (page * pageSize < totalCount) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(prevPage => prevPage - 1);
        }
    };
    const [isOpen, setIsOpen] = useState(false);

    const toggleOffcanvas = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        // console.log('filter', filterDetails)
    }, [filterDetails])

    const handleReset = () => {
        setFilterDetails({
            minGramWt: 0,
            maxGramWt: null,
            minctswts: 0,
            maxctswts: null,
            minpointer: 0,
            maxpointer: 0,
            attr: [],
            shape: [],
        });
        setCategoryFilter([]);
        setSelectedCollection([]);
        const url = new URL(window.location);
        url.searchParams.delete("shap");
        window.history.pushState({}, '', url);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setPage(1);
    };




    return (
        <>
            <Header />

            <IonPage>
                <div style={{ margin: '30px', marginTop: '60px' }}></div>

                <IonContent color="primary">
                    <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                        <IonRefresherContent
                            pullingIcon={chevronDownCircleOutline}
                            refreshingSpinner="circles"
                        ></IonRefresherContent>
                    </IonRefresher>
                    <IonGrid>
                        <IonRow>
                            <IonCol>
                                <Swiper className='main-toslider' style={{ marginBottom: '20px', height: '200px' }}
                                    spaceBetween={20}
                                    slidesPerView={3}
                                    breakpoints={{
                                        340: {
                                            slidesPerView: 3,
                                        },
                                        440: {
                                            slidesPerView: 3,
                                        },
                                        640: {
                                            slidesPerView: 3,
                                        },
                                        768: {
                                            slidesPerView: 4,
                                        },
                                        1024: {
                                            slidesPerView: 5,
                                        },
                                    }}
                                    // onSlideChange={() => console.log('slide change')}
                                    // onSwiper={(swiper) => console.log(swiper)}
                                    autoplay={true}
                                >
                                    <SwiperSlide >
                                        <IonImg className='slider-img pulsating-circle'
                                            src="/img/big-banner1.png"
                                            style={{ width: '100%', height: '100%', maxwidth: '180px', background: '#fff6ec', margin: '0', objectFit: 'contain', borderRadius: '9px', borderRadius: '9px', overflow: 'hidden' }}
                                        ></IonImg>
                                    </SwiperSlide>
                                    <SwiperSlide >
                                        <IonImg
                                            src="/img/big-banner2.png"
                                            style={{ width: '100%', height: '100%', maxwidth: '180px', background: '#fff6ec', margin: '0', objectFit: 'contain', borderRadius: '9px', borderRadius: '9px', overflow: 'hidden' }}
                                        ></IonImg>
                                    </SwiperSlide>
                                    <SwiperSlide >
                                        <IonImg
                                            src="/img/big-banner3.png"
                                            style={{ width: '100%', height: '100%', maxwidth: '180px', background: '#fff6ec', margin: '0', objectFit: 'contain', borderRadius: '9px', borderRadius: '9px', overflow: 'hidden' }}
                                        ></IonImg>
                                    </SwiperSlide>
                                    <SwiperSlide >
                                        <IonImg
                                            src="/img/big-banner4.png"
                                            style={{ width: '100%', height: '100%', maxwidth: '180px', background: '#fff6ec', margin: '0', objectFit: 'contain', borderRadius: '9px', borderRadius: '9px', overflow: 'hidden' }}
                                        ></IonImg>
                                    </SwiperSlide>

                                    <SwiperSlide >
                                        <IonImg
                                            src="/img/big-banner2.png"
                                            style={{ width: '100%', height: '100%', maxwidth: '180px', background: '#fff6ec', margin: '0', objectFit: 'contain', borderRadius: '9px', borderRadius: '9px', overflow: 'hidden' }}
                                        ></IonImg>
                                    </SwiperSlide>
                                    <SwiperSlide >
                                        <IonImg
                                            src="/img/big-banner3.png"
                                            style={{ width: '100%', height: '100%', maxwidth: '180px', background: '#fff6ec', margin: '0', objectFit: 'contain', borderRadius: '9px', borderRadius: '9px', overflow: 'hidden' }}
                                        ></IonImg>
                                    </SwiperSlide>
                                </Swiper>
                            </IonCol>
                        </IonRow>
                        <div>
                            <h5 class="text-center mb-5 element" style={{ marginBottom: '20px' }}>{itemname}  Category </h5>
                        </div>

                        <IonCol size='12' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ color: 'rgb(76 50 38)', fontSize: '15px' }}>
                                {totalitem > 0 ? `${itemname} (${totalitem})` : `${itemname} (0)`}
                            </div>

                            <IonSelect
                                className="w-auto"
                                style={{ marginLeft: 'auto', display: 'flex', color: '#4c3226', border: '2px solid #9d7664', marginLeft: 'auto', width: 'auto', padding: '0 10px', borderRadius: '9px' }}
                                value={pageSize}
                                onIonChange={handlePageSizeChange}
                            >
                                <IonSelectOption value={24}>24</IonSelectOption>
                                <IonSelectOption value={48}>48</IonSelectOption>
                                <IonSelectOption value={72}>72</IonSelectOption>
                                <IonSelectOption value={100}>100</IonSelectOption>
                            </IonSelect>
                        </IonCol>

                        <div className='main-catagory'>
                            <IonRow>
                                <IonCol>
                                    <h5></h5>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                {loading ? (
                                    <p style={{ color: 'rgb(76 50 38)', margin: 'auto', marginBottom: '30px', fontSize: '18px' }}>Loading...</p>
                                ) : error ? (
                                    <p className="error-message" style={{ color: 'rgb(76 50 38)', display: 'flex', justifyContent: 'center' }}>{error}</p>
                                ) : categoryDetails && categoryDetails.length > 0 ? (
                                    categoryDetails.map(item => {
                                        const hasSubItems = item.subItems && item.subItems.length > 0;
                                        const redirectTo = hasSubItems ? `/c-category/${item._id}` : `/product/${item._id}`;
                                        return (
                                            <IonCol size-md='4' size-sm='6' size='12' key={item._id}>
                                                <div className='main-card-ctgy' style={{ marginBottom: '30px' }}>
                                                    <ion-router-link href={redirectTo}>
                                                        <div className='main-card-top'>
                                                            <img src={hoveredItemId === item._id ? hoveredImage : IMG_PATH + item?.thumbnailImage} alt="ig145" />
                                                            <span className='igsticky'>{hoveredItemId === item._id ? selectedSku : item.sku}</span>
                                                            <div className="priceshow"
                                                                style={{
                                                                    display: 'flex', justifyContent: 'end', margin: "-20px 7px 0px 0px", position: "absolute", right: "0",
                                                                }}>
                                                                <span>${item.finalPrice.toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                    </ion-router-link>
                                                    <div className='main-card-bottom'>
                                                        <div>
                                                            <h5>{hoveredItemId === item._id ? selectedDescription : item.name}</h5>
                                                        </div>
                                                        {/* <div>
                                                            <h5 style={{ color: '#bc7700' }}>{item.category[0].name}</h5>
                                                        </div> */}
                                                    </div>
                                                    <IonRow>
                                                        <IonCol size='2'>
                                                            <div className='ctstop'>
                                                                <span>CTS:</span>
                                                            </div>
                                                        </IonCol>
                                                        <IonCol size='10'>
                                                            <div className='right' style={{ width: "100%" }}>

                                                                <Swiper
                                                                    style={{ padding: '4px 4px', margin: '0px 0px 0px 10px' }}
                                                                    spaceBetween={5}
                                                                    slidesPerView={4}
                                                                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                                                                    modules={[Navigation]}
                                                                    navigation
                                                                >
                                                                    {[item, ...item?.subItems]?.map(subItem => (
                                                                        <SwiperSlide
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                window.location.href = `/product/${subItem._id}`;
                                                                            }}
                                                                            key={subItem._id}
                                                                            onMouseEnter={() => handleMouseEnter(subItem.sku, subItem.description, IMG_PATH + subItem.thumbnailImage, item._id)}
                                                                            onMouseLeave={handleMouseLeave}

                                                                        >
                                                                            <span className='ctsmen' style={{ fontSize: '12px' }}>{subItem?.ctswts?.toFixed(2)}</span>
                                                                        </SwiperSlide>
                                                                    ))}
                                                                </Swiper>

                                                            </div>
                                                        </IonCol>

                                                    </IonRow>
                                                </div>

                                            </IonCol>
                                        );
                                    })
                                ) : (
                                    <div
                                        style={{
                                            background: "#fff6ec",
                                            margin: 'auto'
                                        }}
                                    >
                                        <div>
                                            <IonImg
                                                src='/img/datanotfound.png'
                                                style={{ maxWidth: "360px", width: "100%" }}
                                            />
                                            <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>Data Not Found</h3>
                                        </div>
                                    </div>
                                )}
                            </IonRow>


                            {/* <IonButton className='right_bottom_fix' shape='round' size='large' color='secondary' onClick={toggleOffcanvas}>
                                {isOpen ? (
                                    <ion-icon name="close-outline" slot="icon-only"></ion-icon>
                                ) : (
                                    <ion-icon name="filter-outline" slot="icon-only"></ion-icon>
                                )}
                            </IonButton> */}
                            <button 
                                className="right_bottom_fix "
                                onClick={toggleOffcanvas}
                                >
                                {isOpen ? (
                                    <span className="material-icons">close</span>
                                ) : (
                                    <span className="material-icons">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#f3d8b9" class="bi bi-filter" viewBox="0 0 16 16">
                                        <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
                                        </svg>
                                    </span>
                                )}
                            </button>
                            <div className={`offcanvas ${isOpen ? "show" : ""}`}>
                                <div className="content">
                                    <div color='secondary'>
                                        <div className='topbtn'>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgb(255 216 174 / 22%)",paddingBottom:"10px" }}>
                                                <div>
                                                    <span>Filter by:</span>
                                                </div>
                                                <div>
                                                <button 
                                                        onClick={toggleOffcanvas} 
                                                        variant="ghost" 
                                                        className="w-full text-[#ffd8ae] text-lg"
                                                        style={{background:"transparent"}}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#f3d8b9" class="bi bi-x-lg" viewBox="0 0 16 16">
                                                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <button onClick={handleReset} style={{ width: '100%', margin: '15px 0', background: '#f3a41c', padding:'10px' }} expand="full">Reset</button>
                                                <button onClick={toggleOffcanvas} style={{ width: '100%', margin: '15px 0', background: '#f3a41c', padding:'10px' }} expand="full">Apply</button>
                                            </div>
                                        </div>
                                        <IonAccordionGroup
                                            class='filter-drop'
                                            multiple={true}
                                            // Set the first accordion as open by default
                                            style={{ padding: '0' }}>
                                            <IonAccordion value="first">
                                                <IonItem slot="header" color='secondary'>
                                                    <p>Category</p>
                                                </IonItem>
                                                <div className="ion-padding" slot="content">
                                                    {subcategories.map(subcategory => (
                                                        <div key={subcategory._id} style={{ display: 'flex' }}>
                                                            <IonCheckbox
                                                                size='large'
                                                                labelPlacement="end"
                                                                style={{ marginBottom: '10px' }}
                                                                //checked={selectedCategories.includes(subcategory._id)}
                                                                checked={Array.isArray(CategoryFilter) && CategoryFilter.includes(subcategory._id)}
                                                                onIonChange={() => handleCategoryChange(subcategory._id)}
                                                                disabled={loading}
                                                            />
                                                            <span style={{ margin: '1px 0px 0px 10px' }}>{subcategory.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </IonAccordion>
                                            <IonAccordion value="second2">
                                                <IonItem slot="header" color='secondary'>
                                                    <p>Collection</p>
                                                </IonItem>
                                                <div className="ion-padding" slot="content">
                                                    {subcollection.map(CollectionFilter => (
                                                        <IonCheckbox
                                                            key={CollectionFilter._id}
                                                            size='large'
                                                            labelPlacement="end"
                                                            style={{ marginBottom: '10px' }}
                                                            checked={Array.isArray(selectedCollection) && selectedCollection.includes(CollectionFilter._id)}
                                                            onIonChange={() => handleCollectionChange(CollectionFilter._id)}
                                                            disabled={loading}
                                                        >
                                                            <span>{CollectionFilter.name}</span>
                                                        </IonCheckbox>
                                                    ))}
                                                </div>
                                            </IonAccordion>

                                            <IonAccordion value="third" >
                                                <IonItem slot="header" color='secondary'>
                                                    <p>CT Wts</p>
                                                </IonItem>
                                                <div className="ion-padding" slot="content">
                                                    <IonRange
                                                        style={{ border: 'none', boxShadow: 'none', fontWeight: '500', fontSize: '18px',padding:'21px 12px 0 12px' }}
                                                        dualKnobs={true}
                                                        min={0}
                                                        step={0.05}
                                                        max={maxctswts?.toFixed(2) || 100} // Set a default max if maxctswts is null
                                                        value={{
                                                            lower: filterDetails?.minctswts,
                                                            upper: filterDetails?.maxctswts || maxctswts || 100 // Default upper value
                                                        }}
                                                        pinFormatter={(value) => `${value}`}
                                                        pin={true}
                                                        ticks={true}
                                                        snaps={true}
                                                        onIonChange={(e) => {
                                                            const newMinValue = e?.detail?.value?.lower;
                                                            const newMaxValue = e?.detail?.value?.upper;
                                                            setFilterDetails(prev => ({
                                                                ...prev,
                                                                minctswts: newMinValue,
                                                                maxctswts: newMaxValue
                                                            }));
                                                            setPendingFetch(true);
                                                        }}
                                                    />
                                                </div>
                                            </IonAccordion>
                                            <IonAccordion value="fore">
                                                <IonItem slot="header" color='secondary'>
                                                    <p>Gram Wts</p>
                                                </IonItem>
                                                <div className="ion-padding" slot="content">
                                                    <IonRange
                                                        style={{ border: 'none', boxShadow: 'none', fontWeight: '500', fontSize: '18px',padding:'21px 12px 0 12px' }}
                                                        dualKnobs={true}
                                                        min={0}
                                                        step={0.05}
                                                        max={maxGramWt?.toFixed(2) || 100} // Set a default max if maxctswts is null
                                                        value={{
                                                            lower: filterDetails?.minGramWt,
                                                            upper: filterDetails?.maxGramWt || maxGramWt || 100 // Default upper value
                                                        }}
                                                        pinFormatter={(value) => `${value}`}
                                                        pin={true}
                                                        ticks={true}
                                                        snaps={true}
                                                        onIonChange={(e) => {
                                                            const newMinValue = e?.detail?.value?.lower;
                                                            const newMaxValue = e?.detail?.value?.upper;
                                                            setFilterDetails(prev => ({
                                                                ...prev,
                                                                minGramWt: newMinValue,
                                                                maxGramWt: newMaxValue
                                                            }));
                                                            setPendingFetch(true);
                                                        }}
                                                    />
                                                </div>
                                            </IonAccordion>

                                            <IonAccordion value="five">
                                                <IonItem slot="header" color='secondary'>
                                                    <p>Shape</p>
                                                </IonItem>
                                                <div className="ion-padding" slot="content">
                                                    {Shapedetails?.map((item, index) => (
                                                        <div key={index} style={{ display: 'flex' }}>
                                                            <IonCheckbox
                                                                id={item}
                                                                size='large'
                                                                labelPlacement="end"
                                                                style={{ marginBottom: '10px' }}
                                                                //checked={selectedCategories.includes(subcategory._id)}
                                                                checked={filterDetails?.shape?.includes(item)}
                                                                onIonChange={(event) => handleShapeCheckboxChange(event, item)}
                                                                disabled={loading}
                                                            />
                                                            <span style={{ margin: '1px 0px 0px 10px', textTransform: 'uppercase' }}>{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </IonAccordion>

                                        </IonAccordionGroup>

                                    </div>
                                </div>
                            </div>
                            <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={page === 1}
                                    style={{
                                        color: page === 1 ? 'rgb(40 39 39)' : 'rgb(24 9 2)',
                                        padding: '12px',
                                        border: '1px solid #e5e0db',
                                        background: page === 1 ? '#f0e4d7' : '#ffe4c4',
                                        borderRadius: '10px',
                                        cursor: page === 1 ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={handleNextPage}
                                    disabled={page * pageSize >= totalCount}
                                    style={{
                                        color: (page * pageSize >= totalCount) ? 'rgb(40 39 39)s' : 'rgb(24 9 2)',
                                        padding: '12px',
                                        border: '1px solid #e5e0db',
                                        borderRadius: '10px',
                                        background: (page * pageSize >= totalCount) ? '#f0e4d7' : '#ffe4c4',
                                        cursor: (page * pageSize >= totalCount) ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </IonGrid>
                </IonContent>
            </IonPage>
        </>
    );
}
export default Category; 