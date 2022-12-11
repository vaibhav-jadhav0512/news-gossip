import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
// import sample from "../sample.json";
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  category =
    this.props.category[0].toUpperCase() + this.props.category.slice(1);
  constructor(props) {
    super(props);
    this.state = {
      sample: [], //json discarded
      loading: true,
      page: 1,
      totalResults: 0,
    };
    document.title = `${this.category} - NewsGossip`;
  }

  async updateNews() {
    this.props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?apiKey=${this.props.apiKey}&country=${this.props.country}&page=${this.state.page}&pageSize=${this.props.pageSize}&category=${this.props.category}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsedData = await data.json();
    this.props.setProgress(50);
    this.setState({
      sample: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false,
    });
    this.props.setProgress(100);
  }

  async componentDidMount() {
    this.updateNews();
  }

  fetchMoreData = async () => {
    this.setState({ page: this.state.page + 1 });
    let url = `https://newsapi.org/v2/top-headlines?apiKey=${this.props.apiKey}&country=${this.props.country}&page=${this.state.page}&pageSize=${this.props.pageSize}&category=${this.props.category}`;
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      sample: this.state.sample.concat(parsedData.articles),
      totalResults: parsedData.totalResults,
    });
  };

  render() {
    return (
      <>
        <h2 className="text-center my-3">Top headlines - {this.category}</h2>
        {this.state.loading && <Spinner />}
        <InfiniteScroll
          dataLength={this.state.sample.length}
          next={this.fetchMoreData}
          hasMore={this.state.sample.length < this.state.totalResults}
          loader={<Spinner />}
        >
          <div className="container">
            <div className="row">
              {this.state.sample.map((e) => {
                return (
                  <div
                    className="col-lg-4 d-flex align-items-stretch"
                    key={Math.random()}
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
  }
}

export default News;
