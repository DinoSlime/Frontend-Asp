import React from 'react';
import AppRouter from './routes/AppRouter';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; 

function App() {
  return (
      <AuthProvider>
        
         <CartProvider>
             <div className="App">
                <AppRouter />
             </div>
         </CartProvider>
      </AuthProvider>
  );
}

export default App;