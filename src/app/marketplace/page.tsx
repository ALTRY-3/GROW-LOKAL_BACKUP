"use client";

import { useState } from "react";
import ImageCarousel from "@/components/ImageCarousel1";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductModal from "@/components/ProductModal";
import "./marketplace.css";

interface Product {
  img: string;
  hoverImg: string;
  name: string;
  artist: string;
  price: string;
}

const handicrafts: Product[] = [
  {
    img: "/box1.png",
    hoverImg: "/box1.1.png",
    name: "Acacia Wood Deep Round Plate",
    artist: "THERESA",
    price: "₱149.00",
  },
  {
    img: "/box2.png",
    hoverImg: "/box2.2.png",
    name: "Classic Woven Fedora Hat",
    artist: "TROPIKO",
    price: "₱249.75",
  },
  {
    img: "/box3.png",
    hoverImg: "/box3.3.png",
    name: "Acacia Wood Salad Tosser",
    artist: "MANG JUAN",
    price: "₱349.75",
  },
  {
    img: "/box4.png",
    hoverImg: "/box4.4.png",
    name: "Acacia Wood Ladle",
    artist: "MARIA",
    price: "₱199.00",
  },
  {
    img: "/box5.png",
    hoverImg: "/box5.5.png",
    name: "Acacia Wood Plate",
    artist: "JOSE",
    price: "₱499.00",
  },
  {
    img: "/box6.png",
    hoverImg: "/box6.6.png",
    name: "Hardin Beaded Earrings",
    artist: "BOHO",
    price: "₱499.00",
  },
  {
    img: "/box7.png",
    hoverImg: "/box7.7.png",
    name: "Handwoven Buri Bag",
    artist: "LENG",
    price: "₱79.00",
  },
  {
    img: "/box8.png",
    hoverImg: "/box8.8.png",
    name: "Round Nito Placemat",
    artist: "TAHANAN",
    price: "₱399.00",
  },
];

const fashion: Product[] = [
  {
    img: "/fashion1.png",
    hoverImg: "/fashion1.1.png",
    name: "Blue Leaf Print Dress",
    artist: "PIÑA CLOTH",
    price: "₱199.75",
  },
  {
    img: "/fashion2.png",
    hoverImg: "/fashion2.2.png",
    name: "Tie-Dye Tube Dress",
    artist: "NATURAL",
    price: "₱699.00",
  },
  {
    img: "/fashion3.png",
    hoverImg: "/fashion3.3.png",
    name: "Crochet Dress with Beaded Straps",
    artist: "COTTON",
    price: "₱799.00",
  },
  {
    img: "/fashion4.png",
    hoverImg: "/fashion4.4.png",
    name: "Banig Belt",
    artist: "PATTERNED",
    price: "₱399.00",
  },
  {
    img: "/fashion5.png",
    hoverImg: "/fashion5.5.png",
    name: "Embroidered Shawls",
    artist: "NUEVO",
    price: "₱699.00",
  },
  {
    img: "/fashion6.png",
    hoverImg: "/fashion6.6.png",
    name: "Collared Embroidered Shirt",
    artist: "HANDMADE",
    price: "₱899.00",
  },
  {
    img: "/fashion7.png",
    hoverImg: "/fashion7.7.png",
    name: "Native Abaca Headband",
    artist: "MULTICOLOR",
    price: "₱199.00",
  },
  {
    img: "/fashion8.png",
    hoverImg: "/fashion8.8.png",
    name: "PH Embroidered Cap",
    artist: "NATIVE",
    price: "₱249.00",
  },
];

const home: Product[] = [
  {
    img: "/home1.png",
    hoverImg: "/home1.1.png",
    name: "Floral Hand-Painted Fan",
    artist: "LANDSCAPE",
    price: "₱249.00",
  },
  {
    img: "/home2.png",
    hoverImg: "/home2.2.png",
    name: "Miniature Jeepney",
    artist: "WOOD",
    price: "₱499.00",
  },
  {
    img: "/home3.png",
    hoverImg: "/home3.3.png",
    name: "Retaso Patchwork",
    artist: "CUSTOM",
    price: "₱2,799.00",
  },
  {
    img: "/home4.png",
    hoverImg: "/home4.4.png",
    name: "Mother Pearl Pen Holder",
    artist: "TAHANAN",
    price: "₱799.00",
  },
  {
    img: "/home5.png",
    hoverImg: "/home5.5.png",
    name: "Handcrafted Christmas Parol",
    artist: "FILIPINO QUOTE",
    price: "₱1,099.00",
  },
  {
    img: "/home6.png",
    hoverImg: "/home6.6.png",
    name: "Rice Grooved Kuksa Mug",
    artist: "KAHOY",
    price: "₱449.00",
  },
  {
    img: "/home7.png",
    hoverImg: "/home7.7.png",
    name: "Pandan Picture Frame",
    artist: "TRIBAL",
    price: "₱849.00",
  },
  {
    img: "/home8.png",
    hoverImg: "/home8.8.png",
    name: "Hand-Painted Cushion Cover",
    artist: "GAPO",
    price: "₱1,499.00",
  },
];

const food: Product[] = [
  {
    img: "/food1.png",
    hoverImg: "/food1.1.png",
    name: "Green Banana Chips 85g",
    artist: "KYLA",
    price: "₱120.00",
  },
  {
    img: "/food2.png",
    hoverImg: "/food2.2.png",
    name: "Sabanana Sweet Original 100g",
    artist: "KYLA",
    price: "₱89.00",
  },
  {
    img: "/food3.png",
    hoverImg: "/food3.3.png",
    name: "Sweet & Spicy Dilis 60g",
    artist: "KYLA",
    price: "₱99.00",
  },
  {
    img: "/food4.png",
    hoverImg: "/food4.4.png",
    name: "Camote Chips Kimchi Flavor 60g",
    artist: "KYLA",
    price: "₱99.00",
  },
  {
    img: "/food5.png",
    hoverImg: "/food5.5.png",
    name: "KangKong Chips Cheese 60gs",
    artist: "ALJHUN",
    price: "₱149.00",
  },
  {
    img: "/food6.png",
    hoverImg: "/food6.6.png",
    name: "Pure Benguet Honey",
    artist: "ALJHUN",
    price: "₱369.00",
  },
  {
    img: "/food7.png",
    hoverImg: "/food7.7.png",
    name: "Cebu Dried Mangoes 200g",
    artist: "ALJHUN",
    price: "₱319.00",
  },
  {
    img: "/food8.png",
    hoverImg: "/food8.8.png",
    name: "Native Chocolate with Cacao",
    artist: "ALJHUN",
    price: "₱99.00",
  },
];

const beauty: Product[] = [
  {
    img: "/beauty1.png",
    hoverImg: "/beauty1.1.png",
    name: "Eucalyptus Massage Oil 230ml",
    artist: "ATIN",
    price: "₱699.00",
  },
  {
    img: "/beauty2.png",
    hoverImg: "/beauty2.2.png",
    name: "Nourishing Hari Oil 60ml",
    artist: "SIBOL",
    price: "₱379.75",
  },
  {
    img: "/beauty3.png",
    hoverImg: "/beauty3.3.png",
    name: "Organic Deodorant",
    artist: "JABON",
    price: "₱229.00",
  },
  {
    img: "/beauty4.png",
    hoverImg: "/beauty4.4.png",
    name: "Sanitizer",
    artist: "SHEPARD",
    price: "₱249.00",
  },
  {
    img: "/beauty5.png",
    hoverImg: "/beauty5.5.png",
    name: "Skin Care Soap",
    artist: "AYO",
    price: "₱259.00",
  },
  {
    img: "/beauty6.png",
    hoverImg: "/beauty6.6.png",
    name: "Liquid Conditioner",
    artist: "LEYLA",
    price: "₱429.00",
  },
  {
    img: "/beauty7.png",
    hoverImg: "/beauty7.7.png",
    name: "Botanical Sanitizer",
    artist: "NATURALE",
    price: "₱899.00",
  },
  {
    img: "/beauty8.png",
    hoverImg: "/beauty8.8.png",
    name: "Anti-Dandruff Shampoo Bar 75g",
    artist: "SIBOL",
    price: "₱229.00",
  },
];

export default function Marketplace() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  const allProducts: Product[] = [
    ...handicrafts,
    ...fashion,
    ...home,
    ...food,
    ...beauty,
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setSuggestions([]);
    } else {
      const filtered = allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(value.toLowerCase()) ||
          p.artist.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5)); // show top 5
    }
  };

  const handleSuggestionClick = (product: Product) => {
    setSelectedProduct(product);
    setQuery("");
    setSuggestions([]);
  };

  return (
    <div className="marketplace-page">
      <Navbar />

      <div className="search-bar-container">
        <div className="search-bar">
          <i className="fas fa-search search-icon"></i>
          <input
            className="search-input"
            type="text"
            placeholder="Search for a product or artist"
            value={query}
            onChange={handleSearchChange}
          />
        </div>

        {suggestions.length > 0 && (
          <ul className="suggestions-box">
            {suggestions.map((product, index) => (
              <li key={index} onClick={() => handleSuggestionClick(product)}>
                <img src={product.img} alt={product.name} />
                <span>{product.name}</span>
                <span className="suggestion-artist">{product.artist}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="carousel-section">
        <ImageCarousel autoSlide={true} slideInterval={3000} />
        <div className="carousel-text">Discover local treasures.</div>
      </div>

      <Section
        title="HANDICRAFTS"
        products={handicrafts}
        setSelectedProduct={setSelectedProduct}
      />
      <Section
        title="FASHION"
        products={fashion}
        setSelectedProduct={setSelectedProduct}
      />
      <Section
        title="HOME"
        products={home}
        setSelectedProduct={setSelectedProduct}
      />
      <Section
        title="FOOD"
        products={food}
        setSelectedProduct={setSelectedProduct}
      />
      <Section
        title="BEAUTY & WELLNESS"
        products={beauty}
        setSelectedProduct={setSelectedProduct}
      />

      <Footer />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

function Section({
  title,
  products,
  setSelectedProduct,
}: {
  title: string;
  products: Product[];
  setSelectedProduct: (product: Product) => void;
}) {
  return (
    <>
      <div className="section-title">{title}</div>
      <div className="product-grid">
        {products.map((product, index) => (
          <div className="product-card" key={index}>
            <div className="image-container">
              <img
                src={product.img}
                alt={product.name}
                className="product-image default"
              />
              <img
                src={product.hoverImg}
                alt={product.name}
                className="product-image hover"
              />
              <button
                className="view-button"
                onClick={() => setSelectedProduct(product)}
              >
                View
              </button>
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-artist">{product.artist}</p>
              <span className="product-price">{product.price}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
