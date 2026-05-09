# Week 9: Collaborative Filtering and Hybrid Ranking

Week 9 upgrades the recommendation system from only content-aware ranking to a true hybrid recommender.

## Goal

Recommend products using both:

- What this user/session personally interacted with
- What similar users/sessions interacted with
- Product sustainability quality
- Product popularity
- Product freshness

## Data Source

The recommender uses the `interactions` collection:

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

Weighted events:

```txt
view: 1
search/search_click: 2
wishlist: 3
cart_add: 4
cart_remove: -2
purchase: 8
```

These weights convert raw behavior into implicit feedback. A purchase matters more than a view, while cart removal becomes a negative signal.

## Collaborative Filtering

The system builds a user-product matrix:

```txt
               productA  productB  productC
user/session1      1         4         0
user/session2      0         8         3
user/session3      1         0         4
```

Then it computes cosine similarity between the current user/session vector and other user/session vectors.

If another user has similar behavior, their positively weighted products become collaborative candidates.

Example explanation:

```txt
Users with similar eco-shopping activity also interacted with this
```

## Hybrid Ranking Formula

The final recommendation score is:

```txt
Final Score =
  0.35 * content_similarity
+ 0.25 * collaborative_score
+ 0.20 * eco_score
+ 0.10 * popularity
+ 0.10 * freshness
```

Signals:

- `content_similarity`: category, product text, and price similarity to products the user interacted with
- `collaborative_score`: products liked by similar users/sessions
- `eco_score`: normalized sustainability score
- `popularity`: global interaction strength
- `freshness`: newer catalog items get a small boost

## Backend Implementation

Main file:

```txt
sus-app-backend/controllers/recommendationController.js
```

Endpoints:

```txt
GET /api/recommendations/user/:userId
GET /api/recommendations/session/:sessionId
```

Response includes:

```js
{
  recommendations: [
    {
      product,
      recommendationScore,
      rankingSignals: {
        contentSimilarity,
        collaborativeScore,
        ecoScore,
        popularity,
        freshness
      },
      reasons
    }
  ],
  meta: {
    strategy: "hybrid-content-collaborative-eco",
    formula: "0.35 content + 0.25 collaborative + 0.20 eco + 0.10 popularity + 0.10 freshness",
    similarActors,
    maxActorSimilarity
  }
}
```

## FastAPI AI Service Implementation

Main files:

```txt
ai-service/app/models/collaborative.py
ai-service/app/routes/recommend.py
ai-service/app/pipelines/feature_builder.py
```

Endpoint:

```txt
POST /recommendations/{user_id}
```

The AI service now fills the `collaborative_score` slot in the existing hybrid scorer.

## Cold Start

If the user has no interaction history:

- The backend falls back to popularity + eco score.
- The AI service falls back to high eco-score products.

This keeps recommendations available for new users while still improving once behavior is collected.

## Interview Talking Point

You can say:

```txt
I implemented collaborative filtering using implicit feedback from user events. I build a user-product matrix from weighted interactions, compare users or sessions with cosine similarity, and recommend products that similar eco-shoppers interacted with. Then I combine the collaborative score with content similarity, eco score, popularity, and freshness using a hybrid ranking formula.
```
