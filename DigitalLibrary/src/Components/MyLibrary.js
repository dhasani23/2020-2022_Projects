import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import LibraryItem from './LibraryItem.js';
import MyModal from './MyModal.js';
import defaultCover from './defaultCover.jpg';
import star from './star.png';

function MyLibrary() {

    const [myBooks, setMyBooks] = useState([]);
    const [removeAllDisabled, setRemoveAllDisabled] = useState(false);

    const handleReload = () => {
        window.location.reload(false); 
    }

    function getRating(r) {
        return r*20; // represents the % of the rating (e.g., a 4/5 = 80% since 4*20 = 80)
    }

    // remove duplicates in My Library
    function checkDuplicates() {
        var i;
        var links = [];
        var dups = [];
        for (i = 0; i < myBooks.length; i++) {
            if (links.includes(myBooks[i].canonicalVolumeLink)) {
                dups.push(myBooks[i]);
            } else {
                links.push(myBooks[i].canonicalVolumeLink);
            }
        }
        console.log(links);
        for (i = 0; i < dups.length; i++) {
            axios.delete("http://localhost:8080/delete/" + dups[i].firestoreID);
        }
        return dups;
    }

    const sortRating = (order) => {
        myBooks.sort((a, b) => {
            a.ratingForCalculation = a.averageRating;
            b.ratingForCalculation = b.averageRating;
            if (typeof a.averageRating == 'undefined') {
                a.ratingForCalculation = 0;
            }
            if (typeof b.averageRating == 'undefined') {
                b.ratingForCalculation = 0;
            }
            return order === "best" ? b.ratingForCalculation - a.ratingForCalculation : a.ratingForCalculation - b.ratingForCalculation;
        });
        setMyBooks(myBooks.map((c) => {
            return {...c};
        }));
    };

    const handleRemoveAllClicked = () => {
        var i;
        for (i = 0; i < myBooks.length; i++) {
            axios.delete("http://localhost:8080/delete/" + myBooks[i].firestoreID);
        }
        setRemoveAllDisabled(true);
    }

    useEffect(() => {
        const url = new URL("http://localhost:8080/library/");
        axios.get(url.toString())
        .then((response) => {
            setMyBooks(response.data);
        })
        .catch((err) => {
            console.log(err);
        })
    },[]);

    return (
          <div>
            <h2 style={{marginTop:10}}>My Library</h2>
            { checkDuplicates().length > 0 &&
                <h3 style={{color:"red"}}>Duplicate books found; press <i>update</i> to remove</h3>
            }
            <TableContainer>
            <Table aria-label="simple table" size="small" style={{borderTop: '3px solid black', borderBottom: '3px solid black', borderLeft: '3px solid black', borderRight: '3px solid black', width:1000}} align="center">
                <TableHead style={{backgroundColor:"white"}}>
                <TableRow>
                    <TableCell align="center" style={{fontFamily: "Arial", fontSize: 18}}><b>Book</b></TableCell>
                    <TableCell align="center" style={{fontFamily: "Arial", fontSize: 18}}><b>Front Cover</b></TableCell>
                    <TableCell align="center" style={{fontFamily: "Arial", fontSize: 18}}><b>Average Rating</b><br /><Button onClick={() => sortRating("best")} size="small">Best</Button><Button onClick={() => sortRating("worst")} size="small">Worst</Button></TableCell>
                    <TableCell align="center" style={{fontFamily: "Arial", fontSize: 18}}><b>Remove From <i>My Library</i></b></TableCell>
                </TableRow>
                </TableHead>
                <TableBody style={{backgroundColor:"white"}}>
                    {myBooks.map((b) =>   
                      <TableRow>
                        { typeof b.authors != "undefined"
                            ? <TableCell align="center">{<a href={b.previewLink} style={{fontFamily: "Arial", fontSize: 16}} target="_blank" rel="noreferrer"><i>{b.title}</i></a>} <br /> by {b.authors[0]} <br /> <MyModal b={b} /> <br /></TableCell>
                            : <TableCell align="center">{<a href={b.previewLink} style={{fontFamily: "Arial", fontSize: 16}} target="_blank" rel="noreferrer"><i>{b.title}</i></a>}<br /> <MyModal b={b} /> <br /> </TableCell>
                        }
                        { typeof b.imageLinks != "undefined"
                            ? <TableCell align="center"><img src={b.imageLinks.thumbnail} style={{width:77, height:100}} alt="bookCover"></img></TableCell>
                            : <TableCell align="center"><img src={defaultCover} style={{width:77, height:100}} alt="bookCover"></img></TableCell>
                        }
                        { typeof b.averageRating != "undefined"
                            ? <TableCell align="center" style={{fontFamily: "Arial", fontSize: 16}}>{getRating(b.averageRating)}% {b.averageRating === 5 ? <img src={star} style={{width:20, height:20}} alt="star"></img> : ""} </TableCell>        
                            : <TableCell align="center" style={{fontFamily: "Arial", fontSize: 16}}>—</TableCell>
                        }
                        <TableCell align="center"><LibraryItem b={b} removeAllDisabled={removeAllDisabled}/></TableCell>
                      </TableRow>
                    )}
                </TableBody>
            </Table>
            </TableContainer>
            <Button style={{float:"right", marginRight:260, marginTop:20}} disabled={removeAllDisabled} variant="contained" color="secondary" onClick={() => {handleRemoveAllClicked(); setRemoveAllDisabled(true)}}>Remove All</Button>
            <br /> <br /> <br />
            <Button  style={{marginTop:25}} variant="contained" onClick={handleReload}>Update</Button>
            <h3>Thanks for using <i>Digital Library</i>!</h3>
          </div>
    );
};

export default MyLibrary;
