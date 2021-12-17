import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Button } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import BookItem from './BookItem.js';
import MyModal from './MyModal.js';
import defaultCover from './defaultCover.jpg';
import star from './star.png';

const BookList = ({b}) => {

    const [title, setTitle] = useState("");
    const [goClicked, setGoClicked] = useState(false);
    const [addAllDisabled, setAddAllDisabled] = useState(false);
    const [searchResults, setSearchResults] = useState(null);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const handleGoClicked = () => {
        setGoClicked(true);
    }

    const handleAgainClicked = () => {
        window.location.reload(false); 
    }

    function getRating(r) {
        return r*20; // represents the % of the rating (e.g., a 4/5 = 80% since 4*20 = 80)
    }

    const sortRating = (order) => {
        searchResults.sort((a, b) => {
            a.ratingForCalculation = a["volumeInfo"].averageRating;
            b.ratingForCalculation = b["volumeInfo"].averageRating;
            if (typeof a["volumeInfo"].averageRating == "undefined") {
                a.ratingForCalculation = 0;
            }
            if (typeof b["volumeInfo"].averageRating == "undefined") {
                b.ratingForCalculation = 0;
            }
            return order === "best" ? b.ratingForCalculation - a.ratingForCalculation : a.ratingForCalculation - b.ratingForCalculation;
        });
        setSearchResults(searchResults.map((c) => {
            return {...c};
        }));
    };

    const handleAddAllClicked = () => {
        var i;
        for (i = 0; i < searchResults.length; i++) {
            axios.post("http://localhost:8080/add-book", {
                book: searchResults[i].volumeInfo
            });
        }
        setAddAllDisabled(true);
    }

    useEffect(() => {
        const url = new URL("http://localhost:8080/search/" + title);
        axios.get(url.toString())
        .then((response) => {
            setSearchResults(response.data);
            console.log(response.data);
        })
        .catch((err) => {
            console.log(err);
        })
        setAddAllDisabled(false);
    },[title]);

    return (
    <div>
        <Input type="text" variant="outlined" placeholder="title" onChange={handleTitleChange}></Input>
        <Button style={{marginLeft:10, marginTop:10}} variant="contained" onClick={handleGoClicked}>Go</Button>
        {goClicked === true &&
            <Button style={{marginLeft:10, marginTop:10}} variant="contained" onClick={handleAgainClicked}>Search Again</Button>
        }
        {searchResults != null && goClicked === true &&
          <div>
            <h2 style={{marginTop:30}}>Results</h2>
            <TableContainer>
            <Table aria-label="simple table" size="small" style={{borderTop: '3px solid black', borderBottom: '3px solid black', borderLeft: '3px solid black', borderRight: '3px solid black', width:1000}} align="center">
                <TableHead style={{backgroundColor:"white"}}>
                <TableRow>
                    <TableCell align="center" style={{fontFamily: "Arial", fontSize: 18}}><b>Book</b></TableCell>
                    <TableCell align="center" style={{fontFamily: "Arial", fontSize: 18}}><b>Front Cover</b></TableCell>
                    <TableCell align="center" style={{fontFamily: "Arial", fontSize: 18}}><b>Average Rating</b><br /><Button onClick={() => sortRating("best")} size="small">Best</Button><Button onClick={() => sortRating("worst")} size="small">Worst</Button></TableCell>
                    <TableCell align="center" style={{fontFamily: "Arial", fontSize: 18}}><b>Add to <i>My Library</i></b></TableCell>
                </TableRow>
                </TableHead>
                <TableBody style={{backgroundColor:"white"}}>
                    {searchResults.map((b) =>   
                      <TableRow>
                        { typeof b["volumeInfo"].authors != "undefined"
                            ? <TableCell align="center">{<a href={b["volumeInfo"].previewLink} style={{fontFamily: "Arial", fontSize: 16}} target="_blank" rel="noreferrer"><i>{b["volumeInfo"].title}</i></a>}<br /> by {b["volumeInfo"].authors[0]} <MyModal b={b["volumeInfo"]} /> <br /></TableCell>
                            : <TableCell align="center">{<a href={b["volumeInfo"].previewLink} style={{fontFamily: "Arial", fontSize: 16}} target="_blank" rel="noreferrer"><i>{b["volumeInfo"].title}</i></a>} <MyModal b={b["volumeInfo"]} /> <br /></TableCell>
                        }
                        { typeof b["volumeInfo"].imageLinks != "undefined"
                            ? <TableCell align="center"><img src={b["volumeInfo"].imageLinks.thumbnail} style={{width:77, height:100}} alt="bookCover"></img></TableCell>
                            : <TableCell align="center"><img src={defaultCover} style={{width:77, height:100}} alt="bookCover"></img></TableCell>
                        }
                        { typeof b["volumeInfo"].averageRating != "undefined"
                            ? <TableCell align="center" style={{fontFamily: "Arial", fontSize: 16}}>{getRating(b["volumeInfo"].averageRating)}% {b["volumeInfo"].averageRating === 5 ? <img src={star} style={{width:20, height:20}} alt="star"></img> : ""}</TableCell> 
                            : <TableCell align="center" style={{fontFamily: "Arial", fontSize: 16}}>—</TableCell>
                        }
                        <TableCell align="center"><BookItem b={b} searchResults={searchResults} addAllDisabled={addAllDisabled}/></TableCell>
                      </TableRow>
                    )}
                </TableBody>
            </Table>
            </TableContainer>
            <Button style={{float:"right", marginRight:260, marginTop:20}} disabled={addAllDisabled} variant="contained" color="primary" onClick={() => {handleAddAllClicked(); setAddAllDisabled(true)}}>Add All</Button>
            <h3><br /><br />Thanks for using <i>Digital Library</i>!</h3>
          </div>
        }
    </div>
    );
};

export default BookList;

