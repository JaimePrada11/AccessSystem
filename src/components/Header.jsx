import { useState, useEffect, useContext } from "react";
import UserContext from "../Context";
import { Menu } from "@headlessui/react";
import { useNavigate } from "react-router";


const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate(`/`);
    console.log("Cerrar sesión"); 
  };

  return (
    <header className="header flex justify-between items-center p-4 bg-gray-100 shadow-md">
      {/* Fecha y hora */}
      <div className="flex items-center space-x-4">
        <div className="relative flex items-center justify-center">
          <div className="w-64 h-10 pl-10 pr-4 py-2 text-gray-800 placeholder-gray-500 rounded-md flex flex-col items-center">
            <span>{currentTime.toLocaleTimeString()}</span>
            {currentTime.toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Menú del usuario */}
      <div className="relative">
        <Menu>
          {({ open }) => (
            <>
              <Menu.Button className="flex items-center space-x-2 focus:outline-none">
                <div className="storage_header-imgContainer">
                  <img
                    src="" // Reemplaza con la URL real de la imagen del usuario
                    alt="User Profile"
                    className="rounded-full w-12 h-12"
                  />
                </div>
                <span className="text-gray-800 font-medium">
                  {user ? user.name : "Guest"}
                </span>
              </Menu.Button>

              {open && (
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${active ? "bg-gray-100" : ""
                          } w-full px-4 py-2 text-left text-sm text-gray-700`}
                      >
                        Ver perfil
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${active ? "bg-gray-100" : ""
                          } w-full px-4 py-2 text-left text-sm text-gray-700`}
                      >
                        Cerrar sesión
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              )}
            </>
          )}
        </Menu>
      </div>
    </header>
  );
};

export default Header;
