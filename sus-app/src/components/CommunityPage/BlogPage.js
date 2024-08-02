// BlogPage.js
import React from "react";
import { useParams } from "react-router-dom";
import dataset from "../../data/dataset.json";


function BlogPage() {
  const { id } = useParams();
  const blogData = dataset.find(record => record.id === parseInt(id));

  if (!blogData) {
    return <div>Blog not found</div>;
  }

  return (
    <>
      <div className="blog-page">
        <div className="blog-banner">
          <div className="blog-title" key={blogData.id}>
            <h1>{blogData.title} </h1>
            <hr />
            <p>{blogData.blog_title}</p>
            <hr />
          </div>
          <div className="blog-banner-img">
            <img src={blogData.img_url} alt="" />
          </div>
        </div>

        <div className="about-blog">
          <hr />
          <h1>{blogData.title_2}</h1>
          <hr />
          <p>{blogData.blog_title_2}</p>
          <p>{blogData.sub_blog_title_2}</p>

          <hr />
          <h1>{blogData.title_3}</h1>
          <hr />
          <p>{blogData.blog_title_3}</p>

          <div className="about-blog-container">
            <p>{blogData.sub_blog_title_3}</p>
          </div>

          <hr />
          <h1>{blogData.title_4}</h1>
          <hr />
          <p>{blogData.blog_title_4}</p>
        </div>
      </div>

    </>
  );
}

export default BlogPage;