import React, { useState, useEffect } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
// import sample from "../sample.json";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [sample, setsample] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const category = props.category[0].toUpperCase() + props.category.slice(1);

  const updateNews = async () => {
    props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?apiKey=${props.apiKey}&country=${props.country}&page=${page}&pageSize=${props.pageSize}&category=${props.category}`;
    setLoading(true);
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(50);
    setsample(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    props.setProgress(100);
  };

  useEffect(() => {
    document.title = `${category} - NewsGossip`;
    updateNews();
    // eslint-disable-next-line
  }, []);

  const fetchMoreData = async () => {
    let url = `https://newsapi.org/v2/top-headlines?apiKey=${
      props.apiKey
    }&country=${props.country}&page=${page + 1}&pageSize=${
      props.pageSize
    }&category=${props.category}`;
    setPage(page + 1);
    let data = await fetch(url);
    let parsedData = await data.json();
    setsample(sample.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
  };

  return (
    <>
      <h2 className="text-center my-3">Top headlines - {category}</h2>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={sample.length}
        next={fetchMoreData}
        hasMore={sample.length < totalResults}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {sample.map((e) => {
              return (
                <div
                  className="col-lg-4 d-flex align-items-stretch"
                  key={e.url}
                >
                  <NewsItem
                    title={e.title ? e.title.slice(0, 62) : ""}
                    description={
                      e.description ? e.description.slice(0, 82) : ""
                    }
                    imageUrl={e.urlToImage}
                    newsUrl={e.url}
                    author={e.author}
                    date={e.publishedAt}
                    source={e.source.name}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

export default News;
