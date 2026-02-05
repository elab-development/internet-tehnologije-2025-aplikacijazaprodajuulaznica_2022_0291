import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


//UTILITY FUNKCIJE

const isAuthhed = () => !!localStorage.getItem("token");

const getMe = () => {
    try {
        const user = JSON.parse(localStorage.getItem("me") || "null");
        if (user && user.uloga) {
            return user; 
        }
        return null;
    } catch (e) {
        return null;
    }
};

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

//AUTH PROVIDER KOMPONENTA

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    
    const [isAuthenticated, setIsAuthenticated] = useState(isAuthhed());
    const [user, setUser] = useState(getMe());
    
    const isAdmin = user?.uloga === 'admin';

    //LOGIN FUNKCIJA
    const login = (token, userData) => {
        localStorage.setItem("token", token); 
        localStorage.setItem("me", JSON.stringify(userData));
        
        setIsAuthenticated(true);
        setUser(userData);
        
        if (userData?.uloga === 'admin') {
            navigate("/admin");
        } else {
            navigate("/");
        }
    };

    //LOGOUT FUNKCIJA (Sada briše i token za Laravel)
    const logout = async () => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                await axios.post('http://localhost:8000/api/logout', {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (e) {
            console.error("Greška pri odjavi na serveru:", e);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("me");
            setIsAuthenticated(false);
            setUser(null);
            navigate("/login");
        }
    };

    const value = {
        isAuthenticated,
        user,
        isAdmin,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};