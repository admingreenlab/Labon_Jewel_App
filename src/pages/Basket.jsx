import React, { useEffect, useState } from "react";
import { IonContent, IonImg, IonTitle, IonToolbar, IonCol, IonGrid, IonRow, IonTabButton, IonRefresher, IonRefresherContent, IonPage, } from '@ionic/react';
// import Container from "react-bootstrap/Container";
// import Table from 'react-bootstrap/Table'
// import Pagination from 'react-bootstrap/Pagination';

function Demo() {
    const [selectedRows, setSelectedRows] = useState([]);
    const [sortBy, setSortBy] = useState(""); 
    const [sortOrder, setSortOrder] = useState("asc"); 
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10); 
    const [data, setData] = useState([
        {
            srNo: 1,
            status: 'M',
            stoneId: '180777',
            lab: 'IGI',
            reportNo: '560236486',
            shape: 'ROUND',
            carats: 18.010,
            color: 'H',
            clarity: 'VS2',
            cut: 'ID',
            polish: 'EX',
            symm: 'EX',
            measurements: '16.62 * 16.72 * 10.30',
            tablePercent: 58.000,
            depthPercent: 62.00,
            ratio: 0.000,
            ha: 'No',
            rapPrice: 34000,
            discount: 97.41,
            pricePerCts: 880.60,
            amount: 15859.61,
            certificate: 'PDF',
            videoLink: 'VIDEO',
            createdBy: 'krigel',
            companyName: 'KRIGEL MESH DIAMONDS'
        },
         {
            srNo: 2,
            status: 'M',
            stoneId: '180777',
            lab: 'GIA',
            reportNo: '560236486',
            shape: 'OVAL',
            carats: 18.010,
            color: 'E',
            clarity: 'VS1',
            cut: 'ID',
            polish: 'EX',
            symm: 'EX',
            measurements: '16.62 * 16.72 * 10.30',
            tablePercent: 58.000,
            depthPercent: 62.00,
            ratio: 0.000,
            ha: 'No',
            rapPrice: 34000,
            discount: 97.41,
            pricePerCts: 880.60,
            amount: 15859.61,
            certificate: 'PDF',
            videoLink: 'VIDEO',
            createdBy: 'krigel',
            companyName: 'KRIGEL MESH DIAMONDS'
        },

        // Add more rows as needed
    ]);

    const handleRowSelect = (srNo) => {
        setSelectedRows((prevSelected) => {
            if (prevSelected.includes(srNo)) {
                return prevSelected.filter((id) => id !== srNo);
            } else {
                return [...prevSelected, srNo];
            }
        });
    };

    const sortfilter = (col) => {
        const sortedValue = [...data].sort((a, b) => {
            const aValue = a[col] ? a[col].toString() : "";
            const bValue = b[col] ? b[col].toString() : "";

            if (sortOrder === "asc") {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });
        setData(sortedValue);
    };

    const handleSort = (col) => {
        if (sortBy === col) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(col);
            setSortOrder("asc");
        }
        sortfilter(col);
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(data.length / rowsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
<IonPage>
            <IonContent fluid className="text-center" > 
                <h6 className="mt-3">Watch List</h6>
                <div style={{display:'flex', margin:"150px 0px 0px 0px"}} >
                <div style={{ marginBottom:'10px', fontWeight:'300', marginRight:'auto'}}>
                    <label style={{margin:'0px 0px 0px 10px'}}>Client Name:</label>
                    <button style={{margin:'0px 5px', color:'#b89154', background:'#fff', fontWeight:'300'}}>krigel</button>
                    <button style={{fontWeight:'300', margin:'10px 0px 0px 10px', padding:'10px 10px',  border:'1px solid #4c3226', color:'#fff', background:'#4c3226'}}>Add to Basket</button>
                </div>
                <div style={{ marginBottom:'10px', marginLeft:'auto'}}>
                    <label style={{fontWeight:'300'}}> Available : </label>
                    <button style={{fontWeight:'300', padding:'0px 7px', marginRight:'5px', border:'1px solid #4c3226', color:'#fff', background:'#4c3226'}}> A </button>
                    <label style={{fontWeight:'300'}}> Memo  : </label>
                    <button style={{fontWeight:'300', padding:'0px 7px', marginRight:'5px', border:'1px solid #4c3226', color:'#fff', background:'#4c3226'}}> M </button>
                </div>
                </div>
                <div className="table-responsive pt-10" >
                    <table striped bordered hover  style={{ width: 'max-content' }} >
                        <thead className="tablecss" >
                            <tr>
                                <th>
                                <input
                                    type="checkbox"
                                    onChange={() => {
                                        if (selectedRows.length === data.length) {
                                            setSelectedRows([]);
                                        } else {
                                            setSelectedRows(data.map(item => item.srNo));
                                        }
                                    }}
                                    checked={selectedRows.length === data.length}
                                />
                                </th>
                                <th>SrNo</th>
                                <th>Status</th>
                                <th>StoneId</th>
                                <th onClick={() => handleSort("lab")}> Lab {sortBy === "lab" ? (sortOrder === "asc" ? ' ▲' : ' ▼') : '▼'}</th>
                                <th>Report No</th>
                                <th onClick={() => handleSort("shape")}>
                                    Shape {sortBy === "shape" ? (sortOrder === "asc" ? ' ▲' : ' ▼') : '▼'}
                                </th>
                                <th onClick={() => handleSort("carats")}>
                                   Carats {sortBy === "carats" ? (sortOrder === "asc" ? ' ▲' : ' ▼') : '▼'}</th>
                                <th onClick={() => handleSort("color")}>
                                   Color {sortBy === "color" ? (sortOrder === "asc" ? ' ▲' : ' ▼') : '▼'}</th>
                                <th onClick={() => handleSort("clarity")}>
                                   Clarity {sortBy === "clarity" ? (sortOrder === "asc" ? ' ▲' : ' ▼') : '▼'}</th>
                                <th onClick={() => handleSort("cut")}>
                                    Cut{sortBy === "cut" ? (sortOrder === "asc" ? ' ▲' : ' ▼') : '▼'}</th>
                                <th onClick={() => handleSort("polish")}>
                                   Polish{sortBy === "polish" ? (sortOrder === "asc" ? ' ▲' : ' ▼') : '▼'}</th>
                                <th onClick={() => handleSort("symm")}>
                                   Symm{sortBy === "symm" ? (sortOrder === "asc" ? ' ▲' : ' ▼') : '▼'}</th>
                                <th>Measurements</th>
                                <th>Table %</th>
                                <th>Depth %</th>
                                <th>Ratio</th>
                                <th>H&A</th>
                                <th>RapPrice</th>
                                <th>Discount %</th>
                                <th>Price/Cts</th>
                                <th>Amount</th>
                                <th>Certificate</th>
                                <th>VideoLink</th>
                                <th>Created By</th>
                                <th>CompanyName</th>
                            </tr>
                        </thead>
                        <tbody className="tablecss">
                            {currentRows.map((item, index) => (
                                <tr key={index}>
                                    <td>    <input
                                        type="checkbox"
                                        checked={selectedRows.includes(item.srNo)}
                                        onChange={() => handleRowSelect(item.srNo)}
                                    /></td>
                                    <td>{item.srNo}</td>
                                    <td>{item.status}</td>
                                    <td>{item.stoneId}</td>
                                    <td><a href={`https://www.igi.org/reports/verify-your-report?r=${item.reportNo}`} target="_blank">{item.lab}</a></td>
                                    <td>{item.reportNo}</td>
                                    <td>{item.shape}</td>
                                    <td>{item.carats}</td>
                                    <td>{item.color}</td>
                                    <td>{item.clarity}</td>
                                    <td>{item.cut}</td>
                                    <td>{item.polish}</td>
                                    <td>{item.symm}</td>
                                    <td>{item.measurements}</td>
                                    <td>{item.tablePercent}</td>
                                    <td>{item.depthPercent}</td>
                                    <td>{item.ratio}</td>
                                    <td>{item.ha}</td>
                                    <td>{item.rapPrice}</td>
                                    <td>{item.discount}</td>
                                    <td>{item.pricePerCts}</td>
                                    <td>{item.amount}</td>
                                    <td><a href={`https://www.igi.org/reports/verify-your-report?r=${item.reportNo}`} target="_blank">PDF</a></td>
                                    <td><a href={`https://v360.in/movie/${item.videoLink}`} target="_blank">VIDEO</a></td>
                                    <td>{item.createdBy}</td>
                                    <td>{item.companyName}</td>
                                </tr>
                            ))}

                            <tr className="tablecss">
                                <th></th>
                                <th colSpan={6}>Total</th>
                                <th>18.01</th>
                                <th colSpan={10}></th>
                                <th>34000</th>
                                <th>97.41</th>
                                <th>880.60</th>
                                <th>15859.61</th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </IonContent>
            </IonPage>
    );
}

export default Demo;
