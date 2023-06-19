import { useRef, useState, useEffect } from "react";
import axios from "../api/axios.js";
import logo from '../assets/imgs/header_logo.png'
import { useNavigate } from 'react-router-dom'

// const USER_REGEX = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
// const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;
const REGISTER_URL = '/register';

const Register = () => {

    const userEmail = useRef();
    const errRef = useRef();
    const [locationInfo, setLocationInfo] = useState([])
    const [userData, setUserData] = useState({
        email: "",
        password: "",
        name: "",
        company: "",
        tel: "",
        addr: "",
        zip: 0,
        city: "",
        state: "",
        region: ""
    })
    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);
    const navigate = useNavigate()


    const [errMsg, setErrMsg] = useState({err: false, message: ''});

    const getInfoByZip = async (zip) =>{
        try {
            const res = await axios.get("/geoData/infoByZip"+zip);
            var data = res.data;
            var options = []
            data.forEach((town,) =>{
                options.push({region: town.regione, city: town.comune, state: town.comune})
            })
            setUserData({...userData, zip: zip, state: options[0].state, region: options[0].region})
            options = CreateStateOptions(options)
            setLocationInfo(options)
          } catch (err) {
            console.log(err);
          }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(errMsg.err){
            setErrMsg({err: true, message: "Verifica i dati prima di inviare la richiesta"})
            return 0
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify(userData),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            console.log(response.data.success) //Messaggio dal server
            navigate('/login')
            setUserData({})
            setMatchPwd('');
        } catch (err) {
            setErrMsg({err: true, message: err.response.data.message});
            errRef.current.focus();
        }
    }

    const CreateStateOptions = (locations) =>{
        var ret = []
        ret.push(locations.map((location, index) =>{
            return (<option value={location.city} key={location.city}>{location.city}</option>)
        }))
        return ret
    }

    useEffect(() => {
        setValidMatch(userData.password === matchPwd)
    }, [userData.password, matchPwd])

    useEffect(() =>{
        if (!validMatch){
            setErrMsg({err: true, message : "Le password non corrispondono"})
            return
        }else{
            setErrMsg({err: false, message : "Le password non corrispondono"})
        }
    }, [matchFocus])

    return (
            <div style={{display : "flex", justifyContent : "center"}} className="form-central">
                <div style={{width: "450px"}} className="card">
                    <img src={logo} className="card-img-top" alt="TuaCar"/>
                    <div className="card-body">
                        <h5 className="card-title">Registrazione</h5>
                        {errMsg.err && <div ref={errRef} id="formError" className="alert alert-danger" role="alert">{errMsg.message}</div>}

                        <p>Compila tutti i campi richiesti.</p>
                        <form method="post" onSubmit={handleSubmit} id="registerForm" className="requires-validation" noValidate>
                            <input type="hidden" name="action" value="register" />
                            <input type="hidden" name="require_verification" value="1" />
                            <div className="form-floating mb-1">
                                <input ref={userEmail}  onChange={(e) => setUserData({...userData, email: e.target.value})} value={userData.email} type="email" className="form-control" name="email" id="email" placeholder="name@example.com" required/>
                                <label htmlFor="email"><span className="text-danger">*</span> Indirizzo email</label>
                                {/* <div className="invalid-feedback">L'indirizzo email non è valido!</div> */}
                            </div>
                            <div className="form-floating mb-1">
                                <label htmlFor="password"><span className="text-danger">*</span> Password</label>
                                <input value={userData.password} onChange={(e) => {setUserData({...userData, password : e.target.value})} } type="password" className="form-control" name="password" id="password" placeholder="Password" required/>
                                {/* {pwdFocus && userData.email && !validPwd && <p id="pwdNote">
                                    4 to 24 characters.<br />
                                    Must begin with a letter.<br />
                                    Letters, numbers, underscores, hyphens allowed.
                                </p>} */}
                                {/* <div className="invalid-feedback">La password deve avere minimo 8 e massimo 20 caratteri!</div> */}
                            </div>
                            <div className="form-floating mb-1">
                                <label htmlFor="password"><span className="text-danger">*</span> Conferma password</label>
                                <input aria-describedby="confirmnote" onFocus={() => setMatchFocus(true)} onBlur={() => setMatchFocus(false)} aria-invalid={validMatch ? "false" : "true"} value={matchPwd} onChange={(e) => setMatchPwd(e.target.value)} type="password" className="form-control" name="password" id="confirmPassword" placeholder="Password" required/>
                                {/* {matchFocus && userData.matchPwd && !validMatch && <p id="confirmnote">
                                    4 to 24 characters.<br />
                                    Must begin with a letter.<br />
                                    Letters, numbers, underscores, hyphens allowed.
                                </p>} */}
                                {/* <div className="invalid-feedback">Le password non coincidono!</div> */}
                            </div>
                            <div className="form-floating mb-1">
                                <input onChange={(e) => setUserData({...userData, name: e.target.value})} type="text" className="form-control" name="name" id="name" placeholder="Nome Cognome" required/>
                                <label htmlFor="name"><span className="text-danger">*</span> Nome Cognome</label>
                                <div className="invalid-feedback">Inserisci nome e cognome!</div>
                            </div>
                            <div className="form-floating mb-1">
                                <input onChange={(e) => setUserData({...userData, company: e.target.value})} type="text" className="form-control" name="company" id="company" placeholder="Ragione Sociale" required/>
                                <label htmlFor="company"><span className="text-danger">*</span> Ragione Sociale</label>
                                <div className="invalid-feedback">Inserisci Ragione Sociale!</div>
                            </div>
                            <div className="form-floating mb-1">
                                <input onChange={(e) => setUserData({...userData, tel: e.target.value})} type="text" className="form-control" name="phone" id="phone" placeholder="Telefono" required/>
                                <label htmlFor="phone"><span className="text-danger">*</span> Telefono</label>
                                <div className="invalid-feedback">Inserisci un recapito telefonico!</div>
                            </div>
                            <div className="form-floating mb-1">
                                <input onChange={(e) => setUserData({...userData, addr: e.target.value})} type="text" className="form-control" name="address" id="address" placeholder="Indirizzo" required/>
                                <label htmlFor="address"><span className="text-danger">*</span> Indirizzo</label>
                                <div className="invalid-feedback">Inserisci l'indirizzo!</div>
                            </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-floating mb-1">
                                            <input value={userData.zip} onChange={(e) => {setUserData({...userData, zip: e.target.value}); getInfoByZip(e.target.value)}} type="number" className="form-control" name="cap" id="registerCap" placeholder="CAP" required/>
                                            <label htmlFor="registerCap"><span className="text-danger">*</span> CAP</label>
                                            <div className="invalid-feedback">Inserisci il CAP!</div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-floating mb-1">
                                            <select value={userData.city} onChange={(e) =>setUserData({...userData, city: e.target.value})} className="form-select" name="city" id="city" placeholder="Indica il CAP per selezionare la località" required>
                                                <option value="">Seleziona</option>
                                                {locationInfo}
                                            </select>
                                            <label htmlFor="city"><span className="text-danger">*</span> Località</label>
                                            <div className="invalid-feedback">Seleziona una località!</div>
                                        </div>
                                    </div>
                                </div>
                                
                            
                            <div className="form-floating">
                                <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" name="checkTerms" id="checkTerms" required/>
                                <label htmlFor="checkTerms" className="form-check-label"><span className="text-danger">*</span> Ho letto ed accetto le <a href="/">Condizioni Generali del Servizio</a></label>
                                <div className="invalid-feedback">E' necessario accettare le Condizioni Generali del Servizio!</div>
                                </div>
                            </div>
                            <div className="form-floating text-center mt-2">
                            <button className="btn btn-primary">Registrati</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            )
}

export default Register