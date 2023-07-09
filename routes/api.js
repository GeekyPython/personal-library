/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require('../models/bookSchema');

module.exports = async function (app) {

  app.route('/api/books')
    .get( async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      try
      {
        const response = await Book.find();

        if(!response)
        {
          return res.status(200).send("no book exists");
        }
        return res.status(200).json(response);
      }
      catch(err)
      {
        console.log(err);
        res.status(500).json({msg: err});
      }
    })
    
    .post(async function (req, res){

      try
      {
        let title = req.body.title;
        //response will contain new book object including atleast _id and title

        if(!title)
        {
          return res.status(200).send("missing required field title");
        }
        const book = new Book({title});
        const response = await book.save();

        if(!response)
        {
          console.log("Unable to add entry to DB");
          return res.status(500).json({msg: "Error, unable to add entry to DB"});
        }

        return res.status(200).json(response);
      }
      catch(err)
      {
        res.status(500).json({msg: err});
      }
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'

      try
      {
        const response = await Book.deleteMany({});
        if(!response)
        {
          return res.status(200).send("Unable to truncate DB");
        }
        res.status(200).send("complete delete successful")
      }
      catch(err)
      {
        console.log(err);
        res.status(200).json({msg: err});
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      const response =  await Book.findById(bookid);

      if(!response)
      {
        console.log(`Book with id ${bookid} not found`);
        return res.status(200).send("no book exists");
      }
      return res.status(200).json(response);
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if(!comment)
      {
        return res.status(200).send("missing required field comment");
      }
      const book = await Book.findById(bookid);

      if(!book)
      {
        return res.status(200).send(`no book exists`);
      }

      book.comments.push(comment);
      book.commentcount++;
      const response = await book.save();

      if(!response)
      {
        return res.status(500).json({msg: "Error could not add comment to DB"});
      }

      res.status(200).json(response);
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'

      try
      {
        let response = await Book.findByIdAndDelete(bookid);

        if(!response)
        {
          return res.status(200).send("no book exists");
        }
        
        res.status(200).send("delete successful");
      }
      catch(err)
      {
        console.log(err);
        res.status(200).json({msg: err});
      }
    });
  
};
