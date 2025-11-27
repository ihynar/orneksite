import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import SiteNavbar from './components/SiteNavbar';
import SiteFooter from './components/SiteFooter';
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Portfolio from './pages/Portfolio';
import PortfolioDetail from './pages/PortfolioDetail';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminServices from './pages/AdminServices';
import AdminProjects from './pages/AdminProjects';
import AdminGallery from './pages/AdminGallery';
import AdminPosts from './pages/AdminPosts';
import AdminContacts from './pages/AdminContacts';
import ProtectedRoute from './components/ProtectedRoute';

const SiteLayout = () => (
  <>
    <SiteNavbar />
    <main>
      <Outlet />
    </main>
    <SiteFooter />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/hakkimda" element={<About />} />
          <Route path="/galeri" element={<Gallery />} />
          <Route path="/portfoy" element={<Portfolio />} />
          <Route path="/portfoy/:id" element={<PortfolioDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/iletisim" element={<Contact />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="contacts" element={<AdminContacts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
