import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './page/Dashboard/Dashboard'
import Register from './page/Register/Register'
import Login from './page/login/Logins'
import Subdomain from './page/subdomain/Subdomain'
import Transitions from './page/Transitions/Transitions'
import PaymentSuccess from './page/paymentSuccess/PaymentSuccess'






function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/donation/:referalid' element={<Subdomain />} />
        <Route path='/transactions' element={<Transitions/>}/>
        <Route path='/paymentsuccess' element={<PaymentSuccess/>}/>
      </Routes>

    </div>
  )
}

export default App