import React, { Component } from "react";
import SearchCard from "../components/SearchCard";
import SearchDisplay from "../components/SearchDisplay";
import BookCardItem from "../components/BookCardItem";
import SaveDisplay from "../components/SaveDisplay";
import API from "../utils/API";


class Books extends Component {

    state = {
        results: [],
        savedBooks: [],
        bookSearch: ""
    };

    componentDidMount (){
        API.getSavedBooks()
                .then(res => {
                    this.setState({
                        savedBooks: res.data
                    })
                    console.log(this.state.savedBooks)
                })
            
    }


    //On Button click for searching books 
    handleSearch = event => {

        event.preventDefault();

        if (this.state.bookSearch) {
            API.searchBooks(this.state.bookSearch)
                .then(res =>
                    this.setState({
                        results: res.data.items
                    })
                    // console.log("reesponse", res.data.items)
                )
                .catch(err => console.log(err));
        }
    }

    handleInputChange = event => {

        const value = event.target.value;

        this.setState({
            bookSearch: value
        })
    }

    handleSave = event => {
        const bookIndex = event.target.attributes.getNamedItem("data-index").value;
        const saveBook = this.state.results[bookIndex];
        console.log(saveBook);

        const bookData = {
            title: saveBook.volumeInfo.title,
            link: saveBook.volumeInfo.previewLink,
            thumbnail: saveBook.volumeInfo.imageLinks.thumbnail,
            author: saveBook.volumeInfo.authors[0],
            description: saveBook.volumeInfo.description,
            key: saveBook.id
        }

        API.saveBook(bookData.key, bookData)
            .then(API.getSavedBooks()
                .then(res => {
                    this.setState({
                        savedBooks: res.data
                    })
                    console.log("In state", this.state.savedBooks)
                    console.log("Length", this.state.savedBooks.length)
                })
            )
    }    

    handleDelete = event => {
        const bookIndex = event.target.attributes.getNamedItem("data-index").value;
        const deleteBook = this.state.savedBooks[bookIndex]
        console.log(deleteBook._id)

        API.deleteBook(deleteBook._id).then(
            
            window.location.reload()
        )
        
    }

    render() {
        return (
            <div>
                {window.location.pathname === "/" ?
                    <div>
                        <SearchCard
                            value={this.state.bookSearch}
                            onChange={this.handleInputChange}
                            onClick={this.handleSearch}
                        />

                        <SearchDisplay>
                            {this.state.results.length ? (

                                this.state.results.map( (book, i) => {
                                    return (
                                        <BookCardItem
                                            key={book.id}
                                            title={book.volumeInfo.title}
                                            author={(book.volumeInfo.authors) ? (book.volumeInfo.authors[0]) : ("Anonymous")}
                                            href={book.volumeInfo.previewLink}
                                            thumbnail={(book.volumeInfo.imageLinks) ? (book.volumeInfo.imageLinks.thumbnail) : ("https://upload.wikimedia.org/wikipedia/commons/3/3a/Book-icon-bible.png")}
                                            description={book.volumeInfo.description}
                                            save={this.handleSave}
                                            index={i}
                                        />
                                    )
                                })
                            ) : (
                                    <h3>No Results to Display</h3>
                                )}
                        </SearchDisplay>
                    </div>
                    :
                    <SaveDisplay>
                        {this.state.savedBooks.length ? (

                            this.state.savedBooks.map((book, i) => {
                                return (
                                    <BookCardItem
                                        key={book._id}
                                        title={book.title}
                                        author={book.author}
                                        href={book.link}
                                        thumbnail={(book.volumeInfo) ? (book.volumeInfo.imageLinks.thumbnail) : ("https://upload.wikimedia.org/wikipedia/commons/3/3a/Book-icon-bible.png")}
                                        description={book.description}
                                        delete={this.handleDelete}
                                        index={i}
                                    />
                                )
                            })
                        ) : (
                                <h3>No Saved Books Yet</h3>
                            )}
                    </SaveDisplay>
                }

            </div>
        )
    }

}

export default Books;