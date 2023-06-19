import React, { useEffect } from 'react'
import logo from '../assets/imgs/header_logo.png'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Dropdown from 'react-bootstrap/Dropdown'
import useLogout from '../hooks/useLogout'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


export const Header = () => {
  const { auth } = useAuth()
  const logout = useLogout()
  useEffect(() =>{
    console.log(auth)
  }, [auth])
  return (
          <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
              <Navbar.Brand><Link to="/"><img width={"60%"} height={"50%"} src={logo} alt=""/></Link></Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                <Link className="nav-link" to="/"><i className="fa-solid fa-magnifying-glass fa-lg text-success"></i> Ricerca</Link>
                <Link className="nav-link" to={"history/"+auth.id}><i className="fa-solid fa-file-csv fa-lg text-primary"></i> Archivio CSV</Link>
                {auth?.roles?.find(role => role === 1) && 
                  (<li className="nav-item">
                    <Link className="nav-link" to="/admin"><i className="fa-solid fa-users fa-lg text-warning"></i> Franchise</Link>
                  </li>)}
                </Nav>
                <Nav>
                  <Dropdown className="d-flex nav-item dropdown">
                    <Dropdown.Toggle style={{color: "#80979e", backgroundColor : '#212529'}} variant='secondary' className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="fa-solid fa-user fa-lg text-info"></i> {auth?.name} 
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <Dropdown.Item><Link to='/user' className="dropdown-item"><i className="fa-solid fa-id-card"></i> Profilo</Link></Dropdown.Item>
                        <li><hr className="dropdown-divider"/></li>
                        <Dropdown.Item><div className="dropdown-item" onClick={async () => await logout()}><i className="fa-solid fa-power-off"></i> Disconetti</div></Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
  )
}
