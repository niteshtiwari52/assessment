const express = require("express");
const {
  fetchAndUploadContactsInDB,
  fetchAllData,
  fetchByMobileNumber,
  fetchByMonthsAndYear,

  createOrUpdateMarketingData,
} = require("../controllers/contacts-controller");

const router = express.Router();

router.post("/fetchAndUploadInDB", fetchAndUploadContactsInDB);
router.post("/createMarketingData", createOrUpdateMarketingData);
router.get("/fetchAllData", fetchAllData);
router.get("/fetchByMobileNumber", fetchByMobileNumber);
router.get("/fetchByMonthsAndYear", fetchByMonthsAndYear);

module.exports = router;
