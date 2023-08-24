import express from 'express'
import {singleurlController, multipleurlController} from '../controllers/scrapeController.js'
const router = express.Router()

// Create a route of single url for scraping
router.post('/getscrap', singleurlController );

//Create a route of multiple url for scraping 
router.post('/multipleurl', multipleurlController)

export default router



