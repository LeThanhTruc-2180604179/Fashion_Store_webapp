import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductList from '../components/product/ProductList';
import { useProducts } from '../context/ProductContext';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import AOS from 'aos';
import 'aos/dist/aos.css';

const brandImages = [
  {
    src: 'https://seeklogo.com/images/A/a-bathing-ape-logo-9DF1B52152-seeklogo.com.png',
    alt: 'A Bathing Ape',
  },
  {
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPjzfyjYeWELiSp-YaiK8mOBkkG5AmMUacnQ&s',
    alt: 'NIKE',
  },
  {
    src: 'https://seeklogo.com/images/O/off-white-logo-11A3DFCE2B-seeklogo.com.png',
    alt: 'OFF-WHITE',
  },
  {
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTemwNAtf_se9j3xeaboEVW0uSiQ57mBAfd3w&s',
    alt: 'ADIDAS',
  },
];

const bannerImages = [
  {
    url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
    title: 'Chào Mừng Đến Với ClothingStore',
    desc: 'Khám phá bộ sưu tập thời trang mới nhất với giá ưu đãi!'
  },
  {
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
    title: 'Phong Cách Cá Tính',
    desc: 'Thời trang trẻ trung, năng động cho mọi lứa tuổi.'
  },
  {
    url: 'https://images.unsplash.com/photo-1469398715555-76331a6c7c9b?auto=format&fit=crop&w=1200&q=80',
    title: 'Ưu Đãi Đặc Biệt',
    desc: 'Săn sale cực sốc, giảm giá lên đến 50%.'
  },
  {
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    title: 'Bộ Sưu Tập Mới',
    desc: 'Cập nhật xu hướng thời trang mới nhất.'
  },
];

const blogPosts = [
  {
    image: "https://images.squarespace-cdn.com/content/v1/5a15ad16b7411ccec818471e/1548566034750-FTZAO5OCG9CB6MH6WWTN/Kolor+Magazine+7+Legit+Website+That+Sale+Discounted+Off-White.png",
    title: "Post 1 Headline",
    desc: "Sample small text. Lorem ipsum dolor sit amet.",
    date: "Wed Jul 22 2020"
  },
  {
    image: "https://jp.bape.com/cdn/shop/files/2506_ABC-CAMO_BANNER_1000x667_1_850x.jpg?v=1749622998",
    title: "Post 2 Headline",
    desc: "Sample small text. Lorem ipsum dolor sit amet.",
    date: "Wed Jul 22 2020"
  },
  {
    image: "https://i.pinimg.com/1200x/b1/58/93/b15893bdd55cc7c0a74179ea7ad1ded5.jpg",
    title: "Post 3 Headline",
    desc: "Sample small text. Lorem ipsum dolor sit amet.",
    date: "Wed Jul 22 2020"
  }
];

const HomePage = () => {
  const { products, loading } = useProducts();

  const newArrivals = products
    .filter((product) => new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    .slice(0, 12);

  const saleProducts = products
    .filter((product) => product.originalPrice > product.price)
    .slice(0, 8);

  // Brand slider state
  const [brandIdx, setBrandIdx] = useState(0);
  const visibleBrands = brandImages.slice(brandIdx, brandIdx + 6);

  // New Arrivals slider state
  const [arrivalIdx, setArrivalIdx] = useState(0);
  const ARRIVALS_PER_PAGE = 4;
  const visibleArrivals = newArrivals.slice(arrivalIdx, arrivalIdx + ARRIVALS_PER_PAGE);

  // Banner slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);
  const goToSlide = (idx) => setCurrentSlide(idx);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % bannerImages.length);

  const handlePrevBrand = () => {
    setBrandIdx((prev) => (prev - 1 + brandImages.length) % brandImages.length);
  };
  const handleNextBrand = () => {
    setBrandIdx((prev) => (prev + 1) % brandImages.length);
  };

  const handlePrevArrival = () => {
    setArrivalIdx((prev) => Math.max(prev - ARRIVALS_PER_PAGE, 0));
  };
  const handleNextArrival = () => {
    setArrivalIdx((prev) =>
      prev + ARRIVALS_PER_PAGE < newArrivals.length ? prev + ARRIVALS_PER_PAGE : prev
    );
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      {/* Banner Slider */}
      <section className="relative rounded-2xl overflow-hidden mb-8 sm:mb-12 h-[180px] xs:h-[240px] md:h-[400px]">
        {bannerImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            style={{backgroundImage: `url(${img.url})`, backgroundSize: 'cover', backgroundPosition: 'center'}}
            aria-hidden={idx !== currentSlide}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white px-1 xs:px-2 md:px-0">
                <h1 className="text-lg xs:text-2xl md:text-5xl font-bold mb-2 xs:mb-4 drop-shadow-lg">{img.title}</h1>
                <p className="text-xs xs:text-base mb-3 xs:mb-6 drop-shadow">{img.desc}</p>
                <Link
                  to="/shop"
                  className="bg-blue-600 text-white px-4 xs:px-6 py-2 xs:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg text-xs xs:text-base"
                >
                  Mua Sắm Ngay
                </Link>
              </div>
            </div>
          </div>
        ))}
        {/* Dots */}
        <div className="absolute bottom-3 xs:bottom-6 left-1/2 -translate-x-1/2 flex gap-1 xs:gap-2 z-20">
          {bannerImages.map((_, idx) => (
            <button
              key={idx}
              className={`w-2 xs:w-3 h-2 xs:h-3 rounded-full border-2 ${idx === currentSlide ? 'bg-white border-blue-600' : 'bg-gray-300 border-white'} transition-all`}
              onClick={() => goToSlide(idx)}
              aria-label={`Chuyển đến banner ${idx+1}`}
            />
          ))}
        </div>
        {/* Prev/Next buttons */}
        <button onClick={prevSlide} className="absolute left-2 xs:left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-60 text-white p-1 xs:p-2 rounded-full z-20 hidden md:block"><ChevronLeft size={28}/></button>
        <button onClick={nextSlide} className="absolute right-2 xs:right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-60 text-white p-1 xs:p-2 rounded-full z-20 hidden md:block"><ChevronRight size={28}/></button>
      </section>

      {/* Banner/Promotion Section */}
      <section data-aos="fade-up" className="flex flex-col md:flex-row items-center justify-between bg-blue-50 rounded-2xl p-4 sm:p-8 mb-8 sm:mb-12 mt-4 sm:mt-8 gap-4 sm:gap-8">
        <div className="flex-1 text-center md:text-left">
          <div className="uppercase text-[10px] xs:text-xs text-blue-700 font-semibold mb-1 xs:mb-2 tracking-widest">Ưu đãi lớn</div>
          <h2 className="text-xl xs:text-3xl md:text-4xl font-bold mb-2 xs:mb-4">Tiết kiệm <span className="text-blue-600">50%</span> cho mọi đơn hàng!</h2>
          <p className="text-gray-700 mb-3 xs:mb-6 max-w-md text-xs xs:text-base">Khám phá các sản phẩm thời trang mới nhất với giá cực tốt. Đừng bỏ lỡ cơ hội sở hữu những item hot trend với mức giá ưu đãi chỉ có tại ClothingStore.</p>
          <Link to="/shop?sale=true" className="inline-block bg-blue-600 text-white px-4 xs:px-6 py-2 xs:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow text-xs xs:text-base">Mua ngay</Link>
        </div>
        <div className="flex-1 flex justify-center items-center relative min-h-[120px] xs:min-h-[180px] md:min-h-[260px]">
          <div className="relative w-32 xs:w-44 h-40 xs:h-56 md:w-56 md:h-64">
            <img
              src="https://www.thedoublef.com/cdn-cgi/image/quality=75/media/catalog/category/off_white_thedoublef_uomo_mob_7.jpg"
              alt="Promotion1"
              className="rounded-xl shadow-lg w-24 xs:w-36 h-32 xs:h-44 object-cover absolute left-0 top-0 z-10 border-4 border-white"
            />
            <img
              src="https://static.nike.com/a/images/f_auto,cs_srgb/w_1920,c_limit/32e16830-6a41-428b-81e5-064147aa0eb0/the-teenage-creatives-changing-music-and-modeling.jpg"
              alt="Promotion2"
              className="rounded-xl shadow-lg w-20 xs:w-32 h-28 xs:h-40 object-cover absolute left-20 xs:left-32 top-6 xs:top-8 z-0 border-4 border-white"
            />
          </div>
        </div>
      </section>

      {/* New Arrivals (phóng to, không slide, card to) */}
      <section data-aos="fade-up" className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">New Arrivals</h2>
          <Link
            to="/shop?sort=newest"
            className="flex items-center text-blue-600 hover:underline"
          >
            Xem tất cả <ChevronRight size={20} className="ml-1" />
          </Link>
        </div>
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 w-full max-w-6xl">
            {newArrivals
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 4)
              .map((product) => (
                <ProductCard key={product.id} product={product} showNewBadge={true} />
              ))}
          </div>
        </div>
      </section>

      {/* Sale Products */}
      <section data-aos="fade-up" className="">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Sản Phẩm Giảm Giá</h2>
          <Link
            to="/shop?sale=true"
            className="flex items-center text-blue-600 hover:underline"
          >
            Xem tất cả <ChevronRight size={20} className="ml-1" />
          </Link>
        </div>
        <ProductList products={saleProducts} loading={loading} showSaleBadge={true} />
      </section>

      {/* Blog Section */}
      <section data-aos="fade-up" className="mt-12 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Our Blog</h2>
          <p className="text-gray-500">Tin tức mới nhất từ chúng tôi</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <img src={post.image} alt={post.title} className="rounded-lg mb-4 w-full h-48 object-cover" />
              <h3 className="font-bold text-lg mb-2">{post.title}</h3>
              <p className="text-gray-600 text-sm mb-2 text-center">{post.desc}</p>
              <div className="text-xs text-gray-400 mb-4">{post.date}</div>
              <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition">Read More</button>
            </div>
          ))}
        </div>
      </section>

      {/* Contact/Map Section */}
      <section data-aos="fade-up" className="mt-12 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center bg-white rounded-2xl shadow p-6">
          <div className="w-full h-80 rounded-xl overflow-hidden">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.502086036195!2d106.7004233153346!3d10.77688999232247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1c1b0b6e6b%3A0x6f2c6b7b7b7b7b7b!2zSG_DoGNoIE1pbmggQ2l0eSwgUXXhuqNuIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1680000000000!5m2!1svi!2s" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
          <form className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold mb-2">Liên hệ với ClothingStore</h2>
            <div className="text-gray-600 mb-2">Bạn có câu hỏi về sản phẩm, đơn hàng hoặc muốn hợp tác? Gửi thông tin cho chúng tôi, đội ngũ ClothingStore sẽ phản hồi sớm nhất!</div>
            <input type="text" placeholder="Họ và tên" className="border rounded px-3 py-2" />
            <input type="email" placeholder="Email của bạn" className="border rounded px-3 py-2" />
            <textarea placeholder="Nội dung liên hệ (ví dụ: hỏi về size, mẫu, đơn hàng...)" className="border rounded px-3 py-2" rows={3}></textarea>
            <label className="flex items-center text-xs text-gray-500">
              <input type="checkbox" className="mr-2" /> I accept the <a href="#" className="underline ml-1">Terms of Service</a>
            </label>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition">Gửi liên hệ</button>
          </form>
        </div>
      </section>

      {/* Brand Section (4 logo, không slide) */}
      <section data-aos="fade-up" className="mt-16 mb-16">
        <h2 className="text-2xl font-bold text-center mb-4">Brand</h2>
        <div className="flex justify-center mb-2">
          <div className="w-16 h-1 bg-black rounded-full" />
        </div>
        <div className="flex items-center justify-center gap-12 w-full px-2 md:px-8">
          {brandImages.map((brand, idx) => (
            <div key={idx} className="aspect-square rounded-xl overflow-hidden flex flex-col items-center justify-center bg-gray-50 w-32 h-32 md:w-40 md:h-40 mx-2">
              <img src={brand.src} alt={brand.alt} className="object-contain w-20 h-20 md:w-28 md:h-28" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="font-bold">Business Planning</div>
            <div className="text-xs text-gray-500">Sample text. Click to select the Text Element.</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="font-bold">Consulting Services</div>
            <div className="text-xs text-gray-500">Sample text. Click to select the Text Element.</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="font-bold">Inventory Management</div>
            <div className="text-xs text-gray-500">Sample text. Click to select the Text Element.</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="font-bold">Easy to Use</div>
            <div className="text-xs text-gray-500">Sample text. Click to select the Text Element.</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;