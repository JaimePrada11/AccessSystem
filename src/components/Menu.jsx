import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBuilding, FaBiking, FaLaptop, FaBars, FaTimes, FaFileInvoiceDollar } from "react-icons/fa";
import { SiParrotsecurity } from "react-icons/si";
import { MdOutlineExitToApp, MdCardMembership } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { PiSecurityCamera } from "react-icons/pi";


const Menu = () => {
  const [isOpen, setIsOpen] = useState(true); // Inicialmente abierto en PCs
  const [activeItem, setActiveItem] = useState(null);
  const [isTablet, setIsTablet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 768 && width < 1024);
      setIsMobile(width < 768);

      // Ajustar el estado de isOpen basado en el tamaño de la ventana
      if (width >= 1024) {
        setIsOpen(true);  // Siempre abierto en PCs
      } else if (width >= 768 && width < 1024) {
        setIsOpen(false);  // Cerrado inicialmente en tablets
      } else {
        setIsOpen(false);  // Cerrado en móviles y no se puede abrir
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isTablet) {
      setIsOpen(!isOpen);
    }
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <>
      {/* Botón de menú para tablets */}
      <button onClick={toggleSidebar} className={`fixed top-4 left-20 z-20 text-white ${isTablet ? 'block' : 'hidden'}`}>
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`h-screen bg-blue-900/10 text-white flex flex-col fixed left-0 top-0 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'}`}>
        <div
          className="absolute inset-0 bg-black/10 backdrop-blur-2xl"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/2078774/pexels-photo-2078774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            filter: 'blur(10px)'
          }}
        ></div>

        <div className="flex items-center justify-center h-16 relative z-10">
          <SiParrotsecurity className="text-3xl mr-2" />
          {isOpen && <Link to="/" className="text-2xl font-bold text-white">Entry System</Link>}
        </div>

        <nav className="flex-grow flex flex-col justify-between py-4 relative z-10">
          <ul className="space-y-2 text-white">
            <li className={`px-4 py-2 hover:bg-gray-700/50 transition-all duration-300 rounded-md flex items-center ${activeItem === 'empresas' ? 'bg-gray-700/50' : ''}`} onClick={() => handleItemClick('empresas')}>
              <FaBuilding className="mr-3" />
              {isOpen && <Link to="/company" className="flex items-center">Companies</Link>}
            </li>
            <li className={`px-4 py-2 hover:bg-gray-700/50 transition-all duration-300 rounded-md flex items-center ${activeItem === 'personas' ? 'bg-gray-700/50' : ''}`} onClick={() => handleItemClick('personas')}>
              <IoIosPeople className="mr-3" />
              {isOpen && <Link to="/people" className="flex items-center">People</Link>}
            </li>
            <li className={`px-4 py-2 hover:bg-gray-700/50 transition-all duration-300 rounded-md flex items-center ${activeItem === 'celadores' ? 'bg-gray-700/50' : ''}`} onClick={() => handleItemClick('celadores')}>
              <PiSecurityCamera className="mr-3" />
              {isOpen && <Link to="/celadores" className="flex items-center">Access</Link>}
            </li>
            <li className={`px-4 py-2 hover:bg-gray-700/50 transition-all duration-300 rounded-md flex items-center ${activeItem === 'ingresos' ? 'bg-gray-700/50' : ''}`} onClick={() => handleItemClick('ingresos')}>
              <MdOutlineExitToApp className="mr-3" />
              {isOpen && <Link to="/ingresos" className="flex items-center">Exit</Link>}
            </li>
            <li className={`px-4 py-2 hover:bg-gray-700/50 transition-all duration-300 rounded-md flex items-center ${activeItem === 'vehiculos' ? 'bg-gray-700/50' : ''}`} onClick={() => handleItemClick('vehiculos')}>
              <FaBiking className="mr-3" />
              {isOpen && <Link to="/vehicles" className="flex items-center">Vehicles</Link>}
            </li>
            <li className={`px-4 py-2 hover:bg-gray-700/50 transition-all duration-300 rounded-md flex items-center ${activeItem === 'equipos' ? 'bg-gray-700/50' : ''}`} onClick={() => handleItemClick('equipos')}>
              <FaLaptop className="mr-3" />
              {isOpen && <Link to="/equipments" className="flex items-center">Equipments</Link>}
            </li>
            <li className={`px-4 py-2 hover:bg-gray-700/50 transition-all duration-300 rounded-md flex items-center ${activeItem === 'equipos' ? 'bg-gray-700/50' : ''}`} onClick={() => handleItemClick('equipos')}>
              <MdCardMembership className="mr-3" />
              {isOpen && <Link to="/equipments" className="flex items-center">Membership</Link>}
            </li>
            <li className={`px-4 py-2 hover:bg-gray-700/50 transition-all duration-300 rounded-md flex items-center ${activeItem === 'equipos' ? 'bg-gray-700/50' : ''}`} onClick={() => handleItemClick('equipos')}>
              <FaFileInvoiceDollar className="mr-3" />
              {isOpen && <Link to="/equipments" className="flex items-center">Invoices</Link>}
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Bottom Navbar */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 w-full bg-blue-900 text-white flex justify-around py-4 z-20 rounded-t-2xl">
          <Link to="/company" className="flex flex-col items-center">
            <FaBuilding size={32} />
          </Link>
          <Link to="/people" className="flex flex-col items-center">
            <IoIosPeople size={32} />
          </Link>
          <Link to="/celadores" className="flex flex-col items-center">
            <PiSecurityCamera size={32} />
          </Link>
          <Link to="/ingresos" className="flex flex-col items-center">
            <MdOutlineExitToApp size={32} />
          </Link>
          <Link to="/vehicles" className="flex flex-col items-center">
            <FaBiking size={32} />
          </Link>
          <Link to="/equipments" className="flex flex-col items-center">
            <FaLaptop size={32} />
          </Link>
          <Link to="/vehicles" className="flex flex-col items-center">
            <MdCardMembership size={32} />
          </Link>
          <Link to="/equipments" className="flex flex-col items-center">
            <FaFileInvoiceDollar
             size={32} />
          </Link>
        </div>
      )}
    </>
  );
};

export default Menu;
