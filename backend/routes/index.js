const express = require("express");
const noteRouter =require("./noteRoute");

const router = express.Router();


router.use("/realtime", noteRouter )


module.exports = router;