import React from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ROLES from '../Classes/roles'
import EditUserSpoki from '../Forms/editUserSpoki'
import EditUser from '../Forms/editUser'
import Spinner from 'react-bootstrap/Spinner'
import ErrorModal from '../Views/errorModal'
import Pagination from 'react-bootstrap/Pagination';
import Math from 'math'

const USERS_REQUEST = 'users'
export const Admin = () => {
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState()
    const axiosPrivate = useAxiosPrivate()
    const [isLoading, setIsLoading] = useState(true)

    const [showSpoki, setShowSpoki] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [error, setError] = useState({error: false, message: ""})
    const [currentPage, setCurrentPage] = useState(1)
    let maxItemPerPage = 5
    const lastPostIndex = currentPage * maxItemPerPage
    const firstPostIndex = lastPostIndex - maxItemPerPage
    const currentUsers = users.slice(firstPostIndex, lastPostIndex)
    let pages = []
    for (let number = 1; number <= Math.ceil(users.length / maxItemPerPage); number++) {
        pages.push(
          <Pagination.Item onClick={() => setCurrentPage(number)} key={number} active={number === currentPage}>
            {number}
          </Pagination.Item>,
        );
      }
    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                setIsLoading(true)
                const res = await axiosPrivate.get(USERS_REQUEST);
                setIsLoading(false)
                setUsers(res.data)
            } catch (err) {
                setIsLoading(false)
                console.log(err.message);
                setError({error: true, message : err.message})
            }
            };
        fetchAllUsers();
    }, []);

    useEffect(() => {
    }, [showEdit, showSpoki, selectedUser]);

    const handleClose = (action) =>{
        if (action === 'closeEdit') setShowEdit(false)
        else if (action === 'closeSpoki') setShowSpoki(false)
    }

    return (
    <>
        <ErrorModal title="Errore" message={error.message} show={error.error}/>
        <div className="container mt-5">
            <h2 className="text-center mb-5">Elenco utenti</h2>
            {isLoading && 
            (       
                <div style={{ top: "0%",  left : "0%", background: "rgba(0, 0, 0, .5)", position: "fixed", width : "100%", height: "100%", zIndex: 90}}>     
                    <Spinner style={{position: "fixed",top: "50%",  left : "50%", zIndex: 100}} variant='warning' animation='grow'/>
                </div>
                )            
                }
            <table className="table table-bordered mb-5">
                <thead>
                    <tr className="table-warning">
                        <th scope="col"></th>
                        <th scope="col" className="text-responsive">Login</th>
                        <th scope="col" className="text-responsive">Dati Utente</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user) => {
                        return (
                            <tr key={user.user_id}>
                                <td>
                                    <center style={{display: 'flex', justifyContent: "space-around"}}>
                                        {user.verified !== 1
                                            ?
                                            <span className="text-warning" data-bs-toggle="tooltip" data-bs-placement="top" title="Attesa conferma email"><i className="fa-solid fa-user-clock"></i></span>
                                            :
                                            <>
                                                <button onClick={() => {setShowEdit(true); setSelectedUser(user)}} data-action="admin-editUser" data-current-user={user.user_id} data-user-id={user.user_id} data-bs-toggle="tooltip" data-bs-placement="top" title="Modifica utente"><i className="fa-solid fa-user-pen fa-lg text-primary"></i></button>
                                                <div><Link to={`history/${user.user_id}`} data-bs-toggle="tooltip" data-bs-placement="top" title="Storico ricerche"><i className="fa-solid fa-file-csv fa-lg text-success"></i></Link></div>
                                                <div><Link to={`userConfigArea/${user.user_id}`} data-bs-toggle="tooltip" data-bs-placement="top" title="Area di competenza"><i className="fa-solid fa-map-location-dot fa-lg text-warning"></i></Link></div>
                                            </>
                                        }
                                    </center>
                                </td>
                                <td className="text-responsive">
                                    {user.email}
                                    <br /><small>({Object.keys(ROLES).find(key => ROLES[key] === user.roles_mask)} / {user.status !== 1? "Account attivo" : "Account disattivato"})</small><br/>
                                    <button onClick={() => {setShowSpoki(true); setSelectedUser(user)}} className={user.IsSpokiEnabled? "text-primary" : "text-secondary"} data-bs-toggle="tooltip" data-bs-placement="top" title="Gestisci configurazione Spoki"><i className="fa-brands fa-lg fa-whatsapp"></i></button>
                                </td>
                                <td className="text-responsive">{user.name} ({user.company} / P.Iva: {user.vat_number})<br/> {user.address} <br/> {user.zip}-{user.city} ({user.state}), {user.region}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
        <div style = {{display : "flex", justifyContent : "center"}}>
            <Pagination>{pages}</Pagination>
        </div>
        {selectedUser !== undefined && <EditUserSpoki user={selectedUser} handleClose={handleClose} show={showSpoki} />}
        {selectedUser !== undefined && <EditUser user={selectedUser} handleClose={handleClose} show={showEdit}/>}
    
    </>
  )
}
