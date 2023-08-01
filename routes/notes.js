const express = require('express')
const router = express.Router();
const fetchuser = require('../middelware/fetchuser');
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator');



// ROUTER 1 GEt all the noTES 
router.get('/fetchallnotes', fetchuser, async (req,res)=>{
    try {
        const notes = await Notes.find({user: req.user.id})
    res.json(notes)
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server errror");
        
    }
    

});

// ROute 2 Add a new note 
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'descripton must be atleast 5 character').isLength({min: 5}),
], async (req,res)=>
{
    try {
        const {title,description,tag} = req.body
        // if there are erroros return bad request errors 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array});
            
        }
        const note =new Notes({
            title ,
            description,    
            tag, 
            user: req.user.User.id,
        })
        const savedNotes = await note.save()
        res.json(savedNotes)
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server errror");
        
    }
});

// //Route # 3 uodate an existing note 
// router.put('/updatenote/:id',fetchuser,async(req,res)=>{
// const {title,description,tag} = req.body;

// try {
// // create a newNote object 
// const newNote={};
// if (title) {newNote.title=title};
// if (description) {newNote.description=description};
// if (tag) {newNote.tag=tag};

// // find the note to uddated and update it
// let note = await Notes.findById(req.params.id);
// // console.log("user id", req.user.User.id)
// // console.log("updated note", note)
// // console.log("user note", note)

// if(!note){return res.sendStatus(404).send("Not found")}
// if(note?.user?.toString()!==req.user.id){
//     return res.status(401).send("Not Allowed")
// }

// note = await Notes.findByIdAndUpdate(req.params.id,{$set: newNote},{new:true})
// res.json({note});
// } catch (error) {
//     console.error(error.message);
//     res.status(500).send("internal server errror");
    
// }
// });

//Route # 3 update an existing note 
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
  
    try {
      // create a newNote object 
      const newNote = {};
      if (title) newNote.title = title;
      if (description) newNote.description = description;
      if (tag) newNote.tag = tag;
  
      // find the note to be updated and update it
      let note = await Notes.findById(req.params.id);
      // console.log("user id", req.user.User.id)
      // console.log("updated note", note)
      // console.log("user note", note)
  
      if (!note) {
        return res.status(404).send("Not found"); // Changed from res.sendStatus(404)
      }
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
      }
  
      note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
      res.json({ note });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error"); // Changed from "internal server errror"
    }
  });
  


//Route # 4 Delete an existing note 
router.delete('/deletenote/:id',fetchuser,async(req,res)=>{
    try {
        // find the note to delete and delete it
    let note = await Notes.findById(req.params.id);
    // console.log("user id", req.user.User.id)
    // console.log("updated note", note)
    // console.log("user note", note)
     if(!note){return res.sendStatus(404).send("Not found")}

    if(note?.user?.toString()!==req.user.id){
        return res.status(401).send("Not Allowed")
    }
    
    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({"success": "Note has been deleted", note: note });
}catch (error) {
    console.error(error.message);
    res.status(500).send("internal server errror");
    
}
    })
    


module.exports = router