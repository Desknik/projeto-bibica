import Navbar from '../components/Navbar/index'
import Footer from '../components/Footer/index'

import { AuthProvider} from '../contexts/AuthContext'
 
export default function RootLayout({ children }) {
 return (
    <>
      <AuthProvider>
        <Navbar/>
          <div>{children}</div>
        <Footer/>
      </AuthProvider>
    </>
  )
}

