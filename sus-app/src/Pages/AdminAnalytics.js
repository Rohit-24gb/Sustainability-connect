import React, { useEffect, useMemo, useState } from "react";
import { API_BASE_URL, getAuthHeaders } from "../config/api";
import "./AdminAnalytics.css";

const formatNumber = (value) => Number(value || 0).toLocaleString();
const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

const MetricCard = ({ label, value, detail }) => (
  <div className="analytics-card">
    <span>{label}</span>
    <strong>{value}</strong>
    {detail && <p>{detail}</p>}
  </div>
);

const BarList = ({ items, labelKey, valueKey, suffix = "" }) => {
  const max = Math.max(...items.map((item) => Number(item[valueKey] || 0)), 1);

  return (
    <div className="analytics-bars">
      {items.map((item) => (
        <div className="analytics-bar-row" key={item[labelKey] || item._id}>
          <div className="analytics-bar-label">
            <span>{item[labelKey] || item._id}</span>
            <strong>{Number(item[valueKey] || 0).toFixed(valueKey.includes("avg") ? 1 : 0)}{suffix}</strong>
          </div>
          <div className="analytics-bar-track">
            <div style={{ width: `${(Number(item[valueKey] || 0) / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
};

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user || !["admin", "seller"].includes(user.role)) {
        setError("Admin or seller access is required.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/analytics/overview`, {
          headers: getAuthHeaders()
        });
        const data = await response.json();

        if (response.ok) {
          setAnalytics(data);
        } else {
          setError(data.message || "Failed to load analytics");
        }
      } catch (err) {
        setError("Could not connect to analytics API.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  if (loading) {
    return (
      <main className="analytics-page">
        <div className="analytics-skeleton" />
        <div className="analytics-skeleton grid" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="analytics-page">
        <section className="analytics-error">
          <h1>Analytics unavailable</h1>
          <p>{error}</p>
        </section>
      </main>
    );
  }

  const overview = analytics?.overview || {};
  const aiMetrics = analytics?.aiMetrics || {};

  return (
    <main className="analytics-page">
      <section className="analytics-header">
        <div>
          <h1>Admin Analytics</h1>
          <p>Product, AI, search, and sustainability signals from the last 30 days.</p>
        </div>
        <span>Since {new Date(analytics.since).toLocaleDateString()}</span>
      </section>

      <section className="analytics-grid">
        <MetricCard label="Users" value={formatNumber(overview.totalUsers)} detail={`${formatNumber(overview.dailyActiveUsers)} active today`} />
        <MetricCard label="Orders" value={formatNumber(overview.totalOrders)} detail={`${formatCurrency(overview.totalRevenue)} revenue`} />
        <MetricCard label="Product Views" value={formatNumber(overview.productViews)} detail={`${overview.viewToCartRate}% view to cart`} />
        <MetricCard label="Cart Conversion" value={`${overview.cartConversionRate}%`} detail={`${formatNumber(overview.purchases)} purchases`} />
        <MetricCard label="Searches" value={formatNumber(overview.searches)} detail="semantic and category searches" />
        <MetricCard label="Carbon Saved" value={`${overview.estimatedCarbonSavedKg} kg`} detail="estimated vs baseline products" />
      </section>

      <section className="analytics-grid ai">
        <MetricCard label="Recommendation CTR" value={`${aiMetrics.recommendationCtr}%`} detail={`${formatNumber(aiMetrics.recommendationClicks)} clicks`} />
        <MetricCard label="Recommendation Purchases" value={formatNumber(aiMetrics.recommendationPurchases)} detail={`${aiMetrics.recommendationPurchaseRate}% purchase rate`} />
        <MetricCard label="Cold-start Users" value={formatNumber(aiMetrics.coldStartUsers)} detail="users with limited signals" />
      </section>

      <section className="analytics-panels">
        <div className="analytics-panel">
          <h2>Top Products</h2>
          <BarList items={analytics.topProducts || []} labelKey="productName" valueKey="score" />
        </div>
        <div className="analytics-panel">
          <h2>Top Search Queries</h2>
          <BarList items={analytics.topSearchQueries || []} labelKey="_id" valueKey="count" />
        </div>
        <div className="analytics-panel">
          <h2>No-result Searches</h2>
          {(analytics.noResultSearches || []).length ? (
            <BarList items={analytics.noResultSearches || []} labelKey="_id" valueKey="count" />
          ) : (
            <p className="analytics-empty">No zero-result searches yet.</p>
          )}
        </div>
        <div className="analytics-panel">
          <h2>Top Sustainable Categories</h2>
          <BarList items={analytics.topSustainableCategories || []} labelKey="categoryName" valueKey="avgEcoScore" suffix="/100" />
        </div>
        <div className="analytics-panel">
          <h2>Eco Score Distribution</h2>
          <BarList items={(analytics.ecoDistribution || []).map((item) => ({ ...item, range: String(item._id) }))} labelKey="range" valueKey="count" />
        </div>
        <div className="analytics-panel">
          <h2>Top Explanation Reasons</h2>
          <BarList items={analytics.topExplanationReasons || []} labelKey="reason" valueKey="count" />
        </div>
      </section>
    </main>
  );
};

export default AdminAnalytics;
