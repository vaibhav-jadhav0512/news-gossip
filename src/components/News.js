import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
// import sample from "../sample.json";
export class News extends Component {
  category =
    this.props.category[0].toUpperCase() + this.props.category.slice(1);
  constructor(props) {
    super(props);
    this.state = {
      sample: [], //json discarded
      loading: true,
      page: 1,
    };
    document.title = `${this.category} - NewsGossip`;
  }

  async updateNews() {
    let url = `https://newsapi.org/v2/top-headlines?apiKey=ade5a7397528461e83bf0268980af78c&country=${this.props.country}&page=${this.state.page}&pageSize=${this.props.pageSize}&category=${this.props.category}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      sample: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false,
    });
  }

  async componentDidMount() {
    this.setState({
      page: 1,
    });
    this.updateNews();
  }

  handlePrevClick = async () => {
    this.setState({
      page: this.state.page - 1,
    });
    this.updateNews();
  };
  handleNextClick = async () => {
    this.setState({
      page: this.state.page + 1,
    });
    this.updateNews();
  };

  render() {
    return (
      <div className="container my-3">
        <h2 className="text-center my-3">Top headlines - {this.category}</h2>
        {this.state.loading && <Spinner />}
        <div className="row">
          {!this.state.loading &&
            this.state.sample.map((e) => {
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
        <div className="container d-flex justify-content-between">
          <button
            disabled={this.state.page <= 1}
            type="button"
            className="btn btn-dark"
            onClick={this.handlePrevClick}
          >
            &larr; Prev
          </button>
          <button
            disabled={
              this.state.page + 1 >
              Math.ceil(this.state.totalResults / this.props.pageSize)
            }
            type="button"
            className="btn btn-dark"
            onClick={this.handleNextClick}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }
}

export default News;
