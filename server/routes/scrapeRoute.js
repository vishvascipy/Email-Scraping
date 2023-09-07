import express from 'express'
import {singleurlController, multipleurlController} from '../controllers/scrapeController.js'
import {verifyEmail} from '../controllers/verifyEmail.js'
import { multiverifyEmail } from '../controllers/multiverifyEmail.js';
const router = express.Router()

// Create a route of single url for scraping
router.post('/getscrap', singleurlController );

//Create a route of multiple url for scraping 
router.post('/multipleurl', multipleurlController)


router.post("/verifyemail", verifyEmail);

router.post("/multiverifyemail", multiverifyEmail)

export default router



