
import App from './App';
import { ProSidebarProvider } from "react-pro-sidebar";
import React from 'react';
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ProSidebarProvider><App /></ProSidebarProvider>);
