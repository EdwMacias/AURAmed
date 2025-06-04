// import { useState } from 'react'
import './App.css'
import AppRouter from './routes/AppRouter';
import { Toaster } from '../src/components/ui/toaster';


export default function App() {
  return (
    <>
      <AppRouter />
      <Toaster />
    </>
  );
}
