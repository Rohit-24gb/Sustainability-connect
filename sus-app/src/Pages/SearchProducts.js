import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import { trackInteraction } from "../config/tracking";
import "./SearchProducts.css";

const categories = [
  { id: "", label: "All categories" },
  { id: "1", label: "Personal Care" },
  { id: "2", label: "Stationery" },
  { id: "3", label: "Electronics" },
  { id: "4", label: "Clothing" },
  { id: "5", label: "Kitchen" },
  { id: "6", label: "Accessories" },
  { id: "7", label: "Household" },
  { id: "8", label: "Cleaning" },
  { id: "9", label: "Beauty" },
  { id: "10", label: "Fitness" },
  { id: "11", label: "Technology" }
];

const getProductImage = (product) => {
  if (Array.isArray(product.image_url)) {
    return product.image_url[0];
  }

  return product.image_url;
};

const SearchProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [results, setResults] = useState([]);
  const [expandedTerms, setExpandedTerms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activeQuery = searchParams.get("q") || "";

  const searchUrl = useMemo(() => {
    if (!activeQuery.trim()) {
      return "";
    }

    const params = new URLSearchParams({ q: activeQuery.trim(), limit: "30" });
    const activeCategory = searchParams.get("category");
    const activeMaxPrice = searchParams.get("maxPrice");

    if (activeCategory) {
      params.set("category", activeCategory);
    }

    if (activeMaxPrice) {
      params.set("maxPrice", activeMaxPrice);
    }

    return `${API_BASE_URL}/api/products/search?${params.toString()}`;
  }, [activeQuery, searchParams]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchUrl) {
        setResults([]);
        setExpandedTerms([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch(searchUrl);
        const data = await response.json();

        if (response.ok) {
          setResults(data.results || []);
          setExpandedTerms(data.expandedTerms || []);
          trackInteraction({
            eventType: "search",
            query: activeQuery,
            category: searchParams.get("category") || "",
            metadata: {
              source: "semantic_product_search",
              resultCount: data.count || 0,
              maxPrice: searchParams.get("maxPrice") || ""
            }
          });
        } else {
          setError(data.message || "Search failed");
        }
      } catch (err) {
        setError("Could not search products. Please check the backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [activeQuery, searchParams, searchUrl]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextParams = {};

    if (query.trim()) {
      nextParams.q = query.trim();
    }

    if (category) {
      nextParams.category = category;
    }

    if (maxPrice) {
      nextParams.maxPrice = maxPrice;
    }

    setSearchParams(nextParams);
  };

  return (
    <main className="search-products-page">
      <section className="search-products-toolbar">
        <h1>Intelligent Product Search</h1>
        <form onSubmit={handleSubmit} className="search-products-form">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try: low carbon personal care under 500"
          />
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => (
              <option key={item.id || "all"} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            placeholder="Max price"
          />
          <button type="submit">Search</button>
        </form>
      </section>

      {expandedTerms.length > 0 && (
        <div className="expanded-terms">
          <span>Also matched:</span>
          {expandedTerms.map((term) => (
            <span key={term}>{term}</span>
          ))}
        </div>
      )}

      {loading && <p className="search-products-state">Searching products...</p>}
      {error && <p className="search-products-state search-products-error">{error}</p>}

      {!loading && !error && activeQuery && (
        <p className="search-products-count">
          {results.length} results for "{activeQuery}"
        </p>
      )}

      <section className="search-results-grid">
        {results.map(({ product, searchScore, reasons }) => (
          <Link to={`/product/${product.productID}`} className="search-result-card" key={product._id}>
            {getProductImage(product) && (
              <img src={getProductImage(product)} alt={product.name} />
            )}
            <div className="search-result-content">
              <h2>{product.name}</h2>
              <p className="search-result-price">Rs. {Number(product.price).toFixed(2)}</p>
              <div className="search-impact-row">
                <span>Eco {product.ecoScore ?? 50}/100</span>
                <span>{product.carbonKgCO2e ?? 1.5} kg CO2e</span>
              </div>
              <p className="search-result-reason">{reasons?.[0] || "Matched your search intent"}</p>
              <span className="search-relevance">Relevance {Math.min(100, Math.round(searchScore * 8))}%</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
};

export default SearchProducts;
