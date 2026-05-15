# Recommendation System

The recommendation flow combines product content, user behavior, and sustainability data. The goal is simple: show products that are relevant to the shopper and still favor better eco choices.

## Signals Used

The backend reads product and interaction data from MongoDB. User behavior comes from the `interactions` collection:

```js
{
  userId,
  productId,
  eventType,
  query,
  category,
  scoreWeight,
  sessionId,
  metadata,
  timestamp
}
```

Events are converted into implicit feedback:

```txt
view: 1
search/search_click: 2
wishlist: 3
cart_add: 4
cart_remove: -2
purchase: 8
```

A purchase carries more weight than a page view. Removing an item from the cart is treated as a negative signal.

## How Ranking Works

The recommender builds a user-product matrix from the interaction history, then compares users or sessions with cosine similarity. If two shoppers behave similarly, products liked by one shopper can become candidates for the other.

Those collaborative candidates are mixed with product content and sustainability signals:

```txt
Final Score =
  0.35 * content_similarity
+ 0.25 * collaborative_score
+ 0.20 * eco_score
+ 0.10 * popularity
+ 0.10 * freshness
```

The individual signals mean:

```txt
content_similarity   Product/category/price similarity
collaborative_score  Interest from similar users or sessions
eco_score            Sustainability score normalized for ranking
popularity           Overall interaction strength
freshness            Small boost for newer catalog items
```

## Backend Files

Main backend implementation:

```txt
sus-app-backend/controllers/recommendationController.js
```

Routes:

```txt
GET /api/recommendations/user/:userId
GET /api/recommendations/session/:sessionId
```

The response includes ranking signals and readable reasons so the UI can explain why a product was recommended.

## AI Service Files

Main AI service implementation:

```txt
ai-service/app/models/collaborative.py
ai-service/app/routes/recommend.py
ai-service/app/pipelines/feature_builder.py
```

Endpoint:

```txt
POST /recommendations/{user_id}
```

## Cold Start Behavior

When a shopper has no interaction history yet, the system falls back to products with strong eco scores and general popularity. Once the shopper views, searches, adds, or buys products, the ranking becomes more personalized.
