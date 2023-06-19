import React from 'react'
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import Badge from 'react-bootstrap/Badge';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Platform from '../Classes/platform';
import download from 'downloadjs'
import { useParams } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner'
import ErrorModal from '../Views/errorModal';
import Pagination from 'react-bootstrap/Pagination';
import Math from 'math'

const platforms = [new Platform("Autoscout", "#f5f200", "platform-01"), 
new Platform("Subito", "#f9423a", "platform-02"),
new Platform("Facebook", "white", "platform-03")];

function History() {
    const { id : user_id } = useParams()
    const [searches, setSearches] = useState([])
    const axiosPrivate = useAxiosPrivate()
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState({erro: false, message: ""})
    const [currentPage, setCurrentPage] = useState(1)
    let maxItemPerPage = 7
    const lastPostIndex = currentPage * maxItemPerPage
    const firstPostIndex = lastPostIndex - maxItemPerPage
    const currentSearches = searches.slice(firstPostIndex, lastPostIndex)
    let pages = []
    for (let number = 1; number <= Math.ceil(searches.length / maxItemPerPage); number++) {
            pages.push(
                <Pagination.Item onClick={() => setCurrentPage(number)} key={number} active={number === currentPage}>
                    {number}
                </Pagination.Item>
        )
      }
    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                setIsLoading(true)
                const res = await axiosPrivate.get('/searches/' + user_id);
                setSearches(res.data)
                setIsLoading(false)
            } catch (err) {
                console.log(err.message);
                setError({error: true, message : err.message})
                setIsLoading(false)
            }
        };
        fetchAllUsers();
    }, [user_id]);
    
    
    
    const downloadFile = async (file_path, file_name) =>{
        try {
            setIsLoading(true)
            const res = await axiosPrivate.post('/webfiles/exports/', {
                file_path : file_path
            });
            const blob = new Blob([res.data], {
                type: "text/csv"
            })
            setIsLoading(false)
            download(blob, file_name + ".csv")
            
        } catch (err) {
            setIsLoading(false)
            setError({error: true, message : err.message})
            console.log(err.message);
        }
    }

    
    return (
        <div style={{display : "flex", flexDirection : "column", justifyContent : "center"}} className="container mt-5">
        <h2 className="text-center mb-5">Storico ricerche effettuate</h2>
        <ErrorModal title="Errore" message={error.message} show={error.error}/>
        {isLoading && 
        (       
            <div style={{ top: "0%",  left : "0%", background: "rgba(0, 0, 0, .5)", position: "fixed", width : "100%", height: "100%", zIndex: 90}}>     
                <Spinner style={{position: "fixed",top: "50%",  left : "50%", zIndex: 100}} variant='warning' animation='grow'/>
            </div>
            )            
            }
        <table className="table table-bordered mb-5">
            <thead>
                <tr className="table-success">
                    <th scope="col" className="text-responsive">Data</th>
                    <th scope="col" className="text-responsive">File</th>
                    <th scope="col" className="text-responsive">Risultati</th>
                    <th scope="col" className="text-responsive">Parametri</th>
                </tr>
            </thead>
            <tbody>
                {
                currentSearches?.map((search) =>{
                    var parsedData = JSON.parse(search.search_options)
                    return (
                        <tr key={search.search_id}>
                        <td className="text-responsive">
                            { new Date(search.search_date).toLocaleString().replace(",", "")}
                            </td>
                        <td>{ (new Date().getTime() - new Date(search.search_date).getTime()) < 24 * 60 * 60 * 1000 && (<h6><Badge style={{fontSize:'10px'}} pill bg="success"> new </Badge><br/></h6>)}<button onClick={() => downloadFile(user_id + "/" + search.search_filename, search.search_filename)}><i className="fa-solid fa-file-csv fa-lg text-success"></i></button></td>
                        <td className="text-responsive">{search.search_results}</td>
                        <td className="text-responsive">{Object.keys(parsedData).map((platform_id) =>{
                            return (
                                <>
                                    <b>{platforms?.find(platform => platform.id === platform_id)?.name}:</b> {
                                        parsedData[platform_id].geoTowns?.length > 10 ? (
                                            <>
                                                <div className='d-flex justify-content-around align-items-center'>{parsedData[platform_id].geoTowns?.slice(0, 10).join(", ")}...
                                                    <div style={{cursor: 'pointer'}} onClick={handleShow}>
                                                        <i class="fa-solid fa-clipboard fa-2xl"></i>
                                                    </div>
                                                </div>
                                                
                                                <Offcanvas placement='end' show={show} onHide={handleClose}>
                                                    <Offcanvas.Header closeButton>
                                                    <Offcanvas.Title>Comuni</Offcanvas.Title>
                                                    </Offcanvas.Header>
                                                    <Offcanvas.Body>
                                                        {parsedData[platform_id].geoTowns?.join(", ")}
                                                    </Offcanvas.Body>
                                                </Offcanvas>
                                            </>
                                        ): (<> {parsedData[platform_id].geoTowns?.join(", ")} </>)
                                    }<br/> 
                                    <b>Parametri :</b> anno da {parsedData[platform_id].yearFrom === ""? "Qualsiasi" : parsedData[platform_id].yearFrom} a {parsedData[platform_id].yearTo === ""? "Qualsiasi" : parsedData[platform_id].yearTo}; km da {parsedData[platform_id].mileageFrom === ""? "Qualsiasi" : parsedData[platform_id].mileageFrom} a {parsedData[platform_id].mileageTo === ""? "Qualsiasi" : parsedData[platform_id].mileageTo} <br/> 
                                </>)
                        })}</td>
                    </tr>
                    )
                })}
            </tbody>
        </table>
        <div style = {{display : "flex", justifyContent : "center"}}>
        <Pagination>
        <Pagination.First onClick={() => setCurrentPage(1)}/>
            {pages.map((page, pageIndex) =>{
                if((pageIndex > currentPage - 5) && (pageIndex < Number(5 + currentPage))) return page
            })}
        <Pagination.Last onClick={() => setCurrentPage(pages.length)}/>
        </Pagination>
        </div>
    </div>
  )
}

export default History